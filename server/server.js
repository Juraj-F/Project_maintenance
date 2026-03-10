// server/server.js
import "dotenv/config";
import express from "express";
import bcrypt from "bcrypt";
import pg from "pg";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3001;
const hashRounds = 10;


// creating pools for DB connections
const LIVE_URL =
  process.env.LIVE_DATABASE_URL ||
  "postgres://postgres:1234@localhost:5432/secrets";

const OFFLINE_URL =
  process.env.OFFLINE_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5433/maintenance";

function makePool(connectionString) {
  return new pg.Pool({
    connectionString,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 3_000,
  });
}

// Two pools:
// - liveDb used for issues and auth
// - seeded DB used ONLY as fallback for auth
const liveDb = makePool(LIVE_URL);
const offlineDb = makePool(OFFLINE_URL);

let liveDbOnline = false;

async function pingLiveDb() {
  try {
    await liveDb.query("SELECT 1");
    if (!liveDbOnline) console.log("✅ LIVE DB reachable");
    liveDbOnline = true;
  } catch (err) {
    if (liveDbOnline) console.warn("⚠️ LIVE DB became unreachable");
    liveDbOnline = false;
  }
}

async function pingOfflineDb() {
  try {
    await offlineDb.query("SELECT 1");
    console.log("✅ OFFLINE seeded DB reachable");
  } catch (err) {
    console.warn("⚠️ OFFLINE seeded DB unreachable");
  }
}

// Boot + keep checking so it can recover when live comes back
await pingOfflineDb();
await pingLiveDb();
setInterval(pingLiveDb, 10_000);

// Auth DB selector: live first, fallback to offline seeded
async function getAuthDb() {
  if (liveDbOnline) return liveDb;

  try {
    await offlineDb.query("SELECT 1");
    console.log("✅ Connected to OFFLINE seeded DB");
    return offlineDb;
  } catch {
    return null;
  }
}

// Guard for issues routes: require live DB
function requireLiveDb(res) {
  if (!liveDbOnline) {
    res.status(503).json({ ok: false, error: "Live database unreachable" });
    return false;
  }
  return true;
}

//middleware to parse incoming json request bodies and put the result into req.body
app.use(express.json());


//health check of the api itself

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    liveDbOnline,
    authDb: liveDbOnline ? "live" : "offline-seeded-or-down",
    issuesDb: liveDbOnline ? "live" : "unavailable",
  });
});


// Register API

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "email and password are required" });
  }

  const db = await getAuthDb();
  if (!db) {
    return res.status(503).json({ ok: false, error: "No auth database reachable" });
  }

  try {
    const checkResult = await db.query("SELECT 1 FROM users WHERE email=$1", [email]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ ok: false, error: "User with this email already exists" });
    }

    const hash = await bcrypt.hash(password, hashRounds);
    await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hash]);

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("REGISTER error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});


// Login API

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "email and password are required" });
  }
  if (!String(email).includes("@")) {
    return res.status(400).json({ ok: false, error: "Invalid email, email must contain '@'" });
  }

  const db = await getAuthDb();
  if (!db) {
    return res.status(503).json({ ok: false, error: "No auth database reachable" });
  }

  try {
    const result = await db.query("SELECT id, email, password, role FROM users WHERE email=$1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const result2 = await db.query(
      "SELECT user_id, station_id FROM station_access WHERE user_id=$1 ORDER BY station_id",
      [user.id]
    );

    const stationIds = result2.rows.map((s) => s.station_id);

    return res.json({
      ok: true,
      user: { id: user.id, email: user.email, role: user.role },
      user_access: { stationIds },
    });
  } catch (err) {
    console.error("LOGIN error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});


// API for inserting issues data into live issues db table
// after user fill out the partForm and confim it with the
// send button, the form data is sent to the issues db 
// using the the issues api below

app.post("/api/issues", async (req, res) => {
  if (!requireLiveDb(res)) return;

  const { partId, stationId, email, criticality, description, userid } = req.body ?? {};

  if (!email || !description || !criticality) {
    return res.status(400).json({ ok: false, error: "all fields are required" });
  }

  try {
    const exists = await liveDb.query("SELECT 1 FROM issues WHERE partid=$1 AND status='open'", [partId]);

    if (exists.rows.length > 0) {
      return res.status(409).json({
        ok: false,
        error: `This assembly is already being troubleshooted partId="${partId}"`,
        inLiveDb: "yes",
      });
    }

    await liveDb.query(
      "INSERT INTO issues (stationid, partid, criticality, description, createdbyuserid, email) VALUES ($1, $2, $3, $4, $5, $6)",
      [stationId, partId, criticality, description, userid, email]
    );

    return res.json({
      ok: true,
      issue: { partId, stationId, email, criticality, description },
    });
  } catch (err) {
    console.error("POST /api/issues error:", err, partId);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// getting the existing items from live db
// in order to show status in BOM table
app.get("/api/issues/forms", async (req, res) => {
  if (!requireLiveDb(res)) return;

  const { stationId } = req.query;

  if (!stationId) {
    return res.status(400).json({ ok: false, error: "Missing stationId" });
  }

  try {
   
    const result = await liveDb.query("SELECT * FROM issues WHERE stationid=$1", [stationId]);

    return res.status(200).json({
      ok: true,
      issues: result.rows || [],
    });
  } catch (err) {
    console.error("GET /api/issues/forms:", err);
    return res.status(503).json({ ok: false, error: "Live database unreachable" });
  }
});

// API for the form export 
// export functionality is only awailable for the 
// admin role user, using the export the data 
// can be stored in the drafts export json file

app.post("/api/drafts/export", async (req, res) => {
  const role = String(req.headers["x-role"] || "").toLowerCase();


  if (role !== "admin") {
    return res.status(403).json({ ok: false, error: "Admin access required" });
  }

  const drafts = req.body;

  fs.writeFileSync("../server/db/drafts_export.json", JSON.stringify(drafts, null, 2));

  return res.json({ ok: true });
});

// beginning of admin dashboard section

app.get("/api/issues/allforms", async (req, res) => {
  if (!requireLiveDb(res)) return;

// Checking the role admin 
  const role = String(req.headers["x-role"] || "").toLowerCase();

  if (role !== "admin") {
    return res.status(403).json({ ok: false, error: "Admin access required" });
  }

  try {
   
    const result = await liveDb.query("SELECT * FROM issues");
    console.log("alldata",result)

    return res.status(200).json({
      ok: true,
      issues: result.rows || [],
    });
  } catch (err) {
    console.error("GET /api/issues/allforms:", err);
    return res.status(503).json({ ok: false, error: "Live database unreachable" });
  }
});


// server started messages
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
  console.log("LIVE_DATABASE_URL set:", Boolean(process.env.LIVE_DATABASE_URL));
  console.log("OFFLINE_DATABASE_URL set:", Boolean(process.env.OFFLINE_DATABASE_URL));
});
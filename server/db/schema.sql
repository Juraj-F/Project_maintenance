CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS station_access (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  station_id TEXT NOT NULL,
  UNIQUE (user_id, station_id)
);


CREATE TABLE IF NOT EXISTS public.issues (
  id SERIAL PRIMARY KEY,
  stationid TEXT NOT NULL,
  partid TEXT NOT NULL,
  email TEXT NOT NULL,
  criticality TEXT NOT NULL,
  description TEXT NOT NULL,
  createdbyuserid INTEGER,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now()
);

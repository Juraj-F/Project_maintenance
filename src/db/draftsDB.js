import Dexie from "dexie";

export const db = new Dexie("maintenanceDrafts");

db.version(1).stores({
  drafts: "partId, savedAt", 
});

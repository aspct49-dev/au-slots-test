import path from "path";
import fs from "fs";

export const DATA_DIR = path.join(process.cwd(), "data");

// Priority order for write (and read-fallback) directory:
//   1. DATA_PERSIST_DIR env var  — set this to a Railway persistent volume
//      mount path (e.g. /data) so writes survive deploys.
//   2. /tmp/auslots-data         — fallback for any production host where the
//      codebase directory is read-only. Survives restarts within the same
//      container session but NOT across deploys.
//   3. DATA_DIR (dev only)       — write directly to the data/ folder.
export const WRITE_DIR =
  process.env.DATA_PERSIST_DIR ??
  (process.env.NODE_ENV === "production" ? "/tmp/auslots-data" : DATA_DIR);

// Ensure the write directory exists at import time so every store can
// safely call fs.writeFileSync without a separate mkdirSync guard.
if (WRITE_DIR !== DATA_DIR) {
  try {
    fs.mkdirSync(WRITE_DIR, { recursive: true });
  } catch {
    // best-effort — individual stores still call ensureDir() before writes
  }
}

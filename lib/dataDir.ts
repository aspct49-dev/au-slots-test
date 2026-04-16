import path from "path";

export const DATA_DIR = path.join(process.cwd(), "data");

// In any production environment (Vercel, Railway, etc.) the deployed
// codebase is read-only. Write to /tmp instead; reads prefer that copy
// when it exists so they always see the latest state.
export const WRITE_DIR =
  process.env.NODE_ENV === "production" ? "/tmp/auslots-data" : DATA_DIR;

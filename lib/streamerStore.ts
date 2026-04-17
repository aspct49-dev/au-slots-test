import pool from "./db";

export async function getStreamers(): Promise<string[]> {
  const { rows } = await pool.query("SELECT username FROM streamers ORDER BY username ASC");
  return rows.map(r => r.username);
}

export async function addStreamer(username: string): Promise<string[]> {
  const u = username.trim().toLowerCase();
  await pool.query(
    "INSERT INTO streamers (username) VALUES ($1) ON CONFLICT DO NOTHING",
    [u]
  );
  return getStreamers();
}

export async function removeStreamer(username: string): Promise<string[]> {
  await pool.query("DELETE FROM streamers WHERE username=$1", [username.trim().toLowerCase()]);
  return getStreamers();
}

export async function isStreamer(username: string): Promise<boolean> {
  const { rows } = await pool.query(
    "SELECT 1 FROM streamers WHERE username=$1",
    [username.trim().toLowerCase()]
  );
  return rows.length > 0;
}

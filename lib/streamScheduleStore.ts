import pool from "./db";

export interface ScheduleEntry {
  id: number;
  date: string;
  medi: string;
  layto: string;
  aus: string;
}

export async function getStreamSchedule(): Promise<ScheduleEntry[]> {
  const { rows } = await pool.query("SELECT * FROM stream_schedule ORDER BY date ASC");
  return rows.map(r => ({ id: r.id, date: r.date, medi: r.medi, layto: r.layto, aus: r.aus }));
}

export async function upsertScheduleEntries(entries: { date: string; medi: string; layto: string; aus: string }[]): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const e of entries) {
      await client.query(
        `INSERT INTO stream_schedule (date, medi, layto, aus)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (date) DO UPDATE SET medi=$2, layto=$3, aus=$4`,
        [e.date, e.medi, e.layto, e.aus]
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteScheduleEntry(date: string): Promise<void> {
  await pool.query("DELETE FROM stream_schedule WHERE date=$1", [date]);
}

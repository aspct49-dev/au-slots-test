import pool from "./db";

export interface StreamDay {
  day: string;
  fullDay: string;
  streamer: string;
  time: string;
  type: string;
  color: string;
  isMain: boolean;
  special?: boolean;
  off?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToDay(row: any): StreamDay {
  return {
    day:      row.day,
    fullDay:  row.full_day,
    streamer: row.streamer,
    time:     row.time,
    type:     row.type,
    color:    row.color,
    isMain:   row.is_main,
    special:  row.special  ?? false,
    off:      row.off      ?? false,
  };
}

export async function getSchedule(): Promise<StreamDay[]> {
  const ORDER = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  const { rows } = await pool.query("SELECT * FROM schedule");
  const days = rows.map(rowToDay);
  days.sort((a, b) => ORDER.indexOf(a.day) - ORDER.indexOf(b.day));
  return days;
}

export async function saveSchedule(schedule: StreamDay[]): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const d of schedule) {
      await client.query(
        `INSERT INTO schedule (day, full_day, streamer, time, type, color, is_main, special, off)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (day) DO UPDATE SET
           full_day=$2, streamer=$3, time=$4, type=$5, color=$6,
           is_main=$7, special=$8, off=$9`,
        [d.day, d.fullDay, d.streamer, d.time, d.type, d.color,
         d.isMain, d.special ?? false, d.off ?? false]
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

import pool from "./db";

export type HuntStatus = "active" | "closed" | "ended";

export interface Hunt {
  id: string;
  startingBalance: number;
  numberOfBonuses: number;
  endingBalance: number | null;
  status: HuntStatus;
  startedAt: number;
  closedAt?: number;
  endedAt?: number;
  winnerGuessId?: string;
  casinoElementsUrl?: string;
}

export interface Guess {
  id: string;
  huntId: string;
  username: string;
  guess: number;
  submittedAt: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToHunt(row: any): Hunt {
  return {
    id:               row.id,
    startingBalance:  Number(row.starting_balance),
    numberOfBonuses:  row.number_of_bonuses,
    endingBalance:    row.ending_balance != null ? Number(row.ending_balance) : null,
    status:           row.status,
    startedAt:        Number(row.started_at),
    closedAt:         row.closed_at  ? Number(row.closed_at)  : undefined,
    endedAt:          row.ended_at   ? Number(row.ended_at)   : undefined,
    winnerGuessId:      row.winner_guess_id ?? undefined,
    casinoElementsUrl:  row.casino_elements_url ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToGuess(row: any): Guess {
  return {
    id:          row.id,
    huntId:      row.hunt_id,
    username:    row.username,
    guess:       Number(row.guess),
    submittedAt: Number(row.submitted_at),
  };
}

// ── Hunt ──────────────────────────────────────────────────────────────────────

export async function getCurrentHunt(): Promise<Hunt | null> {
  const { rows } = await pool.query(
    "SELECT * FROM hunts WHERE cleared_at IS NULL ORDER BY started_at DESC LIMIT 1"
  );
  return rows[0] ? rowToHunt(rows[0]) : null;
}

export async function startHunt(startingBalance: number, numberOfBonuses: number, casinoElementsUrl?: string): Promise<Hunt> {
  const { rows } = await pool.query(
    `INSERT INTO hunts (id, starting_balance, number_of_bonuses, ending_balance, status, started_at, casino_elements_url)
     VALUES ($1,$2,$3,NULL,'active',$4,$5) RETURNING *`,
    [Date.now().toString(), startingBalance, numberOfBonuses, Date.now(), casinoElementsUrl ?? null]
  );
  return rowToHunt(rows[0]);
}

export async function setCasinoElementsUrl(huntId: string, url: string): Promise<Hunt | null> {
  const { rows } = await pool.query(
    "UPDATE hunts SET casino_elements_url=$2 WHERE id=$1 RETURNING *",
    [huntId, url || null]
  );
  return rows[0] ? rowToHunt(rows[0]) : null;
}

export async function closeEntries(): Promise<Hunt | null> {
  const hunt = await getCurrentHunt();
  if (!hunt || hunt.status !== "active") return null;
  const { rows } = await pool.query(
    "UPDATE hunts SET status='closed', closed_at=$2 WHERE id=$1 RETURNING *",
    [hunt.id, Date.now()]
  );
  return rows[0] ? rowToHunt(rows[0]) : null;
}

export async function endHunt(endingBalance: number): Promise<{ hunt: Hunt; winner: Guess | null }> {
  const hunt = await getCurrentHunt();
  if (!hunt || hunt.status === "ended") return { hunt: hunt!, winner: null };

  const guesses = await getGuessesForHunt(hunt.id);
  let winner: Guess | null = null;

  if (guesses.length > 0) {
    winner = guesses.reduce((best, g) =>
      Math.abs(g.guess - endingBalance) < Math.abs(best.guess - endingBalance) ? g : best
    );
  }

  const { rows } = await pool.query(
    `UPDATE hunts SET
       status='ended', ending_balance=$2, ended_at=$3, winner_guess_id=$4
     WHERE id=$1 RETURNING *`,
    [hunt.id, endingBalance, Date.now(), winner?.id ?? null]
  );

  return { hunt: rowToHunt(rows[0]), winner };
}

export async function clearHunt(): Promise<void> {
  const hunt = await getCurrentHunt();
  if (!hunt) return;
  await pool.query("UPDATE hunts SET cleared_at=$2 WHERE id=$1", [hunt.id, Date.now()]);
}

// ── Guesses ───────────────────────────────────────────────────────────────────

export async function getGuessesForHunt(huntId: string): Promise<Guess[]> {
  const { rows } = await pool.query(
    "SELECT * FROM hunt_guesses WHERE hunt_id=$1 ORDER BY submitted_at ASC",
    [huntId]
  );
  return rows.map(rowToGuess);
}

export async function getUserGuess(huntId: string, username: string): Promise<Guess | null> {
  const { rows } = await pool.query(
    "SELECT * FROM hunt_guesses WHERE hunt_id=$1 AND LOWER(username)=LOWER($2)",
    [huntId, username]
  );
  return rows[0] ? rowToGuess(rows[0]) : null;
}

export async function addGuess(huntId: string, username: string, guess: number): Promise<Guess> {
  const { rows } = await pool.query(
    `INSERT INTO hunt_guesses (id, hunt_id, username, guess, submitted_at)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [Date.now().toString(), huntId, username, guess, Date.now()]
  );
  return rowToGuess(rows[0]);
}

export async function updateGuess(huntId: string, username: string, newGuess: number): Promise<Guess | null> {
  const { rows } = await pool.query(
    `UPDATE hunt_guesses SET guess=$3, submitted_at=$4
     WHERE hunt_id=$1 AND LOWER(username)=LOWER($2) RETURNING *`,
    [huntId, username, newGuess, Date.now()]
  );
  return rows[0] ? rowToGuess(rows[0]) : null;
}

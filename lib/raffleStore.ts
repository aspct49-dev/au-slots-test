import pool from "./db";

export interface Raffle {
  id: string;
  title: string;
  prize: string;
  ticketCost: number;
  status: "active" | "ended";
  createdAt: number;
  endedAt?: number;
  winner?: string;
  totalTickets?: number;
}

export interface RaffleTicket {
  id: string;
  raffleId: string;
  username: string;
  userId: string;
  quantity: number;
  purchasedAt: number;
  pointsSpent: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToRaffle(row: any): Raffle {
  return {
    id:         row.id,
    title:      row.title,
    prize:      row.prize,
    ticketCost: row.ticket_cost,
    status:     row.status,
    createdAt:  Number(row.created_at),
    endedAt:    row.ended_at ? Number(row.ended_at) : undefined,
    winner:     row.winner ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTicket(row: any): RaffleTicket {
  return {
    id:          row.id,
    raffleId:    row.raffle_id,
    username:    row.username,
    userId:      row.user_id,
    quantity:    row.quantity,
    purchasedAt: Number(row.purchased_at),
    pointsSpent: row.points_spent,
  };
}

// ── Raffles ───────────────────────────────────────────────────────────────────

export async function getRaffles(): Promise<Raffle[]> {
  const { rows } = await pool.query("SELECT * FROM raffles ORDER BY created_at DESC");
  return rows.map(rowToRaffle);
}

export async function getRaffleById(id: string): Promise<Raffle | null> {
  const { rows } = await pool.query("SELECT * FROM raffles WHERE id=$1", [id]);
  return rows[0] ? rowToRaffle(rows[0]) : null;
}

export async function createRaffle(
  data: { title: string; prize: string; ticketCost: number }
): Promise<Raffle> {
  const { rows } = await pool.query(
    `INSERT INTO raffles (id, title, prize, ticket_cost, status, created_at)
     VALUES ($1,$2,$3,$4,'active',$5) RETURNING *`,
    [Date.now().toString(), data.title, data.prize, data.ticketCost, Date.now()]
  );
  return rowToRaffle(rows[0]);
}

export async function deleteRaffle(id: string): Promise<boolean> {
  const { rowCount } = await pool.query("DELETE FROM raffles WHERE id=$1", [id]);
  return (rowCount ?? 0) > 0;
}

// ── Tickets ───────────────────────────────────────────────────────────────────

export async function getTicketsForRaffle(raffleId: string): Promise<RaffleTicket[]> {
  const { rows } = await pool.query(
    "SELECT * FROM raffle_tickets WHERE raffle_id=$1 ORDER BY purchased_at ASC",
    [raffleId]
  );
  return rows.map(rowToTicket);
}

export async function getUserTicketCount(raffleId: string, username: string): Promise<number> {
  const { rows } = await pool.query(
    "SELECT COALESCE(SUM(quantity),0) AS total FROM raffle_tickets WHERE raffle_id=$1 AND LOWER(username)=LOWER($2)",
    [raffleId, username]
  );
  return Number(rows[0].total);
}

export async function getTotalTicketCount(raffleId: string): Promise<number> {
  const { rows } = await pool.query(
    "SELECT COALESCE(SUM(quantity),0) AS total FROM raffle_tickets WHERE raffle_id=$1",
    [raffleId]
  );
  return Number(rows[0].total);
}

export async function addTickets(
  raffleId: string,
  username: string,
  userId: string,
  quantity: number,
  pointsSpent: number,
): Promise<RaffleTicket> {
  const { rows } = await pool.query(
    `INSERT INTO raffle_tickets (id, raffle_id, username, user_id, quantity, purchased_at, points_spent)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [Date.now().toString(), raffleId, username, userId, quantity, Date.now(), pointsSpent]
  );
  return rowToTicket(rows[0]);
}

// ── Roll winner ───────────────────────────────────────────────────────────────

export async function rollWinner(raffleId: string): Promise<Raffle | null> {
  const raffle = await getRaffleById(raffleId);
  if (!raffle || raffle.status !== "active") return null;

  const tickets = await getTicketsForRaffle(raffleId);
  if (tickets.length === 0) return null;

  // Build pool — one entry per ticket
  const pool_arr: string[] = [];
  for (const t of tickets) {
    for (let i = 0; i < t.quantity; i++) pool_arr.push(t.username);
  }

  const winner = pool_arr[Math.floor(Math.random() * pool_arr.length)];
  const endedAt = Date.now();

  const { rows } = await pool.query(
    "UPDATE raffles SET status='ended', ended_at=$2, winner=$3 WHERE id=$1 RETURNING *",
    [raffleId, endedAt, winner]
  );
  return rows[0] ? rowToRaffle(rows[0]) : null;
}

// ── With totals ───────────────────────────────────────────────────────────────

export async function getRaffleWithTotal(id: string): Promise<(Raffle & { totalTickets: number }) | null> {
  const r = await getRaffleById(id);
  if (!r) return null;
  return { ...r, totalTickets: await getTotalTicketCount(id) };
}

export async function getRafflesWithTotals(): Promise<(Raffle & { totalTickets: number })[]> {
  const raffles = await getRaffles();
  return Promise.all(
    raffles.map(async r => ({ ...r, totalTickets: await getTotalTicketCount(r.id) }))
  );
}

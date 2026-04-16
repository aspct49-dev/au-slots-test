import fs from "fs";
import { DATA_DIR, WRITE_DIR } from "./dataDir";

const IS_PROD = process.env.NODE_ENV === "production";

const RAFFLES_FILE       = `${DATA_DIR}/raffles.json`;
const RAFFLES_FILE_WRITE = `${WRITE_DIR}/raffles.json`;
const TICKETS_FILE       = `${DATA_DIR}/raffle-tickets.json`;
const TICKETS_FILE_WRITE = `${WRITE_DIR}/raffle-tickets.json`;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Raffle {
  id: string;
  title: string;          // e.g. "$500 Cash Raffle"
  prize: string;          // human-readable prize description
  ticketCost: number;     // points per ticket
  status: "active" | "ended";
  createdAt: number;
  endedAt?: number;
  winner?: string;        // username
  totalTickets?: number;  // computed — not stored
}

export interface RaffleTicket {
  id: string;
  raffleId: string;
  username: string;
  userId: string;
  quantity: number;       // tickets bought in this transaction
  purchasedAt: number;
  pointsSpent: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ensureDir() {
  if (!fs.existsSync(WRITE_DIR)) fs.mkdirSync(WRITE_DIR, { recursive: true });
}

function readJSON<T>(readFile: string, fallback: T): T {
  try {
    if (!fs.existsSync(readFile)) return fallback;
    return JSON.parse(fs.readFileSync(readFile, "utf-8")) as T;
  } catch { return fallback; }
}

function writeJSON<T>(file: string, data: T) {
  ensureDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

// ── Raffles ───────────────────────────────────────────────────────────────────

export function getRaffles(): Raffle[] {
  if (IS_PROD && fs.existsSync(RAFFLES_FILE_WRITE)) {
    return readJSON<Raffle[]>(RAFFLES_FILE_WRITE, []);
  }
  return readJSON<Raffle[]>(RAFFLES_FILE, []);
}

export function getRaffleById(id: string): Raffle | null {
  return getRaffles().find(r => r.id === id) ?? null;
}

export function createRaffle(data: { title: string; prize: string; ticketCost: number }): Raffle {
  const raffles = getRaffles();
  const raffle: Raffle = {
    id: Date.now().toString(),
    ...data,
    status: "active",
    createdAt: Date.now(),
  };
  raffles.unshift(raffle);
  writeJSON(RAFFLES_FILE_WRITE, raffles);
  return raffle;
}

export function deleteRaffle(id: string): boolean {
  const raffles = getRaffles();
  const filtered = raffles.filter(r => r.id !== id);
  if (filtered.length === raffles.length) return false;
  writeJSON(RAFFLES_FILE_WRITE, filtered);
  // also delete all tickets for this raffle
  const tickets = getTicketsForRaffle(id);
  if (tickets.length) {
    const all = getAllTickets();
    writeJSON(TICKETS_FILE_WRITE, all.filter(t => t.raffleId !== id));
  }
  return true;
}

// ── Tickets ───────────────────────────────────────────────────────────────────

export function getAllTickets(): RaffleTicket[] {
  if (IS_PROD && fs.existsSync(TICKETS_FILE_WRITE)) {
    return readJSON<RaffleTicket[]>(TICKETS_FILE_WRITE, []);
  }
  return readJSON<RaffleTicket[]>(TICKETS_FILE, []);
}

export function getTicketsForRaffle(raffleId: string): RaffleTicket[] {
  return getAllTickets().filter(t => t.raffleId === raffleId);
}

export function getUserTicketCount(raffleId: string, username: string): number {
  return getTicketsForRaffle(raffleId)
    .filter(t => t.username.toLowerCase() === username.toLowerCase())
    .reduce((sum, t) => sum + t.quantity, 0);
}

export function getTotalTicketCount(raffleId: string): number {
  return getTicketsForRaffle(raffleId).reduce((sum, t) => sum + t.quantity, 0);
}

export function addTickets(
  raffleId: string,
  username: string,
  userId: string,
  quantity: number,
  pointsSpent: number,
): RaffleTicket {
  const all = getAllTickets();
  const ticket: RaffleTicket = {
    id: Date.now().toString(),
    raffleId,
    username,
    userId,
    quantity,
    purchasedAt: Date.now(),
    pointsSpent,
  };
  all.push(ticket);
  writeJSON(TICKETS_FILE_WRITE, all);
  return ticket;
}

// ── Roll winner ───────────────────────────────────────────────────────────────

export function rollWinner(raffleId: string): Raffle | null {
  const raffles = getRaffles();
  const raffle = raffles.find(r => r.id === raffleId);
  if (!raffle || raffle.status !== "active") return null;

  const tickets = getTicketsForRaffle(raffleId);
  if (tickets.length === 0) return null;

  // Build pool — one entry per ticket so each ticket has equal weight
  const pool: string[] = [];
  for (const t of tickets) {
    for (let i = 0; i < t.quantity; i++) pool.push(t.username);
  }

  const winner = pool[Math.floor(Math.random() * pool.length)];
  raffle.status = "ended";
  raffle.endedAt = Date.now();
  raffle.winner = winner;

  writeJSON(RAFFLES_FILE_WRITE, raffles);
  return raffle;
}

// ── Helpers with totals ───────────────────────────────────────────────────────

export function getRaffleWithTotal(id: string): (Raffle & { totalTickets: number }) | null {
  const r = getRaffleById(id);
  if (!r) return null;
  return { ...r, totalTickets: getTotalTicketCount(id) };
}

export function getRafflesWithTotals(): (Raffle & { totalTickets: number })[] {
  return getRaffles().map(r => ({ ...r, totalTickets: getTotalTicketCount(r.id) }));
}

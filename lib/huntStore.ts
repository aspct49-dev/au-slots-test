import fs from "fs";
import path from "path";

const DATA_DIR    = path.join(process.cwd(), "data");
const HUNT_FILE   = path.join(DATA_DIR, "hunt.json");
const GUESSES_FILE = path.join(DATA_DIR, "hunt-guesses.json");

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
}

export interface Guess {
  id: string;
  huntId: string;
  username: string;
  guess: number;
  submittedAt: number;
}

// ── helpers ────────────────────────────────────────────────────────────────────

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON<T>(file: string, fallback: T): T {
  ensureDir();
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  } catch { return fallback; }
}

function writeJSON<T>(file: string, data: T) {
  ensureDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

// ── hunt ───────────────────────────────────────────────────────────────────────

export function getCurrentHunt(): Hunt | null {
  return readJSON<Hunt | null>(HUNT_FILE, null);
}

export function startHunt(startingBalance: number, numberOfBonuses: number): Hunt {
  const hunt: Hunt = {
    id: Date.now().toString(),
    startingBalance,
    numberOfBonuses,
    endingBalance: null,
    status: "active",
    startedAt: Date.now(),
  };
  writeJSON(HUNT_FILE, hunt);
  return hunt;
}

export function closeEntries(): Hunt | null {
  const hunt = getCurrentHunt();
  if (!hunt || hunt.status !== "active") return null;
  hunt.status = "closed";
  hunt.closedAt = Date.now();
  writeJSON(HUNT_FILE, hunt);
  return hunt;
}

export function endHunt(endingBalance: number): { hunt: Hunt; winner: Guess | null } {
  const hunt = getCurrentHunt();
  if (!hunt || hunt.status === "ended") return { hunt: hunt!, winner: null };

  const guesses = getGuessesForHunt(hunt.id);
  let winner: Guess | null = null;

  if (guesses.length > 0) {
    winner = guesses.reduce((best, g) =>
      Math.abs(g.guess - endingBalance) < Math.abs(best.guess - endingBalance) ? g : best
    );
  }

  hunt.status = "ended";
  hunt.endingBalance = endingBalance;
  hunt.endedAt = Date.now();
  hunt.winnerGuessId = winner?.id;
  writeJSON(HUNT_FILE, hunt);

  return { hunt, winner };
}

export function clearHunt() {
  ensureDir();
  if (fs.existsSync(HUNT_FILE)) fs.unlinkSync(HUNT_FILE);
}

// ── guesses ────────────────────────────────────────────────────────────────────

export function getGuessesForHunt(huntId: string): Guess[] {
  const all = readJSON<Guess[]>(GUESSES_FILE, []);
  return all.filter(g => g.huntId === huntId);
}

export function getUserGuess(huntId: string, username: string): Guess | null {
  const guesses = getGuessesForHunt(huntId);
  return guesses.find(g => g.username.toLowerCase() === username.toLowerCase()) ?? null;
}

export function addGuess(huntId: string, username: string, guess: number): Guess {
  const all = readJSON<Guess[]>(GUESSES_FILE, []);
  const entry: Guess = { id: Date.now().toString(), huntId, username, guess, submittedAt: Date.now() };
  all.push(entry);
  writeJSON(GUESSES_FILE, all);
  return entry;
}

export function updateGuess(huntId: string, username: string, newGuess: number): Guess | null {
  const all = readJSON<Guess[]>(GUESSES_FILE, []);
  const idx = all.findIndex(g => g.huntId === huntId && g.username.toLowerCase() === username.toLowerCase());
  if (idx === -1) return null;
  all[idx].guess = newGuess;
  all[idx].submittedAt = Date.now();
  writeJSON(GUESSES_FILE, all);
  return all[idx];
}

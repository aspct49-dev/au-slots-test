/**
 * Botrix API helpers
 *
 * Botrix sign convention (matches docs):
 *   points=250   → DEDUCTS 250 from user
 *   points=-250  → ADDS 250 to user
 *
 * Required env vars:
 *   BOTRIX_BID      — secret token (?bid=...)
 *   BOTRIX_CHANNEL  — Kick channel slug (e.g. "auslots")
 */

const BOTRIX_BASE = "https://botrix.live/api";

export interface BotrixLookupResult {
  username: string;
  points: number;
  uid: string | null;
}

function entryName(e: Record<string, unknown>): string {
  return String(e.name ?? e.username ?? e.displayName ?? "");
}

/** Look up a viewer on the Botrix leaderboard. Returns null if not found. */
export async function lookupBotrixUser(username: string): Promise<BotrixLookupResult | null> {
  const channel = process.env.BOTRIX_CHANNEL!;
  const url = `${BOTRIX_BASE}/public/leaderboard?platform=kick&user=${encodeURIComponent(channel)}&search=${encodeURIComponent(username)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Botrix leaderboard fetch failed: ${res.status} ${text}`);
  }

  const json = await res.json();

  let entries: Record<string, unknown>[];
  if (Array.isArray(json)) {
    entries = json;
  } else if (Array.isArray(json?.data)) {
    entries = json.data;
  } else if (json && typeof json === "object") {
    entries = [json as Record<string, unknown>];
  } else {
    return null;
  }

  const entry = entries.find(e => entryName(e).toLowerCase() === username.toLowerCase());
  if (!entry) return null;

  return {
    username: entryName(entry),
    points: Number(entry.points ?? 0),
    uid: entry.uid ? String(entry.uid) : null,
  };
}

/** Get a viewer's points balance (returns 0 if not on leaderboard) */
export async function getBotrixPoints(username: string): Promise<number> {
  const result = await lookupBotrixUser(username);
  return result?.points ?? 0;
}

/** Call the Botrix substractPoints endpoint with a raw points value.
 *  Positive = deduct, Negative = add (Botrix convention). */
async function callBotrixPoints(username: string, botrixPoints: number): Promise<void> {
  const bid = process.env.BOTRIX_BID!;
  const url = `${BOTRIX_BASE}/extension/substractPoints?name=${encodeURIComponent(username)}&platform=kick&points=${botrixPoints}&bid=${encodeURIComponent(bid)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Botrix API error: ${res.status} ${text}`);
  }

  const json: { success: boolean } = await res.json();
  if (!json.success) {
    throw new Error("Botrix returned success: false — user may have insufficient points");
  }
}

/**
 * ADD points to a user.
 * Sends a NEGATIVE value to Botrix (negative = add, per docs).
 */
export async function addBotrixPoints(username: string, amount: number): Promise<void> {
  if (amount <= 0) throw new Error("Amount must be positive");
  await callBotrixPoints(username, -Math.abs(amount)); // negative = add
}

/**
 * DEDUCT points from a user.
 * Sends a POSITIVE value to Botrix (positive = deduct, per docs).
 */
export async function deductBotrixPoints(
  uid: string,
  username: string,
  amount: number
): Promise<number> {
  if (amount <= 0) throw new Error("Amount must be positive");
  const bid = process.env.BOTRIX_BID!;
  const idParam = uid ? `uid=${encodeURIComponent(uid)}` : `name=${encodeURIComponent(username)}`;
  const url = `${BOTRIX_BASE}/extension/substractPoints?${idParam}&platform=kick&points=${Math.abs(amount)}&bid=${encodeURIComponent(bid)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Botrix deduction failed: ${res.status} ${text}`);
  }

  const json: { success: boolean } = await res.json();
  if (!json.success) throw new Error("Insufficient points");

  return getBotrixPoints(username);
}

/** @deprecated kept for compatibility */
export async function adjustBotrixPointsByName(username: string, amount: number): Promise<boolean> {
  if (amount > 0) {
    await addBotrixPoints(username, amount);
  } else {
    await deductBotrixPoints("", username, Math.abs(amount));
  }
  return true;
}

/** @deprecated */
export async function adjustBotrixPoints(uid: string, username: string, amount: number): Promise<void> {
  await adjustBotrixPointsByName(username, amount);
}

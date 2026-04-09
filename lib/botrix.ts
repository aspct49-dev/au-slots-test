/**
 * Botrix API helpers
 *
 * Botrix is a Kick loyalty/points bot. Get your API key from the Botrix dashboard.
 * Required env vars:
 *   BOTRIX_API_KEY   — your Botrix API key
 *   BOTRIX_CHANNEL   — your Kick channel name (e.g. "auslots")
 *
 * API reference: https://botrix.live (check your dashboard for the exact endpoints)
 */

const BOTRIX_BASE = "https://api.botrix.live/api";

export interface BotrixPointsResponse {
  points: number;
  username: string;
}

export interface BotrixDeductResponse {
  success: boolean;
  points: number;
  message?: string;
}

/** Get a viewer's current Botrix points balance */
export async function getBotrixPoints(username: string): Promise<number> {
  const channel = process.env.BOTRIX_CHANNEL!;
  const key = process.env.BOTRIX_API_KEY!;

  const url = `${BOTRIX_BASE}/points/${channel}?username=${encodeURIComponent(username)}&key=${encodeURIComponent(key)}`;

  const res = await fetch(url, {
    // Disable Next.js caching so we always get live balance
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Botrix points fetch failed: ${res.status} ${text}`);
  }

  const json: BotrixPointsResponse = await res.json();
  return json.points ?? 0;
}

/** Deduct points from a viewer's balance (e.g. after redeeming a reward) */
export async function deductBotrixPoints(
  username: string,
  amount: number
): Promise<number> {
  const channel = process.env.BOTRIX_CHANNEL!;
  const key = process.env.BOTRIX_API_KEY!;

  const res = await fetch(`${BOTRIX_BASE}/points/${channel}/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, amount, key }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Botrix points deduction failed: ${res.status} ${text}`);
  }

  const json: BotrixDeductResponse = await res.json();
  if (!json.success && json.success !== undefined) {
    throw new Error(json.message ?? "Botrix deduction returned failure");
  }

  // Return the remaining balance after deduction
  return json.points ?? 0;
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getCurrentHunt, getGuessesForHunt, getUserGuess } from "@/lib/huntStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const hunt = await getCurrentHunt();
    if (!hunt) return NextResponse.json(null);

    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    const username = session.user?.username ?? null;

    const guesses = await getGuessesForHunt(hunt.id);
    const myGuess = username ? await getUserGuess(hunt.id, username) : null;

    let winnerGuess = null;
    if (hunt.status === "ended" && hunt.winnerGuessId) {
      winnerGuess = guesses.find(g => g.id === hunt.winnerGuessId) ?? null;
    }

    return NextResponse.json({ hunt, totalGuesses: guesses.length, myGuess, winnerGuess });
  } catch (err) {
    console.error("[GET /api/hunt]", err);
    return NextResponse.json(null);
  }
}

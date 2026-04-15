import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getCurrentHunt, getUserGuess, addGuess, updateGuess } from "@/lib/huntStore";

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user) {
    return NextResponse.json({ error: "You must be logged in to guess" }, { status: 401 });
  }

  const { guess } = await req.json();
  if (typeof guess !== "number" || guess <= 0) {
    return NextResponse.json({ error: "Invalid guess amount" }, { status: 400 });
  }

  const hunt = getCurrentHunt();
  if (!hunt) return NextResponse.json({ error: "No active hunt" }, { status: 404 });
  if (hunt.status !== "active") {
    return NextResponse.json({ error: "Entries are closed" }, { status: 409 });
  }

  const username = session.user.username;
  const existing = getUserGuess(hunt.id, username);

  const result = existing
    ? updateGuess(hunt.id, username, guess)
    : addGuess(hunt.id, username, guess);

  return NextResponse.json({ ok: true, guess: result, updated: !!existing });
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { addBotrixPoints, deductBotrixPoints } from "@/lib/botrix";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user || !ADMIN_USERNAMES.includes(session.user.username.toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { username, amount, currentBalance } = await req.json();
  if (!username || typeof amount !== "number" || amount === 0) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  try {
    if (amount > 0) {
      // ADD points — sends negative value to Botrix
      await addBotrixPoints(username, amount);
    } else {
      // DEDUCT points — sends positive value to Botrix
      await deductBotrixPoints("", username, Math.abs(amount));
    }

    // Calculate new balance locally (leaderboard can be cached/slow)
    const newBalance = Math.max(0, (currentBalance ?? 0) + amount);
    return NextResponse.json({ newBalance });
  } catch (err) {
    console.error("[Admin adjust points]", err);
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}

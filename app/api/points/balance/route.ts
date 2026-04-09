import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getBotrixPoints } from "@/lib/botrix";

/** GET /api/points/balance — returns the logged-in user's live Botrix points */
export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const points = await getBotrixPoints(session.user.username);
    // Keep session in sync
    session.user.points = points;
    await session.save();
    return NextResponse.json({ points });
  } catch (err) {
    console.error("[Botrix balance error]", err);
    return NextResponse.json({ error: "Failed to fetch points" }, { status: 502 });
  }
}

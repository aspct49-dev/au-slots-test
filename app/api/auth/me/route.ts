import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getBotrixPoints } from "@/lib/botrix";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.user) {
    return NextResponse.json({ user: null });
  }

  // Refresh Botrix points on every /me call so the UI always shows live balance
  try {
    const points = await getBotrixPoints(session.user.username);
    session.user.points = points;
    await session.save();
  } catch {
    // Non-fatal: return stale points from session rather than failing
    console.warn("[Botrix] Could not refresh points for", session.user.username);
  }

  return NextResponse.json({
    user: {
      id: session.user.id,
      username: session.user.username,
      avatar: session.user.avatar,
      points: session.user.points ?? 0,
    },
  });
}

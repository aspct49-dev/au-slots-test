import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { lookupBotrixUser } from "@/lib/botrix";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

export async function GET(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user || !ADMIN_USERNAMES.includes(session.user.username.toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const username = req.nextUrl.searchParams.get("username");
  if (!username) return NextResponse.json({ error: "Missing username" }, { status: 400 });

  try {
    const result = await lookupBotrixUser(username);
    if (!result) {
      return NextResponse.json(
        { error: `"${username}" was not found on the Botrix leaderboard. They may have 0 points or have never chatted.` },
        { status: 404 }
      );
    }
    return NextResponse.json(result); // { username, points, uid }
  } catch (err) {
    console.error("[Admin points lookup]", err);
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}

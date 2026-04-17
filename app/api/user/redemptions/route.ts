import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getRedemptions } from "@/lib/shopStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const username = session.user.username.toLowerCase();
  const all = await getRedemptions();
  const mine = all.filter(r => r.username.toLowerCase() === username);

  return NextResponse.json(mine);
}

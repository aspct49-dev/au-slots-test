import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getNordVPNText, saveNordVPNText } from "@/lib/helpStore";

export const dynamic = "force-dynamic";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user || !ADMIN_USERNAMES.includes(session.user.username.toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;
    return NextResponse.json({ text: await getNordVPNText() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;
    const { text } = await req.json();
    if (typeof text !== "string") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    await saveNordVPNText(text);
    return NextResponse.json({ text });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

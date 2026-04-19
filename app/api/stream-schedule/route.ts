import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getStreamSchedule, upsertScheduleEntries, deleteScheduleEntry } from "@/lib/streamScheduleStore";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? process.env.NEXT_PUBLIC_ADMIN_USERNAMES ?? "auslots")
    .split(",").map(u => u.trim().toLowerCase());
  if (!session.user || !ADMIN_USERNAMES.includes(session.user.username.toLowerCase()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

export async function GET() {
  try {
    return NextResponse.json(await getStreamSchedule());
  } catch (err) {
    console.error("[stream-schedule] GET error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const entries = await req.json();
    if (!Array.isArray(entries)) return NextResponse.json({ error: "Expected array" }, { status: 400 });
    await upsertScheduleEntries(entries);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[stream-schedule] POST error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { date } = await req.json();
    await deleteScheduleEntry(date);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[stream-schedule] DELETE error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

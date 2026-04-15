import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getSchedule, saveSchedule, StreamDay } from "@/lib/scheduleStore";

export const dynamic = "force-dynamic";

// Public GET — used by StreamSchedule component on the home page
export async function GET() {
  return NextResponse.json(getSchedule());
}

// Admin PUT — saves the edited schedule
export async function PUT(req: NextRequest) {
  const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? process.env.NEXT_PUBLIC_ADMIN_USERNAMES ?? "auslots")
    .split(",").map(u => u.trim().toLowerCase());

  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user || !ADMIN_USERNAMES.includes(session.user.username.toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let schedule: StreamDay[];
  try {
    schedule = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(schedule) || schedule.length === 0) {
    return NextResponse.json({ error: "Invalid schedule data" }, { status: 400 });
  }

  saveSchedule(schedule);
  return NextResponse.json({ ok: true });
}

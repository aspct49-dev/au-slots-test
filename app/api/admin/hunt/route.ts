import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getCurrentHunt, startHunt, closeEntries, endHunt, clearHunt } from "@/lib/huntStore";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user || !ADMIN_USERNAMES.includes(session.user.username.toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

// GET — current hunt state
export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(getCurrentHunt());
}

// POST — start a new hunt
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { startingBalance, numberOfBonuses } = await req.json();
  if (!startingBalance || !numberOfBonuses) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = getCurrentHunt();
  if (existing && existing.status !== "ended") {
    return NextResponse.json({ error: "A hunt is already active" }, { status: 409 });
  }

  const hunt = startHunt(+startingBalance, +numberOfBonuses);
  return NextResponse.json(hunt, { status: 201 });
}

// PATCH — close entries | end hunt | clear
export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { action, endingBalance } = await req.json();

  if (action === "close") {
    const hunt = closeEntries();
    if (!hunt) return NextResponse.json({ error: "No active hunt to close" }, { status: 400 });
    return NextResponse.json(hunt);
  }

  if (action === "end") {
    if (typeof endingBalance !== "number") {
      return NextResponse.json({ error: "endingBalance required" }, { status: 400 });
    }
    const result = endHunt(endingBalance);
    return NextResponse.json(result);
  }

  if (action === "clear") {
    clearHunt();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getCurrentHunt, startHunt, closeEntries, endHunt, clearHunt } from "@/lib/huntStore";
import { isStreamer } from "@/lib/streamerStore";

export const dynamic = "force-dynamic";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

async function requireAdminOrStreamer(): Promise<NextResponse | null> {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const username = session.user.username;
  const allowed = ADMIN_USERNAMES.includes(username.toLowerCase()) || isStreamer(username);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

// GET — current hunt state
export async function GET() {
  try {
    const denied = await requireAdminOrStreamer();
    if (denied) return denied;
    return NextResponse.json(getCurrentHunt());
  } catch (err) {
    console.error("[GET /api/admin/hunt]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST — start a new hunt
export async function POST(req: NextRequest) {
  try {
    const denied = await requireAdminOrStreamer();
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
  } catch (err) {
    console.error("[POST /api/admin/hunt]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// PATCH — close entries | end hunt | clear
export async function PATCH(req: NextRequest) {
  try {
    const denied = await requireAdminOrStreamer();
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
  } catch (err) {
    console.error("[PATCH /api/admin/hunt]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

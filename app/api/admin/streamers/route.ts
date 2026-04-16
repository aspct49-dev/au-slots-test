import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getStreamers, addStreamer, removeStreamer } from "@/lib/streamerStore";

export const dynamic = "force-dynamic";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

async function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}

function isAdmin(username: string) {
  return ADMIN_USERNAMES.includes(username.toLowerCase());
}

// GET — any logged-in user can fetch the streamer list (to check their own role)
export async function GET() {
  try {
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json(getStreamers());
  } catch (err) {
    console.error("[GET /api/admin/streamers]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST — admin only, add a streamer
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.user || !isAdmin(session.user.username)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { username } = await req.json();
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }
    // Prevent admins from being added as streamers (they already have full access)
    if (isAdmin(username)) {
      return NextResponse.json({ error: "That user is already an admin" }, { status: 409 });
    }
    const list = addStreamer(username);
    return NextResponse.json(list);
  } catch (err) {
    console.error("[POST /api/admin/streamers]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE — admin only, remove a streamer
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.user || !isAdmin(session.user.username)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { username } = await req.json();
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }
    const list = removeStreamer(username);
    return NextResponse.json(list);
  } catch (err) {
    console.error("[DELETE /api/admin/streamers]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

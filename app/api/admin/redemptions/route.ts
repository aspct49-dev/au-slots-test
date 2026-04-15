import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getRedemptions, fulfillRedemption, rejectRedemption } from "@/lib/shopStore";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user || !ADMIN_USERNAMES.includes(session.user.username.toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");

  let redemptions = getRedemptions();
  if (status === "pending" || status === "fulfilled" || status === "rejected") {
    redemptions = redemptions.filter(r => r.status === status);
  }

  return NextResponse.json(redemptions);
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const { id, action, reason } = body as { id?: string; action?: string; reason?: string };

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (!action || action === "fulfill") {
    const updated = fulfillRedemption(id);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  }

  if (action === "reject") {
    const updated = rejectRedemption(id, reason ?? "");
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

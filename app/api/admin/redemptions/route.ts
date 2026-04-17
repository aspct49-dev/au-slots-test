import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getRedemptions, fulfillRedemption, rejectRedemption, incrementInventory } from "@/lib/shopStore";
import { addBotrixPoints } from "@/lib/botrix";

export const dynamic = "force-dynamic";

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

  let redemptions = await getRedemptions();
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
    const updated = await fulfillRedemption(id);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  }

  if (action === "reject") {
    const redemptions = await getRedemptions();
    const r = redemptions.find(r => r.id === id);
    if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await rejectRedemption(id, reason ?? "");
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    try {
      await addBotrixPoints(r.username, r.pointCost);
      await incrementInventory(r.itemId);
      console.log(`[Reject] Returned ${r.pointCost} pts to ${r.username} for "${r.itemName}"`);
    } catch (err) {
      console.error(`[Reject] Failed to return points to ${r.username}:`, err);
    }

    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

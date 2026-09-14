import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getRedemptions, fulfillRedemption, rejectRedemption, restorePendingRedemption, incrementInventory } from "@/lib/shopStore";
import { addBotrixPoints } from "@/lib/botrix";

export const dynamic = "force-dynamic";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

/** Returns the admin's username, or null if the caller isn't an admin. */
async function getAdmin(): Promise<string | null> {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user || !ADMIN_USERNAMES.includes(session.user.username.toLowerCase())) return null;
  return session.user.username;
}

const forbidden = () => NextResponse.json({ error: "Forbidden" }, { status: 403 });

export async function GET(req: NextRequest) {
  if (!(await getAdmin())) return forbidden();

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");

  let redemptions = await getRedemptions();
  if (status === "pending" || status === "fulfilled" || status === "rejected") {
    redemptions = redemptions.filter(r => r.status === status);
  }

  return NextResponse.json(redemptions);
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return forbidden();

  const body = await req.json();
  const { id, action, reason } = body as { id?: string; action?: string; reason?: string };

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const notPending = NextResponse.json(
    { error: "This redemption is no longer pending — it may have been cancelled or handled by another admin. Refresh the list." },
    { status: 409 }
  );

  if (!action || action === "fulfill") {
    const updated = await fulfillRedemption(id, admin);
    if (!updated) return notPending;
    console.log(`[Fulfill] ${admin} fulfilled "${updated.itemName}" for ${updated.username}`);
    return NextResponse.json(updated);
  }

  if (action === "reject") {
    const updated = await rejectRedemption(id, reason ?? "", admin);
    if (!updated) return notPending;

    try {
      await addBotrixPoints(updated.username, updated.pointCost);
    } catch (err) {
      await restorePendingRedemption(id);
      console.error(`[Reject] ${admin} rejected "${updated.itemName}" for ${updated.username} but the refund failed — reverted to pending:`, err);
      return NextResponse.json(
        { error: "Couldn't refund the player's points, so the redemption is still pending. Try again." },
        { status: 502 }
      );
    }

    await incrementInventory(updated.itemId);
    console.log(`[Reject] ${admin} rejected "${updated.itemName}" for ${updated.username} — returned ${updated.pointCost} pts`);
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { addBotrixPoints, getBotrixPoints } from "@/lib/botrix";
import { cancelRedemption, restorePendingRedemption, incrementInventory, getRedemptions } from "@/lib/shopStore";

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let redemptionId: string;
  try {
    ({ redemptionId } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!redemptionId) return NextResponse.json({ error: "Missing redemptionId" }, { status: 400 });

  const allRedemptions = await getRedemptions();
  const redemption = allRedemptions.find(r => r.id === redemptionId);

  if (!redemption) return NextResponse.json({ error: "Redemption not found" }, { status: 404 });
  if (redemption.username.toLowerCase() !== session.user.username.toLowerCase()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (redemption.status !== "pending") {
    return NextResponse.json({ error: "Only pending redemptions can be cancelled" }, { status: 409 });
  }

  // Claim the cancellation atomically so a double-click can't refund twice.
  const cancelled = await cancelRedemption(redemptionId);
  if (!cancelled) {
    return NextResponse.json({ error: "Only pending redemptions can be cancelled" }, { status: 409 });
  }

  try {
    await addBotrixPoints(session.user.username, redemption.pointCost);
  } catch (err) {
    // Refund failed: put the redemption back to pending so the points aren't lost.
    await restorePendingRedemption(redemptionId);
    console.error(`[Cancel refund error] ${session.user.username} "${redemption.itemName}" (${redemption.pointCost} pts) — reverted to pending:`, err);
    return NextResponse.json(
      { error: "We couldn't refund your points, so your redemption is still pending. Please try again or contact an admin." },
      { status: 502 }
    );
  }

  await incrementInventory(redemption.itemId);
  console.log(`[Cancel] ${session.user.username} cancelled "${redemption.itemName}" — refunded ${redemption.pointCost} pts`);

  let newBalance = session.user.points ?? 0;
  try {
    newBalance = await getBotrixPoints(session.user.username);
  } catch (err) {
    console.error("[Cancel balance check error]", err);
  }
  session.user.points = newBalance;
  await session.save();

  return NextResponse.json({ ok: true, points: newBalance });
}

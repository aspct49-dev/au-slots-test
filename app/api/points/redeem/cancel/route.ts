import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { addBotrixPoints, getBotrixPoints } from "@/lib/botrix";
import { cancelRedemption, incrementInventory, getRedemptions } from "@/lib/shopStore";

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

  await cancelRedemption(redemptionId);
  await incrementInventory(redemption.itemId);

  try {
    await addBotrixPoints(session.user.username, redemption.pointCost);
  } catch (err) {
    console.error("[Cancel refund error]", err);
  }

  const newBalance = await getBotrixPoints(session.user.username);
  session.user.points = newBalance;
  await session.save();

  return NextResponse.json({ ok: true, points: newBalance });
}

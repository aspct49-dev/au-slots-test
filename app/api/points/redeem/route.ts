import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getBotrixPoints, deductBotrixPoints } from "@/lib/botrix";

interface RedeemBody {
  itemId: string;
  itemName: string;
  pointCost: number;
}

/** POST /api/points/redeem — validates balance then deducts points via Botrix */
export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: RedeemBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { itemId, itemName, pointCost } = body;

  if (!itemId || !itemName || typeof pointCost !== "number" || pointCost <= 0) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const username = session.user.username;

  // Re-fetch live balance from Botrix to prevent stale-cache exploits
  let currentPoints: number;
  try {
    currentPoints = await getBotrixPoints(username);
  } catch (err) {
    console.error("[Botrix balance check error]", err);
    return NextResponse.json({ error: "Could not verify points balance" }, { status: 502 });
  }

  if (currentPoints < pointCost) {
    return NextResponse.json(
      { error: "Insufficient points", points: currentPoints },
      { status: 402 }
    );
  }

  // Deduct points via Botrix
  let newBalance: number;
  try {
    newBalance = await deductBotrixPoints(username, pointCost);
  } catch (err) {
    console.error("[Botrix deduction error]", err);
    return NextResponse.json({ error: "Failed to deduct points" }, { status: 502 });
  }

  // Sync the new balance back into the session
  session.user.points = newBalance;
  await session.save();

  console.log(
    `[Redeem] ${username} redeemed "${itemName}" (${itemId}) for ${pointCost} pts. New balance: ${newBalance}`
  );

  return NextResponse.json({
    ok: true,
    points: newBalance,
    message: `Successfully redeemed ${itemName}!`,
  });
}

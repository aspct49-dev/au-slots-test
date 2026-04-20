import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getBotrixPoints, deductBotrixPoints } from "@/lib/botrix";
import { getShopItems, decrementInventory, addRedemption, getRedemptions } from "@/lib/shopStore";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? process.env.NEXT_PUBLIC_ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

interface RedeemBody {
  itemId: string;
  itemName: string;
  pointCost: number;
}

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

  const items = await getShopItems();
  const item = items.find(i => i.id === itemId);
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
  if (item.inventory <= 0) return NextResponse.json({ error: "This item is sold out" }, { status: 409 });

  const username = session.user.username;
  const uid = session.user.id;
  const isAdmin = ADMIN_USERNAMES.includes(username.toLowerCase());

  if (!isAdmin) {
    const allRedemptions = await getRedemptions();
    const userRedemptions = allRedemptions.filter(r => r.username.toLowerCase() === username.toLowerCase());

    // Cooldown applies from the moment of any pending or fulfilled redemption.
    // Rejected redemptions are excluded so the cooldown is lifted on rejection.
    const lastActive = userRedemptions
      .filter(r => r.status === "pending" || r.status === "fulfilled")
      .sort((a, b) => b.redeemedAt - a.redeemedAt)[0];

    if (lastActive) {
      const msElapsed = Date.now() - lastActive.redeemedAt;
      if (msElapsed < COOLDOWN_MS) {
        const daysLeft = Math.ceil((COOLDOWN_MS - msElapsed) / (24 * 60 * 60 * 1000));
        const isPending = lastActive.status === "pending";
        return NextResponse.json(
          {
            error: isPending
              ? `You have a pending redemption. You can redeem again in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} if it is processed.`
              : `You can redeem again in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}. Items can only be redeemed once every 7 days.`,
          },
          { status: 429 }
        );
      }
    }
  }

  let currentPoints: number;
  try {
    currentPoints = await getBotrixPoints(username);
  } catch (err) {
    console.error("[Botrix balance check error]", err);
    return NextResponse.json({ error: "Could not verify points balance" }, { status: 502 });
  }

  if (currentPoints < pointCost) {
    return NextResponse.json({ error: "Insufficient points", points: currentPoints }, { status: 402 });
  }

  let newBalance: number;
  try {
    newBalance = await deductBotrixPoints(uid, username, pointCost);
  } catch (err) {
    console.error("[Botrix deduction error]", err);
    return NextResponse.json({ error: "Failed to deduct points" }, { status: 502 });
  }

  await decrementInventory(itemId);

  const redemption = await addRedemption({
    username, itemId, itemName,
    spinCount: item.spinCount,
    pointCost,
  });

  session.user.points = newBalance;
  await session.save();

  console.log(`[Redeem] ${username} redeemed "${itemName}" for ${pointCost} pts. New balance: ${newBalance}`);

  const redeemDesc = item.spinCount > 0 ? `${item.spinCount} free spins on ${itemName}` : itemName;

  return NextResponse.json({
    ok: true,
    points: newBalance,
    redemptionId: redemption.id,
    message: `Successfully redeemed ${redeemDesc}!`,
  });
}

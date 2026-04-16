import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getBotrixPoints, deductBotrixPoints } from "@/lib/botrix";
import { getShopItems, decrementInventory, addRedemption, getRedemptions } from "@/lib/shopStore";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? process.env.NEXT_PUBLIC_ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

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

  // Verify item exists and is in stock
  const items = getShopItems();
  const item = items.find(i => i.id === itemId);
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
  if (item.inventory <= 0) {
    return NextResponse.json({ error: "This item is sold out" }, { status: 409 });
  }

  const username = session.user.username;
  const uid = session.user.id;
  const isAdmin = ADMIN_USERNAMES.includes(username.toLowerCase());

  // 7-day cooldown check (admins exempt)
  if (!isAdmin) {
    const allRedemptions = getRedemptions();
    const userRedemptions = allRedemptions.filter(r => r.username.toLowerCase() === username.toLowerCase());

    // Block if there's a pending redemption (can't stack)
    const hasPending = userRedemptions.some(r => r.status === "pending");
    if (hasPending) {
      return NextResponse.json(
        { error: "You already have a pending redemption. Please wait for it to be processed." },
        { status: 429 }
      );
    }

    // Block if last fulfilled redemption was within 7 days
    const lastFulfilled = userRedemptions
      .filter(r => r.status === "fulfilled")
      .sort((a, b) => b.redeemedAt - a.redeemedAt)[0];

    if (lastFulfilled) {
      const msElapsed = Date.now() - lastFulfilled.redeemedAt;
      if (msElapsed < COOLDOWN_MS) {
        const msRemaining = COOLDOWN_MS - msElapsed;
        const daysLeft = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));
        return NextResponse.json(
          { error: `You can redeem again in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}. Items can only be redeemed once every 7 days.` },
          { status: 429 }
        );
      }
    }
  }

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
    newBalance = await deductBotrixPoints(uid, username, pointCost);
  } catch (err) {
    console.error("[Botrix deduction error]", err);
    return NextResponse.json({ error: "Failed to deduct points" }, { status: 502 });
  }

  // Decrement inventory
  decrementInventory(itemId);

  // Log the redemption
  const redemption = addRedemption({
    username,
    itemId,
    itemName,
    spinCount: item.spinCount,
    pointCost,
  });

  // Sync the new balance back into the session
  session.user.points = newBalance;
  await session.save();

  console.log(`[Redeem] ${username} redeemed "${itemName}" (${itemId}) for ${pointCost} pts. New balance: ${newBalance}`);

  const redeemDesc = item.spinCount > 0
    ? `${item.spinCount} free spins on ${itemName}`
    : itemName;

  return NextResponse.json({
    ok: true,
    points: newBalance,
    redemptionId: redemption.id,
    message: `Successfully redeemed ${redeemDesc}!`,
  });
}

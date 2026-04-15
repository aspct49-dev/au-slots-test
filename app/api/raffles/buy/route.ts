import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getBotrixPoints, deductBotrixPoints } from "@/lib/botrix";
import { getRaffleById, addTickets } from "@/lib/raffleStore";

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { raffleId, quantity } = await req.json();

  if (!raffleId || !quantity || quantity < 1 || !Number.isInteger(quantity)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const raffle = getRaffleById(raffleId);
  if (!raffle) return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
  if (raffle.status !== "active") {
    return NextResponse.json({ error: "This raffle is no longer active" }, { status: 409 });
  }

  const totalCost = raffle.ticketCost * quantity;
  const { username, id: userId } = session.user;

  // Verify live balance
  let currentPoints: number;
  try {
    currentPoints = await getBotrixPoints(username);
  } catch {
    return NextResponse.json({ error: "Could not verify points balance" }, { status: 502 });
  }

  if (currentPoints < totalCost) {
    return NextResponse.json(
      { error: "Insufficient points", points: currentPoints, needed: totalCost },
      { status: 402 }
    );
  }

  // Deduct points
  let newBalance: number;
  try {
    newBalance = await deductBotrixPoints(userId, username, totalCost);
  } catch {
    return NextResponse.json({ error: "Failed to deduct points" }, { status: 502 });
  }

  // Record tickets
  addTickets(raffleId, username, userId, quantity, totalCost);

  // Sync session
  session.user.points = newBalance;
  await session.save();

  console.log(`[Raffle] ${username} bought ${quantity} ticket(s) for raffle ${raffleId} (${totalCost} pts). Balance: ${newBalance}`);

  return NextResponse.json({
    ok: true,
    points: newBalance,
    ticketsBought: quantity,
    message: `${quantity} ticket${quantity > 1 ? "s" : ""} purchased!`,
  });
}

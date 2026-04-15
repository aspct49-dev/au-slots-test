import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import {
  getRafflesWithTotals,
  createRaffle,
  deleteRaffle,
  rollWinner,
  getTicketsForRaffle,
} from "@/lib/raffleStore";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user || !ADMIN_USERNAMES.includes(session.user.username.toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

// GET — list all raffles with totals + ticket breakdowns
export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const raffles = getRafflesWithTotals();
  const withTickets = raffles.map(r => ({
    ...r,
    tickets: getTicketsForRaffle(r.id),
  }));
  return NextResponse.json(withTickets);
}

// POST — create raffle
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { title, prize, ticketCost } = await req.json();
  if (!title || !prize || !ticketCost || ticketCost <= 0) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const raffle = createRaffle({ title, prize, ticketCost: Number(ticketCost) });
  return NextResponse.json(raffle, { status: 201 });
}

// PATCH — roll winner or other actions
export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id, action } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (action === "roll") {
    const updated = rollWinner(id);
    if (!updated) return NextResponse.json({ error: "No tickets or raffle not found" }, { status: 400 });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// DELETE — delete raffle
export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const ok = deleteRaffle(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

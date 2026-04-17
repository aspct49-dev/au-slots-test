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
import { isStreamer } from "@/lib/streamerStore";

export const dynamic = "force-dynamic";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

async function requireAdminOrStreamer(): Promise<{ session: Awaited<ReturnType<typeof getIronSession<SessionData>>> } | NextResponse> {
  const cookieStore = cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  if (!session.user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const username = session.user.username.toLowerCase();
  const allowed = ADMIN_USERNAMES.includes(username) || await isStreamer(username);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return { session };
}

export async function GET() {
  try {
    const result = await requireAdminOrStreamer();
    if (result instanceof NextResponse) return result;

    const raffles = await getRafflesWithTotals();
    const withTickets = await Promise.all(
      raffles.map(async r => ({ ...r, tickets: await getTicketsForRaffle(r.id) }))
    );
    return NextResponse.json(withTickets);
  } catch (err) {
    console.error("[GET /api/admin/raffles]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const result = await requireAdminOrStreamer();
    if (result instanceof NextResponse) return result;

    const body = await req.json();
    const { title, prize, ticketCost } = body as { title: string; prize: string; ticketCost: number };

    if (!title || !prize || !ticketCost || Number(ticketCost) <= 0) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const raffle = await createRaffle({ title, prize, ticketCost: Number(ticketCost) });
    return NextResponse.json(raffle, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/raffles]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const result = await requireAdminOrStreamer();
    if (result instanceof NextResponse) return result;

    const { id, action } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    if (action === "roll") {
      const updated = await rollWinner(id);
      if (!updated) return NextResponse.json({ error: "No tickets or raffle not found" }, { status: 400 });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[PATCH /api/admin/raffles]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const result = await requireAdminOrStreamer();
    if (result instanceof NextResponse) return result;

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const ok = await deleteRaffle(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/raffles]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

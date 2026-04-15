import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getRafflesWithTotals, getUserTicketCount } from "@/lib/raffleStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const username = session.user?.username ?? null;

  const raffles = getRafflesWithTotals();

  const result = raffles.map(r => ({
    ...r,
    myTickets: username ? getUserTicketCount(r.id, username) : 0,
  }));

  return NextResponse.json(result);
}

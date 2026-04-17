import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getRafflesWithTotals, getUserTicketCount } from "@/lib/raffleStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const username = session.user?.username ?? null;

  const raffles = await getRafflesWithTotals();

  const result = await Promise.all(
    raffles.map(async r => ({
      ...r,
      myTickets: username ? await getUserTicketCount(r.id, username) : 0,
    }))
  );

  return NextResponse.json(result);
}

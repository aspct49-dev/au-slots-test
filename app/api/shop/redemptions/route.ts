import { NextResponse } from "next/server";
import { getRedemptions } from "@/lib/shopStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const all = await getRedemptions();

  const feed = all.map(r => ({
    id:          r.id,
    username:    r.username,
    itemName:    r.itemName,
    spinCount:   r.spinCount,
    pointCost:   r.pointCost,
    redeemedAt:  r.redeemedAt,
    status:      r.status,
    fulfilledAt: r.fulfilledAt,
    rejectedAt:  r.rejectedAt,
  }));

  return NextResponse.json(feed);
}

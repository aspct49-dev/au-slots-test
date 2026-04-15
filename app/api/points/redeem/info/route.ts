import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { updateRedemptionInfo, getRedemptions } from "@/lib/shopStore";

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { redemptionId, viperSpinEmail, zestyBetInfo, discordUsername } = await req.json();

  if (!redemptionId) {
    return NextResponse.json({ error: "Missing redemptionId" }, { status: 400 });
  }

  // Verify the redemption belongs to this user
  const redemptions = getRedemptions();
  const r = redemptions.find(r => r.id === redemptionId);
  if (!r) return NextResponse.json({ error: "Redemption not found" }, { status: 404 });
  if (r.username.toLowerCase() !== session.user.username.toLowerCase()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = updateRedemptionInfo(redemptionId, {
    viperSpinEmail:  viperSpinEmail  ?? "",
    zestyBetInfo:    zestyBetInfo    ?? "",
    discordUsername: discordUsername ?? "",
  });

  return NextResponse.json({ ok: true, redemption: updated });
}

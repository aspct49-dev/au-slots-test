import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getVault, setVault } from "@/lib/vaultStore";

export const dynamic = "force-dynamic";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!ADMIN_USERNAMES.includes(session.user.username.toLowerCase()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

export async function GET() {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;
    return NextResponse.json(await getVault());
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;
    const { currentAmount, maxAmount } = await req.json();
    if (typeof currentAmount !== "number" || typeof maxAmount !== "number")
      return NextResponse.json({ error: "currentAmount and maxAmount required" }, { status: 400 });
    return NextResponse.json(await setVault(currentAmount, maxAmount));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

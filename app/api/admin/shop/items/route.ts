import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getShopItems, addShopItem } from "@/lib/shopStore";

const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

async function requireAdmin(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user || !ADMIN_USERNAMES.includes(session.user.username.toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json(getShopItems());
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = await req.json();
  const { gameName, provider, spinCount, pointCost, inventory, maxInventory, gradient, providerColor, imageUrl } = body;

  if (!gameName || !provider || !spinCount || !pointCost) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const item = addShopItem({ gameName, provider, spinCount: +spinCount, pointCost: +pointCost, inventory: +inventory, maxInventory: +maxInventory, gradient, providerColor, imageUrl });
  return NextResponse.json(item, { status: 201 });
}

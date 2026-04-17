import { NextResponse } from "next/server";
import { getShopItems } from "@/lib/shopStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getShopItems();
  return NextResponse.json(items);
}

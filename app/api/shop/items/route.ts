import { NextResponse } from "next/server";
import { getShopItems } from "@/lib/shopStore";

export async function GET() {
  const items = getShopItems();
  return NextResponse.json(items);
}

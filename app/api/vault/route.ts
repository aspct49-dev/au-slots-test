import { NextResponse } from "next/server";
import { getVault } from "@/lib/vaultStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getVault());
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

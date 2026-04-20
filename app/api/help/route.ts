import { NextResponse } from "next/server";
import { getNordVPNText } from "@/lib/helpStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ text: await getNordVPNText() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

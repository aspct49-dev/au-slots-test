import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CHANNEL = process.env.NEXT_PUBLIC_KICK_CHANNEL ?? "auslots";

export async function GET() {
  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(CHANNEL)}`, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    if (!res.ok) return NextResponse.json({ live: false });

    const data = await res.json();
    const isLive = !!data?.livestream;
    const viewers: number = data?.livestream?.viewer_count ?? 0;

    return NextResponse.json({ live: isLive, viewers });
  } catch {
    return NextResponse.json({ live: false });
  }
}

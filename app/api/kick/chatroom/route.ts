import { NextRequest, NextResponse } from "next/server";

// Proxy for Kick's channel API — avoids CORS in the browser
export async function GET(req: NextRequest) {
  const channel = req.nextUrl.searchParams.get("channel");
  if (!channel) return NextResponse.json({ error: "Missing channel" }, { status: 400 });

  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(channel)}`, {
      headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ error: `Kick API ${res.status}` }, { status: res.status });
    const data = await res.json();
    const chatroomId = data?.chatroom?.id ?? null;
    return NextResponse.json({ chatroomId });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CHANNEL = process.env.NEXT_PUBLIC_KICK_CHANNEL ?? "auslots";
const CLIENT_ID = process.env.KICK_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.KICK_CLIENT_SECRET ?? "";

// Cache the token in memory so we don't re-fetch it every 60 seconds
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && Date.now() < tokenExpiresAt - 10_000) return cachedToken;

  try {
    const res = await fetch("https://id.kick.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[live-status] token error", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;
    return cachedToken;
  } catch (err) {
    console.error("[live-status] token fetch threw:", err);
    return null;
  }
}

export async function GET() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json({ live: false, debug: "missing_credentials" });
  }

  const token = await getAccessToken();
  if (!token) return NextResponse.json({ live: false, debug: "no_token" });

  try {
    // Official Kick API — not Cloudflare-blocked
    const res = await fetch(
      `https://api.kick.com/public/v1/channels?broadcaster_user_login=${encodeURIComponent(CHANNEL)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Client-Id": CLIENT_ID,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("[live-status] channels API error", res.status, body.slice(0, 300));
      return NextResponse.json({ live: false, debug: `channels_${res.status}` });
    }

    const data = await res.json();
    // Response: { data: [{ is_live: bool, viewer_count: number, ... }] }
    const channel = Array.isArray(data?.data) ? data.data[0] : data?.data ?? data;
    const isLive: boolean = !!(channel?.is_live ?? channel?.livestream ?? false);
    const viewers: number = channel?.viewer_count ?? channel?.livestream?.viewer_count ?? 0;

    console.log(`[live-status] channel=${CHANNEL} live=${isLive} viewers=${viewers}`);
    return NextResponse.json({ live: isLive, viewers });
  } catch (err) {
    console.error("[live-status] channels fetch threw:", err);
    return NextResponse.json({ live: false, debug: String(err) });
  }
}

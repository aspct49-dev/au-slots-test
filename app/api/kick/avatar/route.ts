import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) return NextResponse.json({ avatarUrl: null });

  try {
    const res = await fetch(
      `https://kick.com/api/v2/channels/${encodeURIComponent(username)}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        next: { revalidate: 3600 }, // cache avatar for 1 hour
      }
    );

    if (!res.ok) return NextResponse.json({ avatarUrl: null });

    const data = await res.json();
    const avatarUrl: string | null =
      data?.user?.profile_pic ?? data?.user?.profile_picture ?? null;

    return NextResponse.json({ avatarUrl });
  } catch {
    return NextResponse.json({ avatarUrl: null });
  }
}

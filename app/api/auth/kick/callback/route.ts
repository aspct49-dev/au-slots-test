import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { exchangeKickCode, fetchKickUser } from "@/lib/kick";
import { getBotrixPoints } from "@/lib/botrix";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // User denied access on Kick
  if (error) {
    return NextResponse.redirect(`${APP_URL}/?auth_error=access_denied`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${APP_URL}/?auth_error=missing_params`);
  }

  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // CSRF check — state must match what we stored before the redirect
  if (session.oauthState !== state) {
    session.oauthState = undefined;
    await session.save();
    return NextResponse.redirect(`${APP_URL}/?auth_error=invalid_state`);
  }

  try {
    // Exchange the authorization code for tokens
    const tokens = await exchangeKickCode(code);

    // Fetch the authenticated user's Kick profile
    const kickUser = await fetchKickUser(tokens.access_token);

    // Fetch the user's current Botrix points balance
    let points = 0;
    try {
      points = await getBotrixPoints(kickUser.name);
    } catch {
      // Points fetch is non-fatal — user can still log in
      console.warn("[Botrix] Could not fetch points for", kickUser.name);
    }

    // Persist user data in the encrypted session cookie
    session.oauthState = undefined;
    session.user = {
      id: String(kickUser.user_id),
      username: kickUser.name,
      avatar: kickUser.profile_pic,
      kickAccessToken: tokens.access_token,
      kickRefreshToken: tokens.refresh_token,
      points,
    };
    await session.save();

    return NextResponse.redirect(APP_URL);
  } catch (err) {
    console.error("[Kick OAuth callback error]", err);
    return NextResponse.redirect(`${APP_URL}/?auth_error=server_error`);
  }
}

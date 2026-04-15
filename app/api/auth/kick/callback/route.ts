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
    console.error("[Kick OAuth] Error from Kick:", error, searchParams.get("error_description"));
    return NextResponse.redirect(`${APP_URL}/?auth_error=access_denied`);
  }

  if (!code || !state) {
    console.error("[Kick OAuth] Missing code or state. Params:", Object.fromEntries(searchParams));
    return NextResponse.redirect(`${APP_URL}/?auth_error=missing_params`);
  }

  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // CSRF check — state must match what we stored before the redirect
  if (!session.oauthState || session.oauthState !== state) {
    console.error("[Kick OAuth] State mismatch. Expected:", session.oauthState, "Got:", state);
    session.oauthState = undefined;
    session.codeVerifier = undefined;
    await session.save();
    return NextResponse.redirect(`${APP_URL}/?auth_error=invalid_state`);
  }

  const codeVerifier = session.codeVerifier;
  if (!codeVerifier) {
    console.error("[Kick OAuth] Missing codeVerifier in session");
    return NextResponse.redirect(`${APP_URL}/?auth_error=missing_verifier`);
  }

  try {
    // Exchange the authorization code for tokens (with PKCE verifier)
    const tokens = await exchangeKickCode(code, codeVerifier);

    // Fetch the authenticated user's Kick profile
    const kickUser = await fetchKickUser(tokens.access_token);

    // Fetch the user's current Botrix points balance (non-fatal)
    let points = 0;
    try {
      points = await getBotrixPoints(kickUser.name);
    } catch {
      console.warn("[Botrix] Could not fetch points for", kickUser.name);
    }

    // Persist user data in the encrypted session cookie
    session.oauthState = undefined;
    session.codeVerifier = undefined;
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
    return NextResponse.redirect(`${APP_URL}/?auth_error=server_error&detail=${encodeURIComponent(String(err))}`);
  }
}

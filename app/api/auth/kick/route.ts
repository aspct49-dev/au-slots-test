import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { buildKickAuthUrl, generateOAuthState } from "@/lib/kick";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // Generate CSRF state + PKCE code verifier and store both in the session
  const state = generateOAuthState();
  const { url: authUrl, codeVerifier } = await buildKickAuthUrl(state);

  session.oauthState = state;
  session.codeVerifier = codeVerifier;
  await session.save();

  return NextResponse.redirect(authUrl);
}

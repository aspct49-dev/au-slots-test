import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { buildKickAuthUrl, generateOAuthState } from "@/lib/kick";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // Generate a random state and store it in the session for CSRF protection
  const state = generateOAuthState();
  session.oauthState = state;
  await session.save();

  const authUrl = buildKickAuthUrl(state);
  return NextResponse.redirect(authUrl);
}

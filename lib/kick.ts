/**
 * Kick OAuth2 helpers
 *
 * Register your application at: https://kick.com/settings/developer
 * Required env vars:
 *   KICK_CLIENT_ID
 *   KICK_CLIENT_SECRET
 *   KICK_REDIRECT_URI  (e.g. http://localhost:3000/api/auth/kick/callback)
 */

const KICK_AUTH_URL = "https://id.kick.com/oauth/authorize";
const KICK_TOKEN_URL = "https://id.kick.com/oauth/token";
const KICK_API_BASE = "https://api.kick.com/public/v1";

export interface KickTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface KickUser {
  user_id: number;
  name: string;
  email?: string;
  profile_pic?: string;
}

/** Build the Kick OAuth authorization URL */
export function buildKickAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.KICK_CLIENT_ID!,
    redirect_uri: process.env.KICK_REDIRECT_URI!,
    response_type: "code",
    scope: "user:read",
    state,
  });
  return `${KICK_AUTH_URL}?${params.toString()}`;
}

/** Exchange authorization code for access token */
export async function exchangeKickCode(code: string): Promise<KickTokenResponse> {
  const res = await fetch(KICK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.KICK_CLIENT_ID!,
      client_secret: process.env.KICK_CLIENT_SECRET!,
      redirect_uri: process.env.KICK_REDIRECT_URI!,
      code,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Kick token exchange failed: ${res.status} ${text}`);
  }

  return res.json();
}

/** Fetch the authenticated user's profile using their access token */
export async function fetchKickUser(accessToken: string): Promise<KickUser> {
  const res = await fetch(`${KICK_API_BASE}/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Kick user fetch failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  // Kick returns { data: [ { user_id, name, email, profile_pic } ] }
  const user: KickUser = json.data?.[0] ?? json;
  return user;
}

/** Generate a cryptographically random state string for OAuth CSRF protection */
export function generateOAuthState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

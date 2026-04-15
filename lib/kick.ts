/**
 * Kick OAuth2 helpers — with PKCE (S256)
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

// ── PKCE helpers ──────────────────────────────────────────────────────────────

/** Generate a high-entropy random code verifier (43–128 chars, URL-safe base64) */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/** Derive the code challenge from the verifier using SHA-256 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ── OAuth state ───────────────────────────────────────────────────────────────

/** Generate a cryptographically random state string for CSRF protection */
export function generateOAuthState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Auth URL builder ──────────────────────────────────────────────────────────

/** Build the Kick OAuth authorization URL (PKCE S256) */
export async function buildKickAuthUrl(state: string): Promise<{ url: string; codeVerifier: string }> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    client_id: process.env.KICK_CLIENT_ID!,
    redirect_uri: process.env.KICK_REDIRECT_URI!,
    response_type: "code",
    scope: "user:read",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return { url: `${KICK_AUTH_URL}?${params.toString()}`, codeVerifier };
}

// ── Token exchange ────────────────────────────────────────────────────────────

/** Exchange authorization code for access token (PKCE — no client_secret needed in body for public; keep it for confidential) */
export async function exchangeKickCode(code: string, codeVerifier: string): Promise<KickTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.KICK_CLIENT_ID!,
    redirect_uri: process.env.KICK_REDIRECT_URI!,
    code,
    code_verifier: codeVerifier,
  });

  // Include client_secret if configured (confidential client)
  if (process.env.KICK_CLIENT_SECRET) {
    body.set("client_secret", process.env.KICK_CLIENT_SECRET);
  }

  const res = await fetch(KICK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Kick token exchange failed: ${res.status} ${text}`);
  }

  return res.json();
}

// ── User fetch ────────────────────────────────────────────────────────────────

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

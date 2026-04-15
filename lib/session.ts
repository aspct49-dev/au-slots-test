import { SessionOptions } from "iron-session";

export interface SessionUser {
  id: string;
  username: string;
  avatar?: string;
  kickAccessToken: string;
  kickRefreshToken?: string;
  points?: number;
}

export interface SessionData {
  user?: SessionUser;
  /** Temporary OAuth state param — cleared after callback */
  oauthState?: string;
  /** PKCE code verifier — cleared after callback */
  codeVerifier?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "auslots-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  },
};

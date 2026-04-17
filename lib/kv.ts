/**
 * Unified async KV layer.
 *
 * Production (Vercel):  uses @vercel/kv (Upstash Redis) — data persists
 *                        across every Lambda invocation and every deploy.
 * Local dev:            falls back to JSON files in data/ so no extra setup
 *                        is needed to run the project locally.
 *
 * To enable KV on Vercel:
 *   1. Dashboard → Storage → Create KV database → link to your project.
 *   2. Vercel automatically injects KV_REST_API_URL + KV_REST_API_TOKEN.
 *   3. Pull env vars locally: `vercel env pull .env.local`
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

const IS_KV = !!(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

// ── File fallback (local dev) ─────────────────────────────────────────────────

function fileGet<T>(key: string, fallback: T): T {
  try {
    const file = path.join(DATA_DIR, `${key}.json`);
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function fileSet<T>(key: string, value: T): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(DATA_DIR, `${key}.json`),
      JSON.stringify(value, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error(`[kv:file] write failed for "${key}":`, err);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function kvGet<T>(key: string, fallback: T): Promise<T> {
  if (IS_KV) {
    try {
      const { kv } = await import("@vercel/kv");
      const val = await kv.get<T>(key);
      return val ?? fallback;
    } catch (err) {
      console.error(`[kv] get failed for "${key}":`, err);
      return fallback;
    }
  }
  return fileGet(key, fallback);
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  if (IS_KV) {
    try {
      const { kv } = await import("@vercel/kv");
      await kv.set(key, value);
    } catch (err) {
      console.error(`[kv] set failed for "${key}":`, err);
    }
    return;
  }
  fileSet(key, value);
}

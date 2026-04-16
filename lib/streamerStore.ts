import fs from "fs";
import { DATA_DIR, WRITE_DIR } from "./dataDir";

const IS_PROD = process.env.NODE_ENV === "production";

const STREAMERS_FILE       = `${DATA_DIR}/streamers.json`;
const STREAMERS_FILE_WRITE = `${WRITE_DIR}/streamers.json`;

function ensureDir() {
  if (!fs.existsSync(WRITE_DIR)) fs.mkdirSync(WRITE_DIR, { recursive: true });
}

function readStreamers(): string[] {
  try {
    const file = IS_PROD && fs.existsSync(STREAMERS_FILE_WRITE)
      ? STREAMERS_FILE_WRITE
      : STREAMERS_FILE;
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf-8")) as string[];
  } catch {
    return [];
  }
}

function writeStreamers(list: string[]) {
  ensureDir();
  fs.writeFileSync(STREAMERS_FILE_WRITE, JSON.stringify(list, null, 2), "utf-8");
}

export function getStreamers(): string[] {
  return readStreamers();
}

export function addStreamer(username: string): string[] {
  const list = readStreamers();
  const u = username.trim().toLowerCase();
  if (!list.includes(u)) {
    list.push(u);
    writeStreamers(list);
  }
  return list;
}

export function removeStreamer(username: string): string[] {
  const list = readStreamers().filter(u => u !== username.trim().toLowerCase());
  writeStreamers(list);
  return list;
}

export function isStreamer(username: string): boolean {
  return readStreamers().includes(username.trim().toLowerCase());
}

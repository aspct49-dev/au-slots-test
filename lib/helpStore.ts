import { kvGet, kvSet } from "./kv";

const KEY = "help:nordvpn";
const DEFAULT = "";

export async function getNordVPNText(): Promise<string> {
  return kvGet<string>(KEY, DEFAULT);
}

export async function saveNordVPNText(text: string): Promise<void> {
  await kvSet(KEY, text);
}

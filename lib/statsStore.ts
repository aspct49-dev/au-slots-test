import { kvGet, kvSet } from "./kv";

export interface Stat {
  value: string;
  label: string;
}

const DEFAULT_STATS: Stat[] = [
  { value: "10K+",  label: "Community Members" },
  { value: "$50K+", label: "Rewards Given Away" },
  { value: "500+",  label: "Raffle Winners" },
  { value: "24/7",  label: "Active Community" },
];

export async function getStats(): Promise<Stat[]> {
  return kvGet<Stat[]>("stats", DEFAULT_STATS);
}

export async function saveStats(stats: Stat[]): Promise<void> {
  await kvSet("stats", stats);
}

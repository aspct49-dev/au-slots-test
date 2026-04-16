import fs from "fs";
import { DATA_DIR, WRITE_DIR } from "./dataDir";

const IS_PROD = process.env.NODE_ENV === "production";

const SCHEDULE_FILE       = `${DATA_DIR}/schedule.json`;
const SCHEDULE_FILE_WRITE = `${WRITE_DIR}/schedule.json`;

export interface StreamDay {
  day: string;
  fullDay: string;
  streamer: string;
  time: string;
  type: string;
  color: string;
  isMain: boolean;
  special?: boolean;
  off?: boolean;
}

const DEFAULT_SCHEDULE: StreamDay[] = [
  { day: "MON", fullDay: "Monday",    streamer: "AUSlots", time: "7PM AEST", type: "Main Stream",    color: "#00ff87", isMain: true },
  { day: "TUE", fullDay: "Tuesday",   streamer: "AUSlots", time: "7PM AEST", type: "Main Stream",    color: "#00ff87", isMain: true },
  { day: "WED", fullDay: "Wednesday", streamer: "AUSlots", time: "7PM AEST", type: "Main Stream",    color: "#00ff87", isMain: true },
  { day: "THU", fullDay: "Thursday",  streamer: "AUSlots", time: "7PM AEST", type: "Big Hunt Night", color: "#fbbf24", isMain: true, special: true },
  { day: "FRI", fullDay: "Friday",    streamer: "AUSlots", time: "7PM AEST", type: "Main Stream",    color: "#00ff87", isMain: true },
  { day: "SAT", fullDay: "Saturday",  streamer: "Guest Streamer", time: "TBD", type: "Guest Night",  color: "#a78bfa", isMain: false },
  { day: "SUN", fullDay: "Sunday",    streamer: "–",       time: "–",        type: "Rest Day",       color: "#444444", isMain: false, off: true },
];

function ensureDir() {
  if (!fs.existsSync(WRITE_DIR)) fs.mkdirSync(WRITE_DIR, { recursive: true });
}

export function getSchedule(): StreamDay[] {
  try {
    const file = IS_PROD && fs.existsSync(SCHEDULE_FILE_WRITE) ? SCHEDULE_FILE_WRITE : SCHEDULE_FILE;
    if (!fs.existsSync(file)) return DEFAULT_SCHEDULE;
    return JSON.parse(fs.readFileSync(file, "utf-8")) as StreamDay[];
  } catch {
    return DEFAULT_SCHEDULE;
  }
}

export function saveSchedule(schedule: StreamDay[]): void {
  ensureDir();
  fs.writeFileSync(SCHEDULE_FILE_WRITE, JSON.stringify(schedule, null, 2), "utf-8");
}

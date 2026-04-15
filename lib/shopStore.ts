/**
 * Simple JSON-file-backed store for shop items and redemptions.
 * Reads/writes to data/shop-items.json and data/redemptions.json.
 * Works for local/VPS deployments. For serverless (Vercel) you'd swap
 * these helpers for a database call.
 */

import fs from "fs";
import path from "path";

const DATA_DIR        = path.join(process.cwd(), "data");
const ITEMS_FILE      = path.join(DATA_DIR, "shop-items.json");
const REDEMPTIONS_FILE = path.join(DATA_DIR, "redemptions.json");

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ShopItem {
  id: string;
  gameName: string;
  provider: string;
  spinCount: number;
  pointCost: number;
  inventory: number;
  maxInventory: number;
  gradient: string;
  providerColor: string;
  imageUrl?: string;
}

export interface Redemption {
  id: string;
  username: string;
  itemId: string;
  itemName: string;
  spinCount: number;
  pointCost: number;
  redeemedAt: number;        // unix ms
  status: "pending" | "fulfilled" | "rejected";
  fulfilledAt?: number;
  rejectedAt?: number;
  rejectionReason?: string;
}

// ── Defaults (used only when no file exists yet) ──────────────────────────────

const DEFAULT_ITEMS: ShopItem[] = [
  { id: "1", gameName: "Crazy Ex Girlfriend",   provider: "Nolimit City",   spinCount: 50,  pointCost: 3000, inventory: 87, maxInventory: 100, gradient: "linear-gradient(135deg, #ff6b6b 0%, #c0392b 50%, #8b0000 100%)", providerColor: "#ff6b6b", imageUrl: "/images/crazy-ex-girlfriend.png" },
  { id: "2", gameName: "Chaos Crew 3",           provider: "Hacksaw",        spinCount: 50,  pointCost: 3000, inventory: 91, maxInventory: 100, gradient: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #4c1d95 100%)", providerColor: "#a78bfa", imageUrl: "/images/chaos-crew-3.png" },
  { id: "3", gameName: "Sweet Bonanza 1000",     provider: "Pragmatic Play", spinCount: 100, pointCost: 3875, inventory: 45, maxInventory: 100, gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #d97706 100%)", providerColor: "#fbbf24", imageUrl: "/images/sweet-bonanza-1000.png" },
  { id: "4", gameName: "Gates of Olympus 1000",  provider: "Pragmatic Play", spinCount: 100, pointCost: 3875, inventory: 62, maxInventory: 100, gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 40%, #1d4ed8 100%)", providerColor: "#60a5fa", imageUrl: "/images/gates-of-olympus-1000.png" },
  { id: "5", gameName: "Wanted Dead or Wild",    provider: "Hacksaw",        spinCount: 75,  pointCost: 4500, inventory: 18, maxInventory: 50,  gradient: "linear-gradient(135deg, #d4a574 0%, #a0522d 50%, #5c3317 100%)", providerColor: "#d4a574", imageUrl: "/images/wanted-dead-or-wild.png" },
  { id: "6", gameName: "Sugar Rush 1000",        provider: "Pragmatic Play", spinCount: 50,  pointCost: 2500, inventory: 33, maxInventory: 100, gradient: "linear-gradient(135deg, #f472b6 0%, #db2777 50%, #9d174d 100%)", providerColor: "#f472b6", imageUrl: "/images/sugar-rush-1000.png" },
  { id: "7", gameName: "RIP City",               provider: "Hacksaw",        spinCount: 25,  pointCost: 2000, inventory: 75, maxInventory: 100, gradient: "linear-gradient(135deg, #fb923c 0%, #ea580c 50%, #9a3412 100%)", providerColor: "#fb923c", imageUrl: "/images/rip-city.png" },
  { id: "8", gameName: "Starlight Princess 1000",provider: "Pragmatic Play", spinCount: 100, pointCost: 3875, inventory: 55, maxInventory: 100, gradient: "linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #581c87 100%)", providerColor: "#c084fc", imageUrl: "/images/starlight-princess-1000.png" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON<T>(file: string, fallback: T): T {
  ensureDir();
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(file: string, data: T) {
  ensureDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

// ── Shop items ────────────────────────────────────────────────────────────────

export function getShopItems(): ShopItem[] {
  return readJSON<ShopItem[]>(ITEMS_FILE, DEFAULT_ITEMS);
}

export function saveShopItems(items: ShopItem[]) {
  writeJSON(ITEMS_FILE, items);
}

export function addShopItem(data: Omit<ShopItem, "id">): ShopItem {
  const items = getShopItems();
  const item: ShopItem = { ...data, id: Date.now().toString() };
  items.unshift(item);
  saveShopItems(items);
  return item;
}

export function updateShopItem(id: string, data: Omit<ShopItem, "id">): ShopItem | null {
  const items = getShopItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...data, id };
  saveShopItems(items);
  return items[idx];
}

export function deleteShopItem(id: string): boolean {
  const items = getShopItems();
  const filtered = items.filter(i => i.id !== id);
  if (filtered.length === items.length) return false;
  saveShopItems(filtered);
  return true;
}

export function decrementInventory(itemId: string): boolean {
  const items = getShopItems();
  const item = items.find(i => i.id === itemId);
  if (!item || item.inventory <= 0) return false;
  item.inventory -= 1;
  saveShopItems(items);
  return true;
}

// ── Redemptions ───────────────────────────────────────────────────────────────

export function getRedemptions(): Redemption[] {
  return readJSON<Redemption[]>(REDEMPTIONS_FILE, []);
}

export function addRedemption(data: Omit<Redemption, "id" | "redeemedAt" | "status">): Redemption {
  const redemptions = getRedemptions();
  const redemption: Redemption = {
    ...data,
    id: Date.now().toString(),
    redeemedAt: Date.now(),
    status: "pending",
  };
  redemptions.unshift(redemption);
  writeJSON(REDEMPTIONS_FILE, redemptions);
  return redemption;
}

export function fulfillRedemption(id: string): Redemption | null {
  const redemptions = getRedemptions();
  const r = redemptions.find(r => r.id === id);
  if (!r) return null;
  r.status = "fulfilled";
  r.fulfilledAt = Date.now();
  writeJSON(REDEMPTIONS_FILE, redemptions);
  return r;
}

export function rejectRedemption(id: string, reason: string): Redemption | null {
  const redemptions = getRedemptions();
  const r = redemptions.find(r => r.id === id);
  if (!r) return null;
  r.status = "rejected";
  r.rejectedAt = Date.now();
  r.rejectionReason = reason.trim() || "No reason provided";
  writeJSON(REDEMPTIONS_FILE, redemptions);
  return r;
}

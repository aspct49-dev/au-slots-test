import pool from "./db";

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
  redeemedAt: number;
  status: "pending" | "fulfilled" | "rejected" | "cancelled";
  fulfilledAt?: number;
  rejectedAt?: number;
  rejectionReason?: string;
  viperSpinEmail?: string;
  zestyBetInfo?: string;
  discordUsername?: string;
  infoSubmitted?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToItem(row: any): ShopItem {
  return {
    id:            row.id,
    gameName:      row.game_name,
    provider:      row.provider,
    spinCount:     row.spin_count,
    pointCost:     row.point_cost,
    inventory:     row.inventory,
    maxInventory:  row.max_inventory,
    gradient:      row.gradient,
    providerColor: row.provider_color,
    imageUrl:      row.image_url ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToRedemption(row: any): Redemption {
  return {
    id:               row.id,
    username:         row.username,
    itemId:           row.item_id,
    itemName:         row.item_name,
    spinCount:        row.spin_count,
    pointCost:        row.point_cost,
    redeemedAt:       Number(row.redeemed_at),
    status:           row.status,
    fulfilledAt:      row.fulfilled_at  ? Number(row.fulfilled_at)  : undefined,
    rejectedAt:       row.rejected_at   ? Number(row.rejected_at)   : undefined,
    rejectionReason:  row.rejection_reason  ?? undefined,
    viperSpinEmail:   row.viper_spin_email  ?? undefined,
    zestyBetInfo:     row.zesty_bet_info    ?? undefined,
    discordUsername:  row.discord_username  ?? undefined,
    infoSubmitted:    row.info_submitted    ?? false,
  };
}

// ── Shop Items ────────────────────────────────────────────────────────────────

export async function getShopItems(): Promise<ShopItem[]> {
  const { rows } = await pool.query("SELECT * FROM shop_items ORDER BY point_cost ASC");
  return rows.map(rowToItem);
}

export async function addShopItem(data: Omit<ShopItem, "id">): Promise<ShopItem> {
  const id = Date.now().toString();
  const { rows } = await pool.query(
    `INSERT INTO shop_items
       (id, game_name, provider, spin_count, point_cost, inventory, max_inventory, gradient, provider_color, image_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [id, data.gameName, data.provider, data.spinCount, data.pointCost,
     data.inventory, data.maxInventory, data.gradient, data.providerColor, data.imageUrl ?? null]
  );
  return rowToItem(rows[0]);
}

export async function updateShopItem(id: string, data: Omit<ShopItem, "id">): Promise<ShopItem | null> {
  const { rows } = await pool.query(
    `UPDATE shop_items SET
       game_name=$2, provider=$3, spin_count=$4, point_cost=$5,
       inventory=$6, max_inventory=$7, gradient=$8, provider_color=$9, image_url=$10
     WHERE id=$1 RETURNING *`,
    [id, data.gameName, data.provider, data.spinCount, data.pointCost,
     data.inventory, data.maxInventory, data.gradient, data.providerColor, data.imageUrl ?? null]
  );
  return rows[0] ? rowToItem(rows[0]) : null;
}

export async function deleteShopItem(id: string): Promise<boolean> {
  const { rowCount } = await pool.query("DELETE FROM shop_items WHERE id=$1", [id]);
  return (rowCount ?? 0) > 0;
}

export async function decrementInventory(itemId: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    "UPDATE shop_items SET inventory = inventory - 1 WHERE id=$1 AND inventory > 0",
    [itemId]
  );
  return (rowCount ?? 0) > 0;
}

export async function incrementInventory(itemId: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    "UPDATE shop_items SET inventory = LEAST(inventory + 1, max_inventory) WHERE id=$1",
    [itemId]
  );
  return (rowCount ?? 0) > 0;
}

// ── Redemptions ───────────────────────────────────────────────────────────────

export async function getRedemptions(): Promise<Redemption[]> {
  const { rows } = await pool.query("SELECT * FROM redemptions ORDER BY redeemed_at DESC");
  return rows.map(rowToRedemption);
}

export async function addRedemption(
  data: Omit<Redemption, "id" | "redeemedAt" | "status">
): Promise<Redemption> {
  const { rows } = await pool.query(
    `INSERT INTO redemptions
       (id, username, item_id, item_name, spin_count, point_cost, redeemed_at, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'pending') RETURNING *`,
    [Date.now().toString(), data.username, data.itemId, data.itemName,
     data.spinCount, data.pointCost, Date.now()]
  );
  return rowToRedemption(rows[0]);
}

export async function fulfillRedemption(id: string): Promise<Redemption | null> {
  const { rows } = await pool.query(
    "UPDATE redemptions SET status='fulfilled', fulfilled_at=$2 WHERE id=$1 RETURNING *",
    [id, Date.now()]
  );
  return rows[0] ? rowToRedemption(rows[0]) : null;
}

export async function rejectRedemption(id: string, reason: string): Promise<Redemption | null> {
  const { rows } = await pool.query(
    "UPDATE redemptions SET status='rejected', rejected_at=$2, rejection_reason=$3 WHERE id=$1 RETURNING *",
    [id, Date.now(), reason.trim() || "No reason provided"]
  );
  return rows[0] ? rowToRedemption(rows[0]) : null;
}

export async function cancelRedemption(id: string): Promise<Redemption | null> {
  const { rows } = await pool.query(
    "UPDATE redemptions SET status='cancelled', rejected_at=$2 WHERE id=$1 AND status='pending' RETURNING *",
    [id, Date.now()]
  );
  return rows[0] ? rowToRedemption(rows[0]) : null;
}

export async function updateRedemptionInfo(
  id: string,
  info: { viperSpinEmail: string; zestyBetInfo: string; discordUsername: string }
): Promise<Redemption | null> {
  const { rows } = await pool.query(
    `UPDATE redemptions SET
       viper_spin_email=$2, zesty_bet_info=$3, discord_username=$4, info_submitted=TRUE
     WHERE id=$1 RETURNING *`,
    [id, info.viperSpinEmail.trim(), info.zestyBetInfo.trim(), info.discordUsername.trim()]
  );
  return rows[0] ? rowToRedemption(rows[0]) : null;
}

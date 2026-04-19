import pool from "./db";

export interface Vault {
  currentAmount: number;
  maxAmount: number;
  updatedAt: number;
}

export async function getVault(): Promise<Vault> {
  const { rows } = await pool.query("SELECT * FROM vault LIMIT 1");
  if (!rows[0]) return { currentAmount: 0, maxAmount: 5000, updatedAt: Date.now() };
  return {
    currentAmount: Number(rows[0].current_amount),
    maxAmount:     Number(rows[0].max_amount),
    updatedAt:     Number(rows[0].updated_at),
  };
}

export async function setVault(currentAmount: number, maxAmount: number): Promise<Vault> {
  const now = Date.now();
  await pool.query(`
    INSERT INTO vault (id, current_amount, max_amount, updated_at)
    VALUES (1, $1, $2, $3)
    ON CONFLICT (id) DO UPDATE SET current_amount=$1, max_amount=$2, updated_at=$3
  `, [currentAmount, maxAmount, now]);
  return { currentAmount, maxAmount, updatedAt: now };
}

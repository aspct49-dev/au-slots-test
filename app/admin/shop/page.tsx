"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Save, ShoppingBag, Package, Loader2 } from "lucide-react";
import type { ShopItem } from "@/lib/shopStore";

const empty = (): Omit<ShopItem, "id"> => ({
  gameName: "", provider: "", spinCount: 25, pointCost: 1000,
  inventory: 100, maxInventory: 100,
  gradient: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
  providerColor: "#00ff87", imageUrl: "",
});

const inputCls = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff87]/40 transition-colors";
const labelCls = "block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5";

function ItemForm({ initial, onSave, onCancel, saving }: {
  initial: Omit<ShopItem, "id">;
  onSave: (d: Omit<ShopItem, "id">) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [f, setF] = useState(initial);
  const set = <K extends keyof typeof f>(k: K, v: typeof f[K]) => setF(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className={labelCls}>Game Name</label><input className={inputCls} value={f.gameName} onChange={e => set("gameName", e.target.value)} placeholder="e.g. Gates of Olympus 1000" /></div>
        <div><label className={labelCls}>Provider</label><input className={inputCls} value={f.provider} onChange={e => set("provider", e.target.value)} placeholder="e.g. Pragmatic Play" /></div>
        <div><label className={labelCls}>Spin Count</label><input type="number" className={inputCls} value={f.spinCount} onChange={e => set("spinCount", +e.target.value)} /></div>
        <div><label className={labelCls}>Point Cost</label><input type="number" className={inputCls} value={f.pointCost} onChange={e => set("pointCost", +e.target.value)} /></div>
        <div><label className={labelCls}>Inventory</label><input type="number" className={inputCls} value={f.inventory} onChange={e => set("inventory", +e.target.value)} /></div>
        <div><label className={labelCls}>Max Inventory</label><input type="number" className={inputCls} value={f.maxInventory} onChange={e => set("maxInventory", +e.target.value)} /></div>
        <div>
          <label className={labelCls}>Provider Colour</label>
          <div className="flex gap-2">
            <input type="color" value={f.providerColor} onChange={e => set("providerColor", e.target.value)} className="w-10 h-10 rounded-lg border border-white/10 bg-[#1a1a1a] cursor-pointer" />
            <input className={inputCls} value={f.providerColor} onChange={e => set("providerColor", e.target.value)} />
          </div>
        </div>
        <div><label className={labelCls}>Image URL</label><input className={inputCls} value={f.imageUrl ?? ""} onChange={e => set("imageUrl", e.target.value)} placeholder="/images/my-slot.png" /></div>
      </div>
      <div><label className={labelCls}>Card Gradient</label><input className={inputCls} value={f.gradient} onChange={e => set("gradient", e.target.value)} /></div>
      <div style={{ background: f.gradient }} className="h-10 rounded-xl border border-white/10" />
      <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
        <button
          onClick={() => onSave(f)}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00ff87] hover:bg-[#00e676] disabled:opacity-60 text-black font-bold text-sm rounded-xl transition-all"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Item
        </button>
        <button onClick={onCancel} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 font-semibold text-sm rounded-xl transition-all">Cancel</button>
      </div>
    </div>
  );
}

export default function AdminShop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<ShopItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadItems = useCallback(async () => {
    const res = await fetch("/api/admin/shop/items");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  const handleAdd = async (data: Omit<ShopItem, "id">) => {
    setSaving(true);
    const res = await fetch("/api/admin/shop/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const item = await res.json();
      setItems(p => [item, ...p]);
      setMode("list");
    }
    setSaving(false);
  };

  const handleEdit = async (data: Omit<ShopItem, "id">) => {
    if (!editTarget) return;
    setSaving(true);
    const res = await fetch(`/api/admin/shop/items/${editTarget.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems(p => p.map(i => i.id === editTarget.id ? updated : i));
      setMode("list");
      setEditTarget(null);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/shop/items/${deleteId}`, { method: "DELETE" });
    if (res.ok) setItems(p => p.filter(i => i.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  };

  const inventoryPct = (item: ShopItem) => Math.round((item.inventory / item.maxInventory) * 100);
  const inventoryColor = (pct: number) => pct > 50 ? "#00ff87" : pct > 20 ? "#fbbf24" : "#ef4444";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2"><ShoppingBag size={20} className="text-[#00ff87]" /> Points Shop</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} items in store</p>
        </div>
        {mode === "list" && (
          <button onClick={() => setMode("add")} className="flex items-center gap-2 px-4 py-2.5 bg-[#00ff87] hover:bg-[#00e676] text-black font-bold text-sm rounded-xl transition-all">
            <Plus size={15} /> Add Item
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {mode === "list" ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-[#00ff87]/40" />
              </div>
            ) : items.map(item => {
              const pct = inventoryPct(item);
              return (
                <div key={item.id} className="flex items-center gap-4 bg-[#111111] border border-white/[0.06] rounded-xl px-4 py-3 hover:border-white/10 transition-all">
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden" style={{ background: item.gradient }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate">{item.gameName}</p>
                    <p className="text-xs text-white/40">{item.provider} · {item.spinCount} spins · {item.pointCost.toLocaleString()} pts</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden max-w-[80px]">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: inventoryColor(pct) }} />
                      </div>
                      <span className="text-[10px]" style={{ color: inventoryColor(pct) }}>{item.inventory}/{item.maxInventory}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => { setEditTarget(item); setMode("edit"); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"><Pencil size={13} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"><Trash2 size={13} /></button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-base font-black text-white mb-6 flex items-center gap-2">
              <Package size={16} className="text-[#00ff87]" />
              {mode === "add" ? "Add New Item" : `Editing: ${editTarget?.gameName}`}
            </h2>
            <ItemForm
              initial={mode === "edit" && editTarget ? editTarget : empty()}
              onSave={mode === "add" ? handleAdd : handleEdit}
              onCancel={() => { setMode("list"); setEditTarget(null); }}
              saving={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-[#111111] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
              <p className="text-white font-black text-lg mb-2">Remove item?</p>
              <p className="text-white/50 text-sm mb-6">This can&apos;t be undone.</p>
              <div className="flex gap-3">
                <button onClick={handleDelete} disabled={deleting} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all">
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : "Remove"}
                </button>
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 font-semibold text-sm rounded-xl transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

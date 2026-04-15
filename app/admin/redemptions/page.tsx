"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, CheckCircle, Clock, Loader2, RefreshCw } from "lucide-react";
import type { Redemption } from "@/lib/shopStore";

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function AdminRedemptions() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "fulfilled">("pending");
  const [loading, setLoading] = useState(true);
  const [fulfilling, setFulfilling] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const q = filter === "all" ? "" : `?status=${filter}`;
    const res = await fetch(`/api/admin/redemptions${q}`);
    if (res.ok) setRedemptions(await res.json());
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const markFulfilled = async (id: string) => {
    setFulfilling(id);
    const res = await fetch("/api/admin/redemptions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const updated: Redemption = await res.json();
      setRedemptions(p => p.map(r => r.id === id ? updated : r).filter(r => filter === "all" || r.status === filter));
    }
    setFulfilling(null);
  };

  const pendingCount = redemptions.filter(r => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#00ff87]" /> Redemptions
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Track and fulfill viewer reward redemptions</p>
        </div>
        <button onClick={load} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(["pending", "fulfilled", "all"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all ${
              filter === f
                ? "bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20"
                : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
            }`}
          >
            {f === "pending" && pendingCount > 0 && filter !== "pending"
              ? `${f} (${pendingCount})`
              : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[#00ff87]/40" />
        </div>
      ) : redemptions.length === 0 ? (
        <div className="text-center py-16 text-white/20 text-sm">
          No {filter === "all" ? "" : filter} redemptions
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {redemptions.map(r => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`flex items-center gap-4 rounded-xl px-4 py-3.5 border transition-all ${
                  r.status === "pending"
                    ? "bg-[#111111] border-white/[0.08] hover:border-white/15"
                    : "bg-[#0d0d0d] border-white/[0.04] opacity-60"
                }`}
              >
                {/* Status icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  r.status === "pending"
                    ? "bg-yellow-500/15 border border-yellow-500/30"
                    : "bg-[#00ff87]/10 border border-[#00ff87]/20"
                }`}>
                  {r.status === "pending"
                    ? <Clock size={14} className="text-yellow-400" />
                    : <CheckCircle size={14} className="text-[#00ff87]" />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">{r.username}</span>
                    <span className="text-white/30 text-xs">redeemed</span>
                    {r.spinCount > 0 && (
                      <>
                        <span className="text-[#00ff87] font-semibold text-sm">{r.spinCount} spins</span>
                        <span className="text-white/30 text-xs">on</span>
                      </>
                    )}
                    <span className="text-white/70 text-sm truncate">{r.itemName}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-white/30 text-xs">{r.pointCost.toLocaleString()} pts · {timeAgo(r.redeemedAt)}</span>
                    {r.status === "fulfilled" && r.fulfilledAt && (
                      <span className="text-[#00ff87]/40 text-xs">fulfilled {timeAgo(r.fulfilledAt)}</span>
                    )}
                  </div>
                </div>

                {/* Action */}
                {r.status === "pending" && (
                  <button
                    onClick={() => markFulfilled(r.id)}
                    disabled={fulfilling === r.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00ff87]/10 hover:bg-[#00ff87]/20 text-[#00ff87] text-xs font-bold border border-[#00ff87]/20 transition-all disabled:opacity-50 flex-shrink-0"
                  >
                    {fulfilling === r.id
                      ? <Loader2 size={12} className="animate-spin" />
                      : <CheckCircle size={12} />}
                    Mark Fulfilled
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

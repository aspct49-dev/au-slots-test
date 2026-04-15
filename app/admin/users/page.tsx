"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Plus, Minus, Loader2, CheckCircle, AlertCircle } from "lucide-react";

type ActionStatus = "idle" | "loading" | "success" | "error";

export default function AdminUsers() {
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState<string>("100");
  const [lookupResult, setLookupResult] = useState<{ username: string; points: number; uid: string | null } | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [adjustStatus, setAdjustStatus] = useState<ActionStatus>("idle");
  const [adjustAction, setAdjustAction] = useState<"add" | "deduct" | null>(null);
  const [adjustMsg, setAdjustMsg] = useState("");

  const lookup = async () => {
    if (!username.trim()) return;
    setLookupLoading(true); setLookupError(""); setLookupResult(null); setAdjustStatus("idle");
    try {
      const res = await fetch(`/api/admin/points-lookup?username=${encodeURIComponent(username.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lookup failed");
      setLookupResult(data);
    } catch (e: unknown) {
      setLookupError(e instanceof Error ? e.message : "Lookup failed");
    } finally { setLookupLoading(false); }
  };

  const adjust = async (add: boolean) => {
    if (!lookupResult) return;
    setAdjustStatus("loading");
    setAdjustAction(add ? "add" : "deduct");
    try {
      const res = await fetch("/api/admin/adjust-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: lookupResult.username, amount: add ? +amount : -(+amount), currentBalance: lookupResult.points }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setLookupResult(prev => prev ? { ...prev, points: data.newBalance } : null);
      setAdjustMsg(`${add ? "Added" : "Deducted"} ${(+amount).toLocaleString()} pts`);
      setAdjustStatus("success");
      setTimeout(() => setAdjustStatus("idle"), 3000);
    } catch (e: unknown) {
      setAdjustMsg(e instanceof Error ? e.message : "Failed");
      setAdjustStatus("error");
      setTimeout(() => setAdjustStatus("idle"), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2"><Users size={20} className="text-[#60a5fa]" /> User Points</h1>
        <p className="text-white/40 text-sm mt-0.5">Look up and manually adjust viewer points</p>
      </div>

      <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-5 max-w-lg">
        {/* Search */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Kick Username</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === "Enter" && lookup()}
                placeholder="Enter username..."
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff87]/40 transition-colors"
              />
            </div>
            <button onClick={lookup} disabled={lookupLoading} className="px-4 py-2.5 bg-[#00ff87] hover:bg-[#00e676] disabled:opacity-50 text-black font-bold text-sm rounded-xl transition-all flex items-center gap-2">
              {lookupLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            </button>
          </div>
          {lookupError && <p className="text-red-400 text-xs mt-2">{lookupError}</p>}
        </div>

        {/* Result + Adjust */}
        <AnimatePresence>
          {lookupResult && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Balance card */}
              <div className="bg-[#1a1a1a] border border-[#00ff87]/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-black text-white">{lookupResult.username}</p>
                  <p className="text-xs text-white/40 mt-0.5">Current balance</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-[#00ff87]">{lookupResult.points.toLocaleString()}</p>
                  <p className="text-xs text-white/40">pts</p>
                </div>
              </div>

              {/* Adjust */}
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Adjust Amount</label>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  onBlur={e => { const n = parseInt(e.target.value); setAmount(isNaN(n) || n < 1 ? "1" : String(n)); }}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00ff87]/40 transition-colors mb-3"
                />
                <div className="flex gap-2">
                  <button onClick={() => adjust(true)} disabled={adjustStatus === "loading" || !+amount} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#00ff87]/10 hover:bg-[#00ff87]/20 text-[#00ff87] font-bold text-sm rounded-xl transition-all border border-[#00ff87]/20 disabled:opacity-50">
                    {adjustStatus === "loading" && adjustAction === "add" ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add Points
                  </button>
                  <button onClick={() => adjust(false)} disabled={adjustStatus === "loading" || !+amount} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-sm rounded-xl transition-all border border-red-500/20 disabled:opacity-50">
                    {adjustStatus === "loading" && adjustAction === "deduct" ? <Loader2 size={14} className="animate-spin" /> : <Minus size={14} />} Deduct Points
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {adjustStatus === "success" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[#00ff87] text-sm font-semibold">
                    <CheckCircle size={15} /> {adjustMsg}
                  </motion.div>
                )}
                {adjustStatus === "error" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                    <AlertCircle size={15} /> {adjustMsg}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

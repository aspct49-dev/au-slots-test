"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Search, Loader2 } from "lucide-react";

interface LookupResult { username: string; points: number; }

export default function AdminLeaderboard() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!search.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`/api/admin/points-lookup?username=${encodeURIComponent(search.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lookup failed");
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2"><Trophy size={20} className="text-[#fbbf24]" /> Leaderboard</h1>
        <p className="text-white/40 text-sm mt-0.5">Look up any viewer's points balance</p>
      </div>

      <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-4 max-w-lg">
        <h2 className="text-sm font-black text-white/60 uppercase tracking-widest">Points Lookup</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && lookup()}
              placeholder="Enter Kick username..."
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff87]/40 transition-colors"
            />
          </div>
          <button onClick={lookup} disabled={loading} className="px-4 py-2.5 bg-[#00ff87] hover:bg-[#00e676] disabled:opacity-50 text-black font-bold text-sm rounded-xl transition-all flex items-center gap-2">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} Lookup
          </button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {result && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1a1a1a] border border-[#00ff87]/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-black text-white">{result.username}</p>
              <p className="text-xs text-white/40 mt-0.5">Kick viewer</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-[#00ff87]">{result.points.toLocaleString()}</p>
              <p className="text-xs text-white/40">points</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

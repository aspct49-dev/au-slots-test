"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Play, Lock, Trophy, Trash2, Loader2, Users, DollarSign, Hash } from "lucide-react";
import type { Hunt, Guess } from "@/lib/huntStore";

const inputCls = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#fbbf24]/40 transition-colors";
const labelCls = "block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5";

const STATUS_COLOR: Record<string, string> = {
  active: "text-[#00ff87]",
  closed: "text-yellow-400",
  ended:  "text-white/40",
};
const STATUS_LABEL: Record<string, string> = {
  active: "Entries Open",
  closed: "Entries Closed",
  ended:  "Hunt Ended",
};

export default function AdminBonusHunt() {
  const [hunt, setHunt] = useState<Hunt | null>(null);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [winnerGuess, setWinnerGuess] = useState<Guess | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Start hunt form
  const [startBal, setStartBal] = useState("");
  const [numBonuses, setNumBonuses] = useState("");
  const [casinoUrl, setCasinoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  // End hunt form
  const [endBal, setEndBal] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/hunt");
    if (res.ok) {
      const data = await res.json();
      if (data) {
        setHunt(data.hunt);
        setTotalGuesses(data.totalGuesses);
        setWinnerGuess(data.winnerGuess);
      } else {
        setHunt(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startHunt = async () => {
    if (!startBal || !numBonuses) return;
    setBusy(true); setError("");
    const res = await fetch("/api/admin/hunt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startingBalance: +startBal, numberOfBonuses: +numBonuses, casinoElementsUrl: casinoUrl || undefined }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setBusy(false); return; }
    setHunt(data); setStartBal(""); setNumBonuses(""); setCasinoUrl(""); setBusy(false);
  };

  const updateUrl = async () => {
    if (!hunt) return;
    setBusy(true); setError("");
    const res = await fetch("/api/admin/hunt", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setUrl", huntId: hunt.id, url: liveUrl }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setBusy(false); return; }
    setHunt(data); setBusy(false);
  };

  const patch = async (action: string, extra?: object) => {
    setBusy(true); setError("");
    const res = await fetch("/api/admin/hunt", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setBusy(false); return; }
    if (action === "end") {
      setHunt(data.hunt);
      setWinnerGuess(data.winner);
    } else if (action === "clear") {
      setHunt(null); setWinnerGuess(null); setTotalGuesses(0);
    } else {
      setHunt(data);
    }
    setBusy(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Flame size={20} className="text-[#fbbf24]" /> Bonus Hunt
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Manage live bonus hunts and viewer predictions</p>
        </div>
        {hunt && (
          <span className={`text-xs font-black tracking-widest uppercase ${STATUS_COLOR[hunt.status]}`}>
            ● {STATUS_LABEL[hunt.status]}
          </span>
        )}
      </div>

      {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[#fbbf24]/40" />
        </div>
      ) : (
        <AnimatePresence mode="wait">

          {/* ── No hunt — start form ── */}
          {!hunt || hunt.status === "ended" ? (
            <motion.div key="start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {hunt?.status === "ended" && winnerGuess && (
                <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-2xl p-5 flex items-center gap-4">
                  <Trophy size={28} className="text-[#fbbf24] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[#fbbf24]/60 font-bold tracking-widest uppercase mb-0.5">Last Hunt Winner</p>
                    <p className="text-xl font-black text-[#fbbf24]">{winnerGuess.username}</p>
                    <p className="text-white/40 text-xs mt-0.5">
                      Guessed <span className="text-white/70 font-semibold">${winnerGuess.guess.toLocaleString()}</span>
                      {" · "}Ending balance was <span className="text-white/70 font-semibold">${hunt.endingBalance?.toLocaleString()}</span>
                      {" · "}Off by <span className="text-[#fbbf24] font-semibold">${Math.abs(winnerGuess.guess - (hunt.endingBalance ?? 0)).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-4 max-w-lg">
                <h2 className="text-sm font-black text-white/60 uppercase tracking-widest">Start New Hunt</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Starting Balance ($)</label>
                    <div className="relative">
                      <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input className={`${inputCls} pl-8`} type="number" min={1} value={startBal} onChange={e => setStartBal(e.target.value)} placeholder="e.g. 5000" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Number of Bonuses</label>
                    <div className="relative">
                      <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input className={`${inputCls} pl-8`} type="number" min={1} value={numBonuses} onChange={e => setNumBonuses(e.target.value)} placeholder="e.g. 20" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Casino Elements URL (optional)</label>
                  <input className={inputCls} value={casinoUrl} onChange={e => setCasinoUrl(e.target.value)} placeholder="https://casinoelements.com/c/auslots/bonushunt/..." />
                </div>
                <button
                  onClick={startHunt}
                  disabled={busy || !startBal || !numBonuses}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#fbbf24] hover:bg-[#f59e0b] disabled:opacity-50 text-black font-black text-sm rounded-xl transition-all"
                >
                  {busy ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                  Start Hunt
                </button>
              </div>

              {hunt?.status === "ended" && (
                <button
                  onClick={() => patch("clear")}
                  disabled={busy}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/30 font-semibold text-xs rounded-xl transition-all"
                >
                  <Trash2 size={12} /> Clear Hunt Data
                </button>
              )}
            </motion.div>

          ) : (
            /* ── Active / Closed hunt ── */
            <motion.div key="active" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Starting Balance", value: `$${hunt.startingBalance.toLocaleString()}`, color: "#fbbf24" },
                  { label: "Bonuses", value: hunt.numberOfBonuses, color: "#60a5fa" },
                  { label: "Total Guesses", value: totalGuesses, color: "#00ff87", icon: <Users size={14} /> },
                ].map(s => (
                  <div key={s.label} className="bg-[#111111] border border-white/[0.06] rounded-xl p-4 text-center">
                    <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-white/40 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-4 max-w-lg">
                {/* Close entries */}
                {hunt.status === "active" && (
                  <div className="pb-4 border-b border-white/[0.06]">
                    <h2 className="text-sm font-black text-white/60 uppercase tracking-widest mb-3">Entries</h2>
                    <button
                      onClick={() => patch("close")}
                      disabled={busy}
                      className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-black text-sm rounded-xl transition-all disabled:opacity-50"
                    >
                      {busy ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                      Close Entries
                    </button>
                    <p className="text-white/30 text-xs mt-2">Viewers will no longer be able to submit or change their guess</p>
                  </div>
                )}
                {hunt.status === "closed" && (
                  <div className="pb-4 border-b border-white/[0.06] flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                    <Lock size={14} /> Entries are closed — {totalGuesses} guess{totalGuesses !== 1 ? "es" : ""} locked in
                  </div>
                )}

                {/* Casino Elements URL */}
                <div className="pb-4 border-b border-white/[0.06]">
                  <h2 className="text-sm font-black text-white/60 uppercase tracking-widest mb-3">Casino Elements Tracker</h2>
                  {hunt.casinoElementsUrl && (
                    <p className="text-white/30 text-xs mb-2 truncate">Current: {hunt.casinoElementsUrl}</p>
                  )}
                  <div className="flex gap-2">
                    <input className={`${inputCls} flex-1`} value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="https://casinoelements.com/c/auslots/bonushunt/..." />
                    <button onClick={updateUrl} disabled={busy || !liveUrl} className="px-4 py-2 bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 border border-[#fbbf24]/20 text-[#fbbf24] font-bold text-sm rounded-xl transition-all disabled:opacity-50 whitespace-nowrap">
                      {busy ? <Loader2 size={13} className="animate-spin" /> : "Set URL"}
                    </button>
                  </div>
                </div>

                {/* End hunt */}
                <div>
                  <h2 className="text-sm font-black text-white/60 uppercase tracking-widest mb-3">End Hunt</h2>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        className={`${inputCls} pl-8`}
                        type="number" min={0}
                        value={endBal}
                        onChange={e => setEndBal(e.target.value)}
                        placeholder="Ending balance"
                      />
                    </div>
                    <button
                      onClick={() => patch("end", { endingBalance: +endBal })}
                      disabled={busy || !endBal}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#fbbf24] hover:bg-[#f59e0b] disabled:opacity-50 text-black font-black text-sm rounded-xl transition-all whitespace-nowrap"
                    >
                      {busy ? <Loader2 size={14} className="animate-spin" /> : <Trophy size={14} />}
                      End Hunt
                    </button>
                  </div>
                  <p className="text-white/30 text-xs mt-2">This will calculate the winner and display results to viewers</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

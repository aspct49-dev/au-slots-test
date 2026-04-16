"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket, Plus, Trash2, Trophy, X, RefreshCw, Loader2,
  Users, Coins, ChevronDown, ChevronUp, Crown, Clock, History,
} from "lucide-react";

interface TicketEntry {
  id: string;
  username: string;
  quantity: number;
  purchasedAt: number;
  pointsSpent: number;
}

interface Raffle {
  id: string;
  title: string;
  prize: string;
  ticketCost: number;
  status: "active" | "ended";
  createdAt: number;
  endedAt?: number;
  winner?: string;
  totalTickets: number;
  tickets: TicketEntry[];
}

const inputCls = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff87]/40 transition-colors";
const labelCls = "block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5";

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function AdminRaffles() {
  const [raffles, setRaffles]       = useState<Raffle[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState({ title: "", prize: "", ticketCost: 500 });
  const [creating, setCreating]     = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [rolling, setRolling]       = useState<string | null>(null);
  const [deleting, setDeleting]     = useState<string | null>(null);
  const [expanded, setExpanded]     = useState<string | null>(null);

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/raffles");
    if (res.ok) setRaffles(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.title || !form.prize || form.ticketCost <= 0) return;
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch("/api/admin/raffles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ title: "", prize: "", ticketCost: 500 });
        setShowForm(false);
        await load();
      } else {
        const data = await res.json().catch(() => ({}));
        setCreateError(data.error ?? `Server error (${res.status})`);
      }
    } catch {
      setCreateError("Network error — please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleRoll = async (id: string, hasTickets: boolean) => {
    if (!hasTickets) return;
    if (!confirm("Roll winner now? This cannot be undone.")) return;
    setRolling(id);
    const res = await fetch("/api/admin/raffles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "roll" }),
    });
    if (res.ok) await load();
    setRolling(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this raffle and all its tickets?")) return;
    setDeleting(id);
    await fetch("/api/admin/raffles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
    setDeleting(null);
  };

  const active = raffles.filter(r => r.status === "active");
  const ended  = raffles.filter(r => r.status === "ended");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Ticket size={20} className="text-[#a78bfa]" /> Raffles
          </h1>
          <p className="text-white/40 text-sm mt-0.5">{active.length} active · {ended.length} ended</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00ff87] hover:bg-[#00e676] text-black font-bold text-sm rounded-xl transition-all"
          >
            <Plus size={15} /> Create Raffle
          </button>
        </div>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white">New Raffle</h2>
              <button onClick={() => { setShowForm(false); setCreateError(null); }}>
                <X size={16} className="text-white/40 hover:text-white transition-colors" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className={labelCls}>Prize</label>
                <input
                  className={inputCls}
                  value={form.prize}
                  onChange={e => set("prize", e.target.value)}
                  placeholder="e.g. $500 Cash"
                />
              </div>
              <div className="md:col-span-1">
                <label className={labelCls}>Title</label>
                <input
                  className={inputCls}
                  value={form.title}
                  onChange={e => set("title", e.target.value)}
                  placeholder="e.g. $500 Cash Raffle"
                />
              </div>
              <div>
                <label className={labelCls}>Ticket Price (pts)</label>
                <input
                  type="number"
                  min={1}
                  className={inputCls}
                  value={form.ticketCost}
                  onChange={e => set("ticketCost", +e.target.value)}
                />
              </div>
            </div>

            {createError && (
              <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                {createError}
              </div>
            )}

            <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
              <button
                onClick={handleCreate}
                disabled={creating || !form.title || !form.prize}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#00ff87] hover:bg-[#00e676] disabled:opacity-50 text-black font-bold text-sm rounded-xl transition-all"
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Create Raffle
              </button>
              <button
                onClick={() => { setShowForm(false); setCreateError(null); }}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 font-semibold text-sm rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[#a78bfa]/40" />
        </div>
      ) : (
        <>
          {/* ── Active Raffles ── */}
          <section className="space-y-3">
            <h2 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff87] shadow-[0_0_6px_rgba(0,255,135,0.8)]" />
              Active ({active.length})
            </h2>

            {active.length === 0 ? (
              <div className="text-center py-12 text-white/20 bg-[#111111] border border-white/[0.06] rounded-2xl">
                <Ticket size={36} className="mx-auto mb-2 opacity-20" />
                <p className="font-bold text-sm">No active raffles</p>
                <p className="text-xs mt-1">Create one to get started</p>
              </div>
            ) : (
              active.map(raffle => (
                <RaffleRow
                  key={raffle.id}
                  raffle={raffle}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  rolling={rolling}
                  deleting={deleting}
                  onRoll={handleRoll}
                  onDelete={handleDelete}
                />
              ))
            )}
          </section>

          {/* ── Past Raffles / History ── */}
          <section className="space-y-3">
            <h2 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
              <History size={13} className="text-[#a78bfa]" />
              History ({ended.length})
            </h2>

            {ended.length === 0 ? (
              <div className="text-center py-10 text-white/20 bg-[#111111] border border-white/[0.06] rounded-2xl">
                <Trophy size={32} className="mx-auto mb-2 opacity-20" />
                <p className="font-bold text-sm">No ended raffles yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {ended.map(raffle => (
                  <motion.div
                    key={raffle.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden"
                  >
                    <div className="flex items-center gap-4 px-5 py-4">
                      {/* Winner badge */}
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Crown size={16} className="text-amber-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-white text-sm">{raffle.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-white/30">ENDED</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-white/40 flex-wrap">
                          <span className="text-[#a78bfa]/70">🏆 {raffle.prize}</span>
                          <span><Users size={10} className="inline mr-0.5" />{raffle.totalTickets} tickets sold</span>
                          {raffle.endedAt && (
                            <span className="flex items-center gap-1"><Clock size={10} />{timeAgo(raffle.endedAt)}</span>
                          )}
                        </div>

                        {/* Winner highlight */}
                        {raffle.winner ? (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Winner:</span>
                            <span className="text-sm font-black text-amber-400">{raffle.winner}</span>
                          </div>
                        ) : (
                          <p className="text-xs text-white/20 mt-1">No winner (no tickets were sold)</p>
                        )}
                      </div>

                      {/* Expand + delete */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setExpanded(expanded === raffle.id ? null : raffle.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-xs font-semibold transition-all"
                        >
                          <Users size={12} />
                          {expanded === raffle.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                        <button
                          onClick={() => handleDelete(raffle.id)}
                          disabled={deleting === raffle.id}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                        >
                          {deleting === raffle.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </div>

                    {/* Ticket breakdown */}
                    <AnimatePresence>
                      {expanded === raffle.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-4 border-t border-white/[0.06]">
                            <p className="text-xs font-bold text-white/30 uppercase tracking-widest py-3">
                              Ticket Holders ({raffle.tickets.length} buyer{raffle.tickets.length !== 1 ? "s" : ""})
                            </p>
                            {raffle.tickets.length === 0 ? (
                              <p className="text-white/20 text-xs py-2">No tickets were purchased.</p>
                            ) : (
                              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {raffle.tickets
                                  .slice()
                                  .sort((a, b) => b.quantity - a.quantity)
                                  .map(t => (
                                    <div
                                      key={t.id}
                                      className={`flex items-center justify-between px-3 py-2 rounded-xl border ${
                                        t.username === raffle.winner
                                          ? "bg-amber-500/5 border-amber-500/20"
                                          : "bg-white/[0.03] border-white/[0.05]"
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5">
                                        {t.username === raffle.winner && <Crown size={11} className="text-amber-400" />}
                                        <span className={`text-sm font-semibold ${t.username === raffle.winner ? "text-amber-400" : "text-white/70"}`}>
                                          {t.username}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3 text-xs text-white/40">
                                        <span className="text-[#a78bfa] font-bold">{t.quantity} ticket{t.quantity !== 1 ? "s" : ""}</span>
                                        <span>{t.pointsSpent.toLocaleString()} pts</span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

// ── Active raffle row (extracted for cleanliness) ─────────────────────────────

function RaffleRow({
  raffle, expanded, setExpanded, rolling, deleting, onRoll, onDelete,
}: {
  raffle: Raffle;
  expanded: string | null;
  setExpanded: (id: string | null) => void;
  rolling: string | null;
  deleting: string | null;
  onRoll: (id: string, hasTickets: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111111] border border-[#a78bfa]/20 rounded-2xl overflow-hidden"
    >
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-[#00ff87] shadow-[0_0_8px_rgba(0,255,135,0.6)]" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-white text-sm">{raffle.title}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#a78bfa]/10 text-[#a78bfa]">ACTIVE</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-white/40 flex-wrap">
            <span className="text-[#a78bfa]/70">🏆 {raffle.prize}</span>
            <span><Coins size={10} className="inline mr-0.5" />{raffle.ticketCost.toLocaleString()} pts/ticket</span>
            <span><Users size={10} className="inline mr-0.5" />{raffle.totalTickets} ticket{raffle.totalTickets !== 1 ? "s" : ""} sold</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setExpanded(expanded === raffle.id ? null : raffle.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-xs font-semibold transition-all"
          >
            <Users size={12} />
            {expanded === raffle.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          <button
            onClick={() => onRoll(raffle.id, raffle.totalTickets > 0)}
            disabled={rolling === raffle.id || raffle.totalTickets === 0}
            title={raffle.totalTickets === 0 ? "No tickets sold yet" : "Roll winner"}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-40 text-amber-400 font-bold text-xs rounded-lg transition-all border border-amber-500/20"
          >
            {rolling === raffle.id ? <Loader2 size={12} className="animate-spin" /> : <Trophy size={12} />}
            Roll Winner
          </button>

          <button
            onClick={() => onDelete(raffle.id)}
            disabled={deleting === raffle.id}
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
          >
            {deleting === raffle.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded === raffle.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 border-t border-white/[0.06]">
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest py-3">
                Ticket Holders ({raffle.tickets.length} buyer{raffle.tickets.length !== 1 ? "s" : ""})
              </p>
              {raffle.tickets.length === 0 ? (
                <p className="text-white/20 text-xs py-2">No tickets purchased yet.</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {raffle.tickets
                    .slice()
                    .sort((a, b) => b.quantity - a.quantity)
                    .map(t => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                      >
                        <span className="text-sm font-semibold text-white/70">{t.username}</span>
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <span className="text-[#a78bfa] font-bold">{t.quantity} ticket{t.quantity !== 1 ? "s" : ""}</span>
                          <span>{t.pointsSpent.toLocaleString()} pts</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

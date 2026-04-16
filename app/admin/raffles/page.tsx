"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket, Plus, Trash2, Trophy, X, RefreshCw, Loader2,
  Users, Coins, ChevronDown, ChevronUp, Crown,
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
    } catch (err) {
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

  const activeCount = raffles.filter(r => r.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Ticket size={20} className="text-[#a78bfa]" /> Raffles
          </h1>
          <p className="text-white/40 text-sm mt-0.5">{activeCount} active raffle{activeCount !== 1 ? "s" : ""}</p>
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

      {/* Raffle list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[#a78bfa]/40" />
        </div>
      ) : raffles.length === 0 ? (
        <div className="text-center py-20 text-white/20">
          <Ticket size={40} className="mx-auto mb-3 opacity-20" />
          <p className="font-bold">No raffles yet</p>
          <p className="text-sm mt-1">Create one to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {raffles.map(raffle => (
            <motion.div
              key={raffle.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-[#111111] border rounded-2xl overflow-hidden transition-all ${
                raffle.status === "active"
                  ? "border-[#a78bfa]/20"
                  : "border-white/[0.06] opacity-70"
              }`}
            >
              {/* Main row */}
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Status dot */}
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  raffle.status === "active" ? "bg-[#00ff87] shadow-[0_0_8px_rgba(0,255,135,0.6)]" : "bg-white/20"
                }`} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-white text-sm">{raffle.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#a78bfa]/10 text-[#a78bfa]">
                      {raffle.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-white/40 flex-wrap">
                    <span className="text-[#a78bfa]/70">🏆 {raffle.prize}</span>
                    <span><Coins size={10} className="inline mr-0.5" />{raffle.ticketCost.toLocaleString()} pts/ticket</span>
                    <span><Users size={10} className="inline mr-0.5" />{raffle.totalTickets} ticket{raffle.totalTickets !== 1 ? "s" : ""} sold</span>
                  </div>
                  {raffle.winner && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-[#00ff87]">
                      <Crown size={11} /> Winner: <span className="font-bold">{raffle.winner}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Expand tickets */}
                  <button
                    onClick={() => setExpanded(expanded === raffle.id ? null : raffle.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-xs font-semibold transition-all"
                  >
                    <Users size={12} />
                    {expanded === raffle.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  {raffle.status === "active" && (
                    <button
                      onClick={() => handleRoll(raffle.id, raffle.totalTickets > 0)}
                      disabled={rolling === raffle.id || raffle.totalTickets === 0}
                      title={raffle.totalTickets === 0 ? "No tickets sold yet" : "Roll winner"}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-40 text-amber-400 font-bold text-xs rounded-lg transition-all border border-amber-500/20"
                    >
                      {rolling === raffle.id
                        ? <Loader2 size={12} className="animate-spin" />
                        : <Trophy size={12} />}
                      Roll Winner
                    </button>
                  )}

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
          ))}
        </div>
      )}
    </div>
  );
}

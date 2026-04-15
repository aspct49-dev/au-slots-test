"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Plus, Trash2, Trophy, X } from "lucide-react";

interface Raffle {
  id: string;
  title: string;
  description: string;
  ticketCost: number;
  maxTickets: number;
  endDate: string;
  prize: string;
  status: "active" | "ended";
  winner?: string;
}

const inputCls = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff87]/40 transition-colors";
const labelCls = "block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5";

const empty = (): Omit<Raffle, "id" | "status"> => ({
  title: "", description: "", ticketCost: 500, maxTickets: 100, endDate: "", prize: "",
});

export default function AdminRaffles() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty());
  const [pickingWinner, setPickingWinner] = useState<string | null>(null);
  const [winnerInput, setWinnerInput] = useState("");

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(p => ({ ...p, [k]: v }));

  const handleCreate = () => {
    if (!form.title || !form.prize) return;
    setRaffles(p => [...p, { ...form, id: Date.now().toString(), status: "active" }]);
    setForm(empty());
    setShowForm(false);
  };

  const endRaffle = (id: string, winner: string) => {
    setRaffles(p => p.map(r => r.id === id ? { ...r, status: "ended", winner } : r));
    setPickingWinner(null);
    setWinnerInput("");
  };

  const deleteRaffle = (id: string) => setRaffles(p => p.filter(r => r.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2"><Ticket size={20} className="text-[#a78bfa]" /> Raffles</h1>
          <p className="text-white/40 text-sm mt-0.5">{raffles.filter(r => r.status === "active").length} active raffles</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#00ff87] hover:bg-[#00e676] text-black font-bold text-sm rounded-xl transition-all">
          <Plus size={15} /> Create Raffle
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-black text-white">New Raffle</h2>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-white/40 hover:text-white" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. $100 Gift Card Raffle" /></div>
              <div><label className={labelCls}>Prize</label><input className={inputCls} value={form.prize} onChange={e => set("prize", e.target.value)} placeholder="e.g. $100 Amazon Gift Card" /></div>
              <div><label className={labelCls}>Ticket Cost (pts)</label><input type="number" className={inputCls} value={form.ticketCost} onChange={e => set("ticketCost", +e.target.value)} /></div>
              <div><label className={labelCls}>Max Tickets</label><input type="number" className={inputCls} value={form.maxTickets} onChange={e => set("maxTickets", +e.target.value)} /></div>
              <div><label className={labelCls}>End Date</label><input type="datetime-local" className={inputCls} value={form.endDate} onChange={e => set("endDate", e.target.value)} /></div>
            </div>
            <div><label className={labelCls}>Description</label><textarea rows={2} className={`${inputCls} resize-none`} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Optional description..." /></div>
            <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
              <button onClick={handleCreate} className="px-5 py-2.5 bg-[#00ff87] hover:bg-[#00e676] text-black font-bold text-sm rounded-xl transition-all">Create Raffle</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 font-semibold text-sm rounded-xl transition-all">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {raffles.length === 0 ? (
        <div className="text-center py-20 text-white/20">
          <Ticket size={40} className="mx-auto mb-3 opacity-20" />
          <p className="font-bold">No raffles yet</p>
          <p className="text-sm mt-1">Create one to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {raffles.map(raffle => (
            <div key={raffle.id} className={`bg-[#111111] border rounded-xl p-4 ${raffle.status === "active" ? "border-[#a78bfa]/20" : "border-white/[0.06]"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${raffle.status === "active" ? "bg-[#00ff87]/10 text-[#00ff87]" : "bg-white/5 text-white/30"}`}>
                      {raffle.status.toUpperCase()}
                    </span>
                    <h3 className="font-black text-white text-sm">{raffle.title}</h3>
                  </div>
                  <p className="text-xs text-white/40">Prize: <span className="text-white/70">{raffle.prize}</span> · {raffle.ticketCost.toLocaleString()} pts/ticket · {raffle.maxTickets} max tickets</p>
                  {raffle.winner && <p className="text-xs text-[#00ff87] mt-1 flex items-center gap-1"><Trophy size={11} /> Winner: {raffle.winner}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {raffle.status === "active" && (
                    <button onClick={() => setPickingWinner(raffle.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs rounded-lg transition-all border border-amber-500/20">
                      <Trophy size={12} /> Pick Winner
                    </button>
                  )}
                  <button onClick={() => deleteRaffle(raffle.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"><Trash2 size={13} /></button>
                </div>
              </div>
              {/* Winner picker */}
              <AnimatePresence>
                {pickingWinner === raffle.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t border-white/[0.06] flex gap-2">
                    <input value={winnerInput} onChange={e => setWinnerInput(e.target.value)} placeholder="Enter winner's username" className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff87]/40 transition-colors" />
                    <button onClick={() => winnerInput && endRaffle(raffle.id, winnerInput)} className="px-4 py-2 bg-[#00ff87] hover:bg-[#00e676] text-black font-bold text-sm rounded-xl transition-all">Confirm</button>
                    <button onClick={() => setPickingWinner(null)} className="px-3 py-2 bg-white/5 text-white/40 rounded-xl transition-all"><X size={14} /></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

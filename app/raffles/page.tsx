"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket, Trophy, Clock, Coins, Loader2, Plus, Minus,
  Crown, CheckCircle, AlertCircle, Users,
} from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";
import PointsBalance from "@/components/PointsBalance";
import { useAuth } from "@/context/AuthContext";

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
  myTickets: number;
}

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

function RaffleCard({ raffle, onBought }: { raffle: Raffle; onBought: (newPoints: number, newMyTickets: number) => void }) {
  const { user, isLoggedIn, openLoginModal, setPoints } = useAuth();
  const [qty, setQty]             = useState(1);
  const [buying, setBuying]       = useState(false);
  const [feedback, setFeedback]   = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const totalCost  = raffle.ticketCost * qty;
  const canAfford  = isLoggedIn && user ? user.points >= totalCost : false;
  const isActive   = raffle.status === "active";

  const handleBuy = async () => {
    if (!isLoggedIn) { openLoginModal(); return; }
    if (!canAfford || !isActive) return;

    setBuying(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/raffles/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raffleId: raffle.id, quantity: qty }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", msg: data.error ?? "Purchase failed." });
      } else {
        setPoints(data.points);
        onBought(data.points, raffle.myTickets + qty);
        setFeedback({ type: "success", msg: `${qty} ticket${qty > 1 ? "s" : ""} purchased!` });
        setQty(1);
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch {
      setFeedback({ type: "error", msg: "Network error. Please try again." });
    }
    setBuying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-[#111111] border rounded-2xl overflow-hidden transition-all ${
        isActive ? "border-[#a78bfa]/20 hover:border-[#a78bfa]/40" : "border-white/[0.06] opacity-75"
      }`}
    >
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#a78bfa]/60 via-[#a78bfa] to-[#a78bfa]/60" />

      <div className="p-5 sm:p-6">
        {/* Status + title */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isActive ? (
                <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse inline-block" />
                  ACTIVE
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-white/30">ENDED</span>
              )}
            </div>
            <h3 className="text-white font-black text-lg leading-tight">{raffle.title}</h3>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-white/30">Prize</p>
            <p className="text-[#a78bfa] font-black text-base">{raffle.prize}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-5 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Coins size={11} className="text-[#00ff87]" />
            <span className="text-white/60">{raffle.ticketCost.toLocaleString()}</span> pts/ticket
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} />
            {raffle.totalTickets} sold
          </span>
          {raffle.myTickets > 0 && (
            <span className="flex items-center gap-1 text-[#a78bfa]">
              <Ticket size={11} />
              You: {raffle.myTickets} ticket{raffle.myTickets !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Winner */}
        {!isActive && raffle.winner && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#00ff87]/5 border border-[#00ff87]/15 mb-4">
            <Crown size={16} className="text-[#00ff87] flex-shrink-0" />
            <div>
              <p className="text-[10px] text-[#00ff87]/60 font-bold uppercase tracking-widest">Winner</p>
              <p className="text-[#00ff87] font-black text-sm">{raffle.winner}</p>
            </div>
            {raffle.endedAt && (
              <span className="ml-auto text-white/20 text-xs flex items-center gap-1">
                <Clock size={10} /> {timeAgo(raffle.endedAt)}
              </span>
            )}
          </div>
        )}

        {/* Buy section — active only */}
        {isActive && (
          <div className="border-t border-white/[0.06] pt-4 space-y-3">
            {/* Qty picker */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all"
                >
                  <Minus size={13} />
                </button>
                <span className="text-white font-black text-lg w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all"
                >
                  <Plus size={13} />
                </button>
                <span className="text-white/30 text-xs">ticket{qty !== 1 ? "s" : ""}</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/30">Total cost</p>
                <p className="text-[#00ff87] font-black">{totalCost.toLocaleString()} pts</p>
              </div>
            </div>

            {/* Buy button */}
            <button
              onClick={handleBuy}
              disabled={buying || (!isLoggedIn ? false : !canAfford)}
              className={`w-full py-3 rounded-xl font-black text-sm tracking-widest flex items-center justify-center gap-2 transition-all ${
                !isLoggedIn
                  ? "bg-[#a78bfa]/10 text-[#a78bfa] border border-[#a78bfa]/30 hover:bg-[#a78bfa]/20"
                  : canAfford
                  ? "bg-[#a78bfa] hover:bg-[#9333ea] text-white hover:shadow-[0_0_20px_rgba(167,139,250,0.4)]"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              } disabled:opacity-60`}
            >
              {buying ? (
                <Loader2 size={15} className="animate-spin" />
              ) : !isLoggedIn ? (
                "LOG IN TO BUY"
              ) : !canAfford ? (
                `NEED ${(totalCost - (user?.points ?? 0)).toLocaleString()} MORE PTS`
              ) : (
                <><Ticket size={14} /> BUY {qty} TICKET{qty > 1 ? "S" : ""}</>
              )}
            </button>

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
                    feedback.type === "success"
                      ? "bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {feedback.type === "success" ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                  {feedback.msg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function RafflesPage() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/raffles");
    if (res.ok) setRaffles(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleBought = (raffleId: string, newPoints: number, newMyTickets: number) => {
    setRaffles(prev => prev.map(r =>
      r.id === raffleId
        ? { ...r, myTickets: newMyTickets, totalTickets: r.totalTickets + (newMyTickets - r.myTickets) }
        : r
    ));
  };

  const active = raffles.filter(r => r.status === "active");
  const ended  = raffles.filter(r => r.status === "ended");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="relative py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(167,139,250,0.1)_0%,transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#a78bfa]/10 border border-[#a78bfa]/20 mb-4">
              <Ticket size={12} className="text-[#a78bfa]" />
              <span className="text-[#a78bfa] text-xs font-bold tracking-widest">WIN BIG</span>
            </div>
            <BubbleText className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4 text-[#a78bfa]/60">
              {"RAFFLES"}
            </BubbleText>
            <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto">
              Buy tickets with your points for a chance to win big prizes.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-20">
        {/* Balance row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-xl font-black text-white mb-1">Active Raffles</h2>
            <p className="text-white/40 text-sm">Use your points to enter. More tickets = better odds!</p>
          </div>
          <PointsBalance size="md" />
        </div>

        {/* Active raffles */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#a78bfa]/40" />
          </div>
        ) : active.length === 0 ? (
          <div className="text-center py-16 bg-[#111111] border border-white/[0.06] rounded-2xl mb-10">
            <Ticket size={40} className="mx-auto mb-3 text-[#a78bfa]/20" />
            <p className="text-white/40 font-bold">No active raffles right now</p>
            <p className="text-white/20 text-sm mt-1">Check back soon — new raffles are added regularly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">
            {active.map(r => (
              <RaffleCard
                key={r.id}
                raffle={r}
                onBought={(pts, myTickets) => handleBought(r.id, pts, myTickets)}
              />
            ))}
          </div>
        )}

        {/* Past winners — always shown */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Trophy size={18} className="text-[#a78bfa]" />
            <h2 className="text-xl font-black text-white">Past Winners</h2>
          </div>
          {ended.length === 0 ? (
            <div className="text-center py-10 bg-[#111111] border border-white/[0.06] rounded-2xl">
              <Crown size={32} className="mx-auto mb-2 text-[#a78bfa]/20" />
              <p className="text-white/30 font-bold text-sm">No raffles have ended yet</p>
              <p className="text-white/20 text-xs mt-1">Winners will appear here once a raffle is drawn.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ended.map(r => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 p-4 bg-[#111111] border border-white/[0.06] rounded-xl"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Crown size={16} className="text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-400 font-black text-sm">{r.winner ?? "No winner"}</p>
                    <p className="text-white/40 text-xs truncate">{r.title} · <span className="text-[#a78bfa]/70">{r.prize}</span></p>
                  </div>
                  {r.endedAt && (
                    <span className="text-white/20 text-xs flex items-center gap-1 flex-shrink-0">
                      <Clock size={11} /> {timeAgo(r.endedAt)}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

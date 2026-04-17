"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  Info,
  ShoppingBag,
  Monitor,
  MessageCircle,
  Target,
  PartyPopper,
  Loader2,
  History,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";
import RewardCard from "@/components/RewardCard";
import PointsBalance from "@/components/PointsBalance";
import Particles from "@/components/Particles";
import type { ShopItem } from "@/lib/shopStore";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PublicRedemption {
  id: string;
  username: string;
  itemName: string;
  spinCount: number;
  pointCost: number;
  redeemedAt: number;
  status: "pending" | "fulfilled" | "rejected";
  fulfilledAt?: number;
  rejectedAt?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function StatusPill({ status }: { status: PublicRedemption["status"] }) {
  if (status === "fulfilled")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20">
        <CheckCircle2 size={9} /> DELIVERED
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
        <XCircle size={9} /> REJECTED
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <Clock size={9} /> PENDING
    </span>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <div className="relative py-12 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,255,135,0.12)_0%,transparent_60%)]" />
      <div className="absolute inset-0">
        <Particles count={30} maxSize={2} speed={0.2} intense />
      </div>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,135,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,135,1) 1px, transparent 1px)",
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff87]/10 border border-[#00ff87]/20 mb-4">
            <ShoppingBag size={12} className="text-[#00ff87]" />
            <span className="text-[#00ff87] text-xs font-bold tracking-widest">
              REWARDS STORE
            </span>
          </div>
          <BubbleText className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4 text-[#00ff87]/60">{"POINTS SHOP"}</BubbleText>
          <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto">
            Spend your points to buy amazing bonuses!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function HowToEarn() {
  const ways = [
    { icon: <Monitor size={20} className="text-[#00ff87]" />, title: "Watch Streams", desc: "Earn points passively while watching" },
    { icon: <MessageCircle size={20} className="text-[#60a5fa]" />, title: "Chat Activity", desc: "Be active in chat for bonus points" },
    { icon: <Target size={20} className="text-[#fbbf24]" />, title: "Challenges", desc: "Complete challenges for big point boosts" },
    { icon: <PartyPopper size={20} className="text-[#a78bfa]" />, title: "Giveaways", desc: "Win points in giveaway events" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-10 p-5 rounded-2xl bg-[#111111] border border-[#00ff87]/15"
    >
      <div className="flex items-center gap-2 mb-4">
        <Info size={16} className="text-[#00ff87]" />
        <h3 className="text-white font-bold text-sm tracking-wider">
          HOW TO EARN POINTS
        </h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ways.map((way) => (
          <div key={way.title} className="flex items-start gap-3">
            <span className="flex-shrink-0 mt-0.5">{way.icon}</span>
            <div>
              <div className="text-white font-semibold text-sm">{way.title}</div>
              <div className="text-white/40 text-xs mt-0.5">{way.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RedemptionsHistory() {
  const [redemptions, setRedemptions] = useState<PublicRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shop/redemptions", { cache: "no-store" });
      if (res.ok) setRedemptions(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const visible = showAll ? redemptions : redemptions.slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-14"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00ff87]/10 border border-[#00ff87]/20 flex items-center justify-center">
            <History size={15} className="text-[#00ff87]" />
          </div>
          <div>
            <h2 className="text-white font-black text-base tracking-tight">Redemption History</h2>
            <p className="text-white/30 text-xs">
              {loading ? "Loading…" : `${redemptions.length} total redemption${redemptions.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <button
          onClick={load}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/30 hover:text-white transition-all"
          title="Refresh"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#111111] border border-white/[0.06] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_2fr_auto_auto] sm:grid-cols-[1fr_2fr_1fr_auto_auto] gap-x-4 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="text-[10px] font-bold text-white/25 tracking-widest uppercase">User</span>
          <span className="text-[10px] font-bold text-white/25 tracking-widest uppercase">Item</span>
          <span className="hidden sm:block text-[10px] font-bold text-white/25 tracking-widest uppercase">Points</span>
          <span className="text-[10px] font-bold text-white/25 tracking-widest uppercase">When</span>
          <span className="text-[10px] font-bold text-white/25 tracking-widest uppercase text-right">Status</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={22} className="animate-spin text-[#00ff87]/30" />
          </div>
        ) : redemptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <History size={32} className="text-white/10" />
            <p className="text-white/25 text-sm font-semibold">No redemptions yet</p>
            <p className="text-white/15 text-xs">Be the first to redeem!</p>
          </div>
        ) : (
          <AnimatePresence>
            {visible.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="grid grid-cols-[1fr_2fr_auto_auto] sm:grid-cols-[1fr_2fr_1fr_auto_auto] gap-x-4 items-center px-5 py-3.5 border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >
                {/* Username */}
                <div className="min-w-0">
                  <span className="text-sm font-bold text-white/80 truncate block">{r.username}</span>
                </div>

                {/* Item */}
                <div className="min-w-0">
                  <div className="flex flex-col">
                    <span className="text-sm text-white/70 truncate">{r.itemName}</span>
                    {r.spinCount > 0 && (
                      <span className="text-[10px] text-[#00ff87]/50 font-semibold">{r.spinCount} spins</span>
                    )}
                  </div>
                </div>

                {/* Points */}
                <div className="hidden sm:flex items-center gap-1">
                  <Coins size={12} className="text-[#00ff87]/60" />
                  <span className="text-sm text-white/50 font-semibold">{r.pointCost.toLocaleString()}</span>
                </div>

                {/* When */}
                <div>
                  <span className="text-xs text-white/30 whitespace-nowrap">{timeAgo(r.redeemedAt)}</span>
                </div>

                {/* Status */}
                <div className="flex justify-end">
                  <StatusPill status={r.status} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Show more / less */}
        {!loading && redemptions.length > 10 && (
          <div className="border-t border-white/[0.04] px-5 py-3 flex justify-center">
            <button
              onClick={() => setShowAll(v => !v)}
              className="text-xs font-bold text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5"
            >
              {showAll
                ? "Show less ↑"
                : `Show all ${redemptions.length} redemptions ↓`}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PointsShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shop/items")
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <PageHeader />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-20">
        {/* Balance + Info row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-white mb-1">Available Rewards</h2>
            <p className="text-white/40 text-sm">
              {loading ? "Loading…" : `${items.length} items available — Inventory refreshed weekly`}
            </p>
          </div>
          <PointsBalance size="md" />
        </div>

        <HowToEarn />

        {/* Rewards grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#00ff87]/40" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <RewardCard {...item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Global Redemption History */}
        <RedemptionsHistory />

        {/* Info note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 p-4 rounded-xl bg-[#111111] border border-white/5 flex items-start gap-3"
        >
          <Coins size={16} className="text-[#00ff87] mt-0.5 flex-shrink-0" />
          <p className="text-white/40 text-xs leading-relaxed">
            All redemptions are subject to verification. Rewards will be delivered within 48 hours of redemption.
            Points are non-transferable and have no monetary value. By redeeming, you agree to our terms of service.
            18+ only. Please gamble responsibly.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

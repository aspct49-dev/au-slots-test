"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Coins,
  AlertCircle,
  Loader2,
  RefreshCw,
  History,
  User,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Redemption {
  id: string;
  itemId: string;
  itemName: string;
  spinCount: number;
  pointCost: number;
  redeemedAt: number;
  status: "pending" | "fulfilled" | "rejected";
  fulfilledAt?: number;
  rejectedAt?: number;
  rejectionReason?: string;
  infoSubmitted?: boolean;
}

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

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Redemption["status"] }) {
  if (status === "fulfilled") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20">
        <CheckCircle2 size={11} />
        DELIVERED
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
        <XCircle size={11} />
        REJECTED
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <Clock size={11} />
      PENDING
    </span>
  );
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

// ── My Redemptions Tab ────────────────────────────────────────────────────────

function MyRedemptions({
  redemptions,
  loading,
  onRefresh,
  username,
}: {
  redemptions: Redemption[];
  loading: boolean;
  onRefresh: () => void;
  username: string;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const pending   = redemptions.filter(r => r.status === "pending").length;
  const fulfilled = redemptions.filter(r => r.status === "fulfilled").length;

  const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
  const hasPending = redemptions.some(r => r.status === "pending");
  const lastFulfilled = redemptions
    .filter(r => r.status === "fulfilled")
    .sort((a, b) => b.redeemedAt - a.redeemedAt)[0];
  const cooldownActive =
    hasPending ||
    (lastFulfilled && Date.now() - lastFulfilled.redeemedAt < COOLDOWN_MS);
  const daysLeft = lastFulfilled
    ? Math.ceil((COOLDOWN_MS - (Date.now() - lastFulfilled.redeemedAt)) / (24 * 60 * 60 * 1000))
    : 0;

  return (
    <div>
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { label: "TOTAL",     value: redemptions.length, color: "text-white/70",    bg: "bg-white/[0.04]" },
          { label: "PENDING",   value: pending,            color: "text-amber-400",   bg: "bg-amber-500/[0.07]" },
          { label: "DELIVERED", value: fulfilled,          color: "text-[#00ff87]",   bg: "bg-[#00ff87]/[0.07]" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 border border-white/[0.06] text-center`}>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-[10px] font-bold text-white/30 tracking-widest mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Cooldown notice */}
      {cooldownActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-amber-500/[0.08] border border-amber-500/20 text-amber-400 text-sm mb-6"
        >
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            {hasPending
              ? "You have a pending redemption. You can redeem again once it's processed."
              : `You can redeem again in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}. Items can only be redeemed once every 7 days.`}
          </div>
        </motion.div>
      )}

      {/* Redemption list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-[#00ff87]/30" />
        </div>
      ) : redemptions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <ClipboardList size={40} className="mx-auto mb-3 text-white/10" />
          <p className="text-white/30 font-bold">No redemptions yet</p>
          <p className="text-white/20 text-sm mt-1">
            Head to the{" "}
            <a href="/points-shop" className="text-[#00ff87]/70 hover:text-[#00ff87] transition-colors underline underline-offset-2">
              Points Shop
            </a>{" "}
            to redeem your points.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {redemptions.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className={`bg-[#111111] border rounded-2xl overflow-hidden transition-colors ${
                r.status === "rejected"
                  ? "border-red-500/15"
                  : r.status === "fulfilled"
                  ? "border-[#00ff87]/10"
                  : "border-white/[0.07]"
              }`}
            >
              {/* Main row */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  r.status === "fulfilled"
                    ? "bg-[#00ff87]"
                    : r.status === "rejected"
                    ? "bg-red-500"
                    : "bg-amber-400"
                }`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm truncate">{r.itemName}</span>
                    {r.spinCount > 0 && (
                      <span className="text-[10px] text-white/30 font-semibold">
                        ({r.spinCount} spins)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-white/30 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Coins size={10} />
                      {r.pointCost.toLocaleString()} pts
                    </span>
                    <span>{formatDate(r.redeemedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={r.status} />
                  {(r.rejectionReason || r.status === "fulfilled") && (
                    <button
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/30 hover:text-white transition-all"
                    >
                      {expanded === r.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {expanded === r.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 border-t border-white/[0.06]">
                      {r.status === "fulfilled" && (
                        <div className="flex items-start gap-2.5 pt-3">
                          <CheckCircle2 size={15} className="text-[#00ff87] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-[#00ff87]">Reward Delivered</p>
                            {r.fulfilledAt && (
                              <p className="text-xs text-white/30 mt-0.5">
                                Fulfilled on {formatDate(r.fulfilledAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      {r.status === "rejected" && r.rejectionReason && (
                        <div className="flex items-start gap-2.5 pt-3">
                          <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-red-400">Rejection Reason</p>
                            <p className="text-sm text-white/50 mt-1 leading-relaxed">
                              {r.rejectionReason}
                            </p>
                            {r.rejectedAt && (
                              <p className="text-xs text-white/25 mt-1.5">
                                Rejected on {formatDate(r.rejectedAt)}
                              </p>
                            )}
                            <p className="text-xs text-white/30 mt-2">
                              Your {r.pointCost.toLocaleString()} points have been returned to your balance.
                            </p>
                          </div>
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

// ── All Redemptions Tab ───────────────────────────────────────────────────────

function AllRedemptions() {
  const [redemptions, setRedemptions] = useState<PublicRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "fulfilled" | "rejected">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shop/redemptions", { cache: "no-store" });
      if (res.ok) setRedemptions(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered =
    filter === "all"
      ? redemptions
      : redemptions.filter(r => r.status === filter);

  const FILTERS = [
    { key: "all",       label: "All" },
    { key: "pending",   label: "Pending" },
    { key: "fulfilled", label: "Delivered" },
    { key: "rejected",  label: "Rejected" },
  ] as const;

  const counts = {
    all:       redemptions.length,
    pending:   redemptions.filter(r => r.status === "pending").length,
    fulfilled: redemptions.filter(r => r.status === "fulfilled").length,
    rejected:  redemptions.filter(r => r.status === "rejected").length,
  };

  return (
    <div>
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-4 gap-3 mb-6"
      >
        {[
          { label: "TOTAL",     value: counts.all,       color: "text-white/70",   bg: "bg-white/[0.04]" },
          { label: "PENDING",   value: counts.pending,   color: "text-amber-400",  bg: "bg-amber-500/[0.07]" },
          { label: "DELIVERED", value: counts.fulfilled, color: "text-[#00ff87]",  bg: "bg-[#00ff87]/[0.07]" },
          { label: "REJECTED",  value: counts.rejected,  color: "text-red-400",    bg: "bg-red-500/[0.07]" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 border border-white/[0.06] text-center`}>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-[10px] font-bold text-white/30 tracking-widest mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
              filter === f.key
                ? "bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20"
                : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-transparent"
            }`}
          >
            {f.label}
            <span className="ml-1.5 opacity-50">({counts[f.key]})</span>
          </button>
        ))}
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
          <div className="flex items-center justify-center py-14">
            <Loader2 size={22} className="animate-spin text-[#00ff87]/30" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <History size={32} className="text-white/10" />
            <p className="text-white/25 text-sm font-semibold">No {filter === "all" ? "" : filter} redemptions found</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.025 }}
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
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Tab = "mine" | "all";

export default function DashboardPage() {
  const { user, isLoggedIn, isLoading, openLoginModal } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("mine");
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      openLoginModal();
      router.replace("/");
    }
  }, [isLoading, isLoggedIn, openLoginModal, router]);

  const loadMine = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/redemptions", { cache: "no-store" });
      if (res.ok) setRedemptions(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) loadMine();
  }, [isLoggedIn, loadMine]);

  if (isLoading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-16">
        <Loader2 size={28} className="animate-spin text-[#00ff87]/40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList size={18} className="text-[#00ff87]" />
                <h1 className="text-2xl font-black text-white tracking-tight">MY DASHBOARD</h1>
              </div>
              <p className="text-white/40 text-sm">
                Logged in as <span className="text-white/70 font-semibold">{user?.username}</span>
              </p>
            </div>
            {tab === "mine" && (
              <button
                onClick={loadMine}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="flex items-center gap-2 mb-7 p-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl w-fit"
        >
          {[
            { key: "mine" as Tab, icon: <User size={13} />, label: "My Redemptions" },
            { key: "all"  as Tab, icon: <History size={13} />, label: "All Redemptions" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t.key
                  ? "bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {tab === "mine" ? (
            <motion.div
              key="mine"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MyRedemptions
                redemptions={redemptions}
                loading={loading}
                onRefresh={loadMine}
                username={user?.username ?? ""}
              />
            </motion.div>
          ) : (
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AllRedemptions />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

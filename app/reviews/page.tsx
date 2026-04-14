"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Star,
  ChevronDown,
  Shield,
  Zap,
  TrendingUp,
  Lightbulb,
  Award,
} from "lucide-react";
import Image from "next/image";
import Particles from "@/components/Particles";
import SlotReviewCard from "@/components/SlotReviewCard";
import {
  reviews,
  providers,
  volatilities,
  type SlotReview,
  type Volatility,
} from "@/lib/reviewsData";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const VOLATILITY_COLOR: Record<Volatility, string> = {
  LOW: "text-blue-400 bg-blue-500/20 border-blue-500/30",
  MEDIUM: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
  HIGH: "text-orange-400 bg-orange-500/20 border-orange-500/30",
  "VERY HIGH": "text-red-400 bg-red-500/20 border-red-500/30",
};

function StarRow({
  rating,
  max = 10,
  size = 14,
}: {
  rating: number;
  max?: number;
  size?: number;
}) {
  const filled = Math.round((rating / max) * 5);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < filled ? "text-amber-400 fill-amber-400" : "text-white/20 fill-white/20"
          }
        />
      ))}
    </div>
  );
}

// ─── Review Modal ─────────────────────────────────────────────────────────────

function ReviewModal({
  review,
  onClose,
}: {
  review: SlotReview;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-8 px-4"
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
          >
            <X size={18} />
          </button>

          {/* Header — image + core info */}
          <div className="flex flex-col sm:flex-row gap-0">
            {/* Image */}
            <div className="relative w-full sm:w-56 flex-shrink-0 aspect-video sm:aspect-auto sm:h-auto min-h-[140px]">
              {review.imageUrl ? (
                <Image
                  src={review.imageUrl}
                  alt={review.gameName}
                  fill
                  className="object-cover"
                  sizes="224px"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: review.gradientFallback }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111111] hidden sm:block" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111111] sm:hidden" />
            </div>

            {/* Info */}
            <div className="flex-1 p-6 pt-5">
              <span
                className="inline-block text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full border mb-3"
                style={{
                  color: review.providerColor,
                  borderColor: `${review.providerColor}40`,
                  background: `${review.providerColor}15`,
                }}
              >
                {review.provider}
              </span>
              <h2 className="font-black text-xl text-white leading-tight mb-4">
                {review.gameName} — Slot Review
              </h2>

              {/* Dual ratings */}
              <div className="flex flex-wrap gap-6 mb-4">
                <div>
                  <p className="text-[11px] text-white/40 mb-1 tracking-widest">AUSLOTS RATING</p>
                  <StarRow rating={review.streamerRating} size={16} />
                  <p className="text-sm font-bold text-amber-400 mt-1">
                    {review.streamerRating}/10
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-white/40 mb-1 tracking-widest">USER RATING</p>
                  <StarRow rating={review.userRating} size={16} />
                  <p className="text-xs text-white/40 mt-1">
                    <span className="text-white/70 font-semibold">{review.userRating}/10</span>{" "}
                    · {review.userRatingCount.toLocaleString()} users
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {review.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 pt-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content — 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <section>
                <h3 className="flex items-center gap-2 text-xs font-black tracking-widest text-white/60 uppercase mb-3 border-b border-white/[0.06] pb-2">
                  <Shield size={13} className="text-[#00ff87]" />
                  About
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">{review.about}</p>
              </section>

              {/* Betting & Features */}
              <section>
                <h3 className="flex items-center gap-2 text-xs font-black tracking-widest text-white/60 uppercase mb-3 border-b border-white/[0.06] pb-2">
                  <Zap size={13} className="text-[#00ff87]" />
                  Betting Options &amp; Bonus Features
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {review.bettingAndFeatures}
                </p>
              </section>

              {/* Gameplay Features */}
              <section>
                <h3 className="flex items-center gap-2 text-xs font-black tracking-widest text-white/60 uppercase mb-3 border-b border-white/[0.06] pb-2">
                  <TrendingUp size={13} className="text-[#00ff87]" />
                  Gameplay Features &amp; Mechanics
                </h3>
                <ul className="space-y-2">
                  {review.gameplayFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#00ff87] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Streamer Take */}
              <section>
                <h3 className="flex items-center gap-2 text-xs font-black tracking-widest text-white/60 uppercase mb-3 border-b border-white/[0.06] pb-2">
                  <Star size={13} className="text-[#00ff87]" />
                  AUSlots&apos; Take
                </h3>
                <p className="text-sm text-white/70 leading-relaxed italic border-l-2 border-[#00ff87]/40 pl-4">
                  &ldquo;{review.streamerTake}&rdquo;
                </p>
              </section>

              {/* Final Verdict */}
              <section>
                <h3 className="flex items-center gap-2 text-xs font-black tracking-widest text-white/60 uppercase mb-3 border-b border-white/[0.06] pb-2">
                  <Award size={13} className="text-[#00ff87]" />
                  Final Verdict &amp; Conclusion
                </h3>
                <p className="text-sm text-white/80 leading-relaxed font-medium">
                  {review.finalVerdict}
                </p>
              </section>
            </div>

            {/* Sidebar — 1/3 */}
            <div className="space-y-4">
              {/* Quick Game Info */}
              <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-4">
                <h4 className="text-xs font-black tracking-widest text-white/60 uppercase mb-3">
                  Quick Game Info
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Provider</span>
                    <span
                      className="font-bold text-xs"
                      style={{ color: review.providerColor }}
                    >
                      {review.provider}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Release Date</span>
                    <span className="text-white/70 font-semibold">{review.releaseDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Volatility</span>
                    <span
                      className={`text-[11px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${VOLATILITY_COLOR[review.volatility]}`}
                    >
                      {review.volatility}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">RTP</span>
                    <span className="text-[#00ff87] font-bold">{review.rtp}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Max Win</span>
                    <span className="text-white font-bold">{review.maxWin}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Min Bet</span>
                    <span className="text-white/70">{review.minBet}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Max Bet</span>
                    <span className="text-white/70">{review.maxBet}</span>
                  </div>
                </div>
              </div>

              {/* Gaming Tips */}
              <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-4">
                <h4 className="flex items-center gap-2 text-xs font-black tracking-widest text-white/60 uppercase mb-3">
                  <Lightbulb size={12} className="text-amber-400" />
                  Slot Gaming Tips
                </h4>
                <ul className="space-y-2">
                  {review.gamingTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400/60 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* AUSlots rating summary */}
              <div className="bg-[#00ff87]/5 border border-[#00ff87]/10 rounded-xl p-4 text-center">
                <p className="text-[11px] tracking-widest text-white/40 uppercase mb-2">
                  AUSlots Score
                </p>
                <p className="text-4xl font-black text-[#00ff87]">
                  {review.streamerRating}
                  <span className="text-lg text-white/30">/10</span>
                </p>
                <StarRow rating={review.streamerRating} size={18} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SortKey = "rating" | "rtp" | "name" | "newest";

export default function ReviewsPage() {
  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("All");
  const [selectedVolatility, setSelectedVolatility] = useState<Volatility | "All">("All");
  const [sortBy, setSortBy] = useState<SortKey>("rating");
  const [activeReview, setActiveReview] = useState<SlotReview | null>(null);
  const [sortOpen, setSortOpen] = useState(false);

  const SORT_LABELS: Record<SortKey, string> = {
    rating: "Top Rated",
    rtp: "Highest RTP",
    name: "A – Z",
    newest: "Newest First",
  };

  const filtered = useMemo(() => {
    let list = [...reviews];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.gameName.toLowerCase().includes(q) ||
          r.provider.toLowerCase().includes(q)
      );
    }

    if (selectedProvider !== "All") {
      list = list.filter((r) => r.provider === selectedProvider);
    }

    if (selectedVolatility !== "All") {
      list = list.filter((r) => r.volatility === selectedVolatility);
    }

    switch (sortBy) {
      case "rating":
        list.sort((a, b) => b.streamerRating - a.streamerRating);
        break;
      case "rtp":
        list.sort((a, b) => b.rtp - a.rtp);
        break;
      case "name":
        list.sort((a, b) => a.gameName.localeCompare(b.gameName));
        break;
      case "newest":
        list.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
        break;
    }

    return list;
  }, [search, selectedProvider, selectedVolatility, sortBy]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 relative overflow-x-hidden">
      <Particles count={30} color="#00ff87" size={1.5} speed={0.4} />

      {/* Subtle top glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00ff87]/5 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-[1300px] mx-auto px-4 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-[11px] font-bold tracking-[0.3em] text-[#00ff87] bg-[#00ff87]/10 border border-[#00ff87]/20 px-4 py-1.5 rounded-full mb-4">
            SLOT REVIEWS
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Honest{" "}
            <span className="text-green-gradient">Reviews</span>
          </h1>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Every slot reviewed and rated by AUSlots — RTP, volatility, features, and the real talk.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#111111] border border-white/[0.06] rounded-2xl p-4 mb-8 space-y-4"
        >
          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                placeholder="Search games or providers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff87]/30 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border border-white/[0.06] rounded-xl text-sm text-white/60 hover:text-white hover:border-white/20 transition-all"
              >
                <span className="text-xs font-bold tracking-wider">
                  {SORT_LABELS[sortBy]}
                </span>
                <ChevronDown
                  size={13}
                  className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 top-full mt-1.5 w-44 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20"
                  >
                    {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSortBy(key);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortBy === key
                            ? "text-[#00ff87] bg-[#00ff87]/10"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {SORT_LABELS[key]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Provider filter chips */}
          <div className="flex flex-wrap gap-2">
            {["All", ...providers].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedProvider(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                  selectedProvider === p
                    ? "bg-[#00ff87] text-black"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Volatility filter chips */}
          <div className="flex flex-wrap gap-2">
            {(["All", ...volatilities] as const).map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVolatility(v)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                  selectedVolatility === v
                    ? "bg-[#00ff87] text-black"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {v === "All" ? "All Volatility" : v}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs text-white/30 font-medium">
            {filtered.length} review{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((review, i) => (
              <SlotReviewCard
                key={review.id}
                review={review}
                index={i}
                onViewReview={setActiveReview}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-white/20 text-4xl mb-4">🎰</p>
            <p className="text-white/40 font-bold">No reviews match your filters.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedProvider("All");
                setSelectedVolatility("All");
              }}
              className="mt-4 text-xs text-[#00ff87] hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      {activeReview && (
        <ReviewModal review={activeReview} onClose={() => setActiveReview(null)} />
      )}
    </main>
  );
}

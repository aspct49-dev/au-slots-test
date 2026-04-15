"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, BookOpen } from "lucide-react";
import type { SlotReview, Tag, Volatility } from "@/lib/reviewsData";

const TAG_STYLES: Record<Tag, string> = {
  HOT: "bg-red-500/20 text-red-400 border border-red-500/30",
  NEW: "bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/30",
  "STREAMER FAV": "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  CLASSIC: "bg-white/10 text-white/60 border border-white/20",
};

const VOLATILITY_STYLES: Record<Volatility, string> = {
  LOW: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  MEDIUM: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  HIGH: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  "VERY HIGH": "bg-red-500/20 text-red-400 border border-red-500/30",
};

function StarRow({ rating, max = 10 }: { rating: number; max?: number }) {
  const stars = 5;
  const filled = Math.round((rating / max) * stars);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: stars }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < filled ? "text-amber-400 fill-amber-400" : "text-white/20 fill-white/20"}
        />
      ))}
    </div>
  );
}

interface Props {
  review: SlotReview;
  index: number;
  onViewReview: (review: SlotReview) => void;
}

export default function SlotReviewCard({ review, index, onViewReview }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden card-hover cursor-pointer flex flex-col"
      onClick={() => onViewReview(review)}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        {review.imageUrl ? (
          <Image
            src={review.imageUrl}
            alt={review.gameName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: review.gradientFallback }}
          />
        )}
        {/* Gradient overlay at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

        {/* Tags */}
        {review.tags.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            {review.tags.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full ${TAG_STYLES[tag]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Provider + Volatility */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[11px] font-bold tracking-wide px-2 py-0.5 rounded-full border"
            style={{
              color: review.providerColor,
              borderColor: `${review.providerColor}40`,
              background: `${review.providerColor}15`,
            }}
          >
            {review.provider}
          </span>
          <span
            className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full ${VOLATILITY_STYLES[review.volatility]}`}
          >
            {review.volatility}
          </span>
        </div>

        {/* Game name */}
        <h3 className="font-black text-base text-white leading-tight group-hover:text-[#00ff87] transition-colors">
          {review.gameName}
        </h3>

        {/* Rating row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <StarRow rating={review.streamerRating} />
            <span className="text-[11px] text-white/40">
              AUSlots:{" "}
              <span className="text-amber-400 font-bold">{review.streamerRating}/10</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-white/40 block">RTP</span>
            <span className="text-sm font-bold text-[#00ff87]">{review.rtp}%</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* Read Review button */}
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-[#00ff87]/10 hover:border-[#00ff87]/30 hover:text-[#00ff87] text-white/60 text-xs font-bold tracking-widest transition-all duration-200">
          <BookOpen size={13} />
          READ REVIEW
        </button>
      </div>
    </motion.div>
  );
}

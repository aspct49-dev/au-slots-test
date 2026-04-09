"use client";

import { motion } from "framer-motion";
import { Trophy, Crown } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  avatar?: string;
  change?: "up" | "down" | "same";
}

interface LeaderboardTableProps {
  entries?: LeaderboardEntry[];
  isActive?: boolean;
}

function getRankStyle(rank: number) {
  if (rank === 1)
    return {
      text: "#FFD700",
      bg: "rgba(255,215,0,0.08)",
      border: "rgba(255,215,0,0.2)",
      badge: "bg-[#FFD700] text-black",
    };
  if (rank === 2)
    return {
      text: "#C0C0C0",
      bg: "rgba(192,192,192,0.05)",
      border: "rgba(192,192,192,0.15)",
      badge: "bg-[#C0C0C0] text-black",
    };
  if (rank === 3)
    return {
      text: "#CD7F32",
      bg: "rgba(205,127,50,0.05)",
      border: "rgba(205,127,50,0.15)",
      badge: "bg-[#CD7F32] text-black",
    };
  return {
    text: "rgba(255,255,255,0.5)",
    bg: "transparent",
    border: "rgba(255,255,255,0.04)",
    badge: "bg-white/10 text-white/50",
  };
}

export default function LeaderboardTable({
  entries = [],
  isActive = false,
}: LeaderboardTableProps) {
  if (!isActive || entries.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff87]/30 to-transparent" />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Trophy size={48} className="text-white/10 mb-4" />
          </motion.div>
          <h3 className="text-white/60 font-bold text-lg mb-2">
            No active leaderboard
          </h3>
          <p className="text-white/30 text-sm max-w-xs">
            No leaderboard is active at the moment. Check back soon — the next competition is coming!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#111111] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff87]/30 to-transparent" />

      {/* Table header */}
      <div className="grid grid-cols-12 px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="col-span-1 text-xs font-bold tracking-widest text-white/30">
          #
        </div>
        <div className="col-span-7 text-xs font-bold tracking-widest text-white/30">
          PLAYER
        </div>
        <div className="col-span-4 text-right text-xs font-bold tracking-widest text-white/30">
          POINTS
        </div>
      </div>

      {/* Entries */}
      <div className="divide-y divide-white/[0.04]">
        {entries.map((entry, index) => {
          const style = getRankStyle(entry.rank);
          return (
            <motion.div
              key={entry.username}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="grid grid-cols-12 items-center px-6 py-4 transition-colors hover:bg-white/[0.02]"
              style={{
                backgroundColor: style.bg,
                borderLeft: entry.rank <= 3 ? `2px solid ${style.text}` : undefined,
              }}
            >
              {/* Rank */}
              <div className="col-span-1">
                {entry.rank === 1 ? (
                  <Crown size={18} className="text-[#FFD700]" />
                ) : (
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${style.badge}`}
                  >
                    {entry.rank}
                  </span>
                )}
              </div>

              {/* Player */}
              <div className="col-span-7 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black"
                  style={{
                    backgroundColor: `${style.text}20`,
                    color: style.text,
                    border: `1px solid ${style.text}30`,
                  }}
                >
                  {entry.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span
                    className="font-bold text-sm"
                    style={{ color: entry.rank <= 3 ? style.text : "#fff" }}
                  >
                    {entry.username}
                  </span>
                </div>
              </div>

              {/* Points */}
              <div className="col-span-4 text-right">
                <span
                  className="font-black text-sm"
                  style={{ color: entry.rank <= 3 ? style.text : "rgba(255,255,255,0.7)" }}
                >
                  {entry.points.toLocaleString()}
                </span>
                <span className="text-white/30 text-xs ml-1">pts</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

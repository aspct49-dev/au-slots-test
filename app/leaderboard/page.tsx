"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, Eye, MessageSquare, Zap, ArrowRight, Crown, Medal } from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";
import LeaderboardTable from "@/components/LeaderboardTable";

function PageHeader() {
  return (
    <div className="relative py-12 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,215,0,0.08)_0%,transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,215,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,1) 1px, transparent 1px)",
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 mb-4">
            <Trophy size={12} className="text-[#FFD700]" />
            <span className="text-[#FFD700] text-xs font-bold tracking-widest">
              COMPETITION
            </span>
          </div>
          <BubbleText className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4 text-[#FFD700]/60">{"LEADERBOARDS"}</BubbleText>
          <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto">
            Compete for top ranks and win exclusive prizes. The most dedicated viewers are rewarded.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function HowToCompete() {
  const steps = [
    {
      number: "1",
      title: "FOLLOW AUSLOTS",
      description:
        "Follow the official Kick channel and enable notifications so you never miss a stream.",
      icon: <Zap size={24} />,
      color: "#00ff87",
    },
    {
      number: "2",
      title: "WATCH STREAM",
      description:
        "Tune in live and watch the streams. Points accumulate automatically while you&apos;re watching.",
      icon: <Eye size={24} />,
      color: "#60a5fa",
    },
    {
      number: "3",
      title: "BE ACTIVE IN STREAMS",
      description:
        "Engage in chat, participate in polls, and interact with other viewers to earn bonus points.",
      icon: <MessageSquare size={24} />,
      color: "#a78bfa",
    },
  ];

  return (
    <section className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mb-8"
      >
        <BubbleText className="text-2xl tracking-tight text-[#FFD700]/60 mb-2">{"HOW TO COMPETE"}</BubbleText>
        <p className="text-white/40 text-sm">
          Follow these steps to join the leaderboard competition.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            className="relative p-6 rounded-2xl bg-[#111111] border border-white/[0.08] hover:border-white/15 transition-all duration-300 group overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"
              style={{ backgroundColor: step.color }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${step.color}15`,
                    color: step.color,
                    border: `1px solid ${step.color}25`,
                  }}
                >
                  {step.icon}
                </div>
                <span
                  className="text-3xl font-black opacity-20"
                  style={{ color: step.color }}
                >
                  {step.number}
                </span>
              </div>
              <h3
                className="font-black text-sm tracking-widest mb-2"
                style={{ color: step.color }}
              >
                {step.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {step.description.replace(/&apos;/g, "'")}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-center mt-8"
      >
        <Link
          href="/points-shop"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00ff87] text-black font-black text-sm tracking-widest hover:bg-[#00e676] transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,135,0.4)]"
        >
          EXPLORE BONUSES
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}

function LeaderboardSection() {
  // Empty state — no active leaderboard
  const isActive = false;
  const mockEntries: never[] = [];

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            CURRENT STANDINGS
          </h2>
          <p className="text-white/40 text-sm mt-1">
            Updated in real-time during active competitions.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <span className="text-white/40 text-xs font-bold tracking-wider">INACTIVE</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <LeaderboardTable entries={mockEntries} isActive={isActive} />
      </motion.div>

      {/* Prize info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { rank: "1ST PLACE", prize: "TBA", color: "#FFD700", icon: <Crown size={24} className="text-[#FFD700]" /> },
          { rank: "2ND PLACE", prize: "TBA", color: "#C0C0C0", icon: <Medal size={24} className="text-[#C0C0C0]" /> },
          { rank: "3RD PLACE", prize: "TBA", color: "#CD7F32", icon: <Medal size={24} className="text-[#CD7F32]" /> },
        ].map((prize) => (
          <div
            key={prize.rank}
            className="p-4 rounded-xl bg-[#111111] border border-white/[0.06] flex items-center gap-4"
            style={{ borderColor: `${prize.color}20` }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${prize.color}15` }}>
              {prize.icon}
            </div>
            <div>
              <div
                className="text-xs font-black tracking-widest"
                style={{ color: prize.color }}
              >
                {prize.rank}
              </div>
              <div className="text-white/60 font-bold text-sm mt-0.5">{prize.prize}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <PageHeader />
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-20">
        <HowToCompete />
        <LeaderboardSection />
      </div>
    </div>
  );
}

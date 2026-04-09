"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Flame, ArrowRight, HelpCircle, TrendingUp, Target, Clock } from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";
import EmptyState from "@/components/EmptyState";

function PageHeader() {
  return (
    <div className="relative py-12 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,191,36,0.1)_0%,transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,191,36,1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,1) 1px, transparent 1px)",
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 mb-4">
            <Flame size={12} className="text-[#fbbf24]" />
            <span className="text-[#fbbf24] text-xs font-bold tracking-widest">
              PREDICT &amp; WIN
            </span>
          </div>
          <BubbleText className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4 text-[#fbbf24]/60">{"BONUS HUNTS"}</BubbleText>
          <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto">
            Guess the balance, win prizes! Test your prediction skills on our epic bonus hunts.
          </p>
          <div className="flex justify-center mt-6">
            <Link
              href="/points-shop"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fbbf24] text-black font-black text-sm tracking-widest hover:bg-[#f59e0b] transition-all duration-200"
            >
              EXPLORE REWARDS
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: <Target size={22} />,
      title: "HUNT STARTS",
      description:
        "AUSlots opens bonus buys across multiple slot games. The starting balance is shown before the hunts begin.",
      color: "#fbbf24",
    },
    {
      icon: <TrendingUp size={22} />,
      title: "MAKE YOUR PREDICTION",
      description:
        "Predict the final balance when all bonuses are completed. Get as close as possible to win.",
      color: "#00ff87",
    },
    {
      icon: <Clock size={22} />,
      title: "WATCH LIVE",
      description:
        "Tune in as the bonuses play out one by one. The tension builds until the very last spin.",
      color: "#60a5fa",
    },
    {
      icon: <Flame size={22} />,
      title: "CLAIM PRIZE",
      description:
        "The closest prediction wins! Prizes are awarded directly through the platform to the winner.",
      color: "#f87171",
    },
  ];

  return (
    <section className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-2 mb-6"
      >
        <HelpCircle size={18} className="text-[#fbbf24]" />
        <h2 className="text-xl font-black text-white tracking-tight">
          HOW BONUS HUNTS WORK
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
            className="relative p-5 rounded-2xl bg-[#111111] border border-white/[0.08] hover:border-white/15 transition-all duration-300 group overflow-hidden"
          >
            <div
              className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: step.color }}
            />
            <div className="relative z-10">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{
                  backgroundColor: `${step.color}15`,
                  color: step.color,
                  border: `1px solid ${step.color}20`,
                }}
              >
                {step.icon}
              </div>
              <div
                className="absolute top-4 right-4 text-4xl font-black opacity-10"
                style={{ color: step.color }}
              >
                {index + 1}
              </div>
              <h3
                className="font-black text-xs tracking-widest mb-2"
                style={{ color: step.color }}
              >
                {step.title}
              </h3>
              <p className="text-white/40 text-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HuntsGrid() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            ACTIVE HUNTS
          </h2>
          <p className="text-white/40 text-sm mt-1">
            Submit your prediction before the hunt closes
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <EmptyState
          icon={<Flame size={48} />}
          title="No active hunts right now"
          description="The next bonus hunt hasn't started yet. Watch the stream and you'll be notified when a new hunt begins!"
          action={{
            label: "WATCH LIVE",
            href: "https://kick.com/auslots",
          }}
        />
      </motion.div>

      {/* Past hunts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-12"
      >
        <h2 className="text-xl font-black text-white tracking-tight mb-6">
          HUNT HISTORY
        </h2>

        <div className="p-8 rounded-2xl bg-[#111111] border border-white/[0.06] text-center">
          <div className="flex items-center justify-center">
            <Flame size={40} className="text-[#fbbf24]/30" />
          </div>
          <p className="text-white/40 text-sm mt-3">
            No completed hunts yet — history will appear here.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export default function BonusHuntPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <PageHeader />
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-20">
        <HowItWorks />
        <HuntsGrid />
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Ticket, Info, Clock, Gift, Monitor, MessageCircle, Target, Trophy } from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";
import EmptyState from "@/components/EmptyState";
import PointsBalance from "@/components/PointsBalance";

function PageHeader() {
  return (
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
            <span className="text-[#a78bfa] text-xs font-bold tracking-widest">
              WIN BIG
            </span>
          </div>
          <BubbleText className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4 text-[#a78bfa]/60">{"RAFFLES"}</BubbleText>
          <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto">
            Enter for a chance to win big! Use your points to buy raffle tickets.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function HowToEnter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-10 p-6 rounded-2xl bg-[#111111] border border-[#a78bfa]/15"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#a78bfa]/10 border border-[#a78bfa]/20 flex items-center justify-center flex-shrink-0">
          <Info size={16} className="text-[#a78bfa]" />
        </div>
        <div>
          <h3 className="text-white font-bold mb-2 tracking-wider">NEED POINTS?</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Follow the Kick channel, win in giveaways, and be active in streams to earn points for raffle entry.
            The more points you have, the more tickets you can buy — increasing your chances of winning!
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-white/[0.06]">
        {[
          { icon: <Monitor size={18} className="text-[#00ff87]" />, title: "Watch Streams", value: "+10 pts / 10min" },
          { icon: <MessageCircle size={18} className="text-[#60a5fa]" />, title: "Chat Activity", value: "+5 pts / message" },
          { icon: <Target size={18} className="text-[#a78bfa]" />, title: "Win Giveaways", value: "+500 pts" },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <div>
              <div className="text-white font-semibold text-sm">{item.title}</div>
              <div className="text-[#a78bfa] text-xs font-bold">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function PastWinners() {
  const winners: { username: string; prize: string; date: string }[] = [];

  return (
    <section className="mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Gift size={18} className="text-[#a78bfa]" />
          <h2 className="text-xl font-black text-white tracking-tight">
            PAST WINNERS
          </h2>
        </div>

        {winners.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#111111] border border-white/[0.06] text-center">
            <div className="flex items-center justify-center mb-3">
              <Trophy size={40} className="text-[#a78bfa]/30" />
            </div>
            <p className="text-white/40 text-sm">
              No past winners yet — be the first to win a raffle!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {winners.map((winner, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-[#111111] border border-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#a78bfa]/20 flex items-center justify-center text-sm font-black text-[#a78bfa]">
                    {winner.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{winner.username}</div>
                    <div className="text-white/40 text-xs">{winner.prize}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-white/30 text-xs">
                  <Clock size={12} />
                  {winner.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}

export default function RafflesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <PageHeader />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-20">
        {/* Balance row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-white mb-1">Active Raffles</h2>
            <p className="text-white/40 text-sm">
              Use your points to enter. More tickets = better odds!
            </p>
          </div>
          <PointsBalance size="md" />
        </div>

        <HowToEnter />

        {/* Active raffles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <EmptyState
            icon={<Ticket size={48} />}
            title="No active raffles right now"
            description="Check back soon — new raffles are added regularly. Follow our socials to get notified when new raffles go live!"
            action={{
              label: "FOLLOW ON KICK",
              href: "https://kick.com/auslots",
            }}
          />
        </motion.div>

        <PastWinners />
      </div>
    </div>
  );
}

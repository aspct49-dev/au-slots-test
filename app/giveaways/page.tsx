"use client";

import { motion } from "framer-motion";
import { Gift, Bell, Trophy, Users } from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";
import EmptyState from "@/components/EmptyState";

function PageHeader() {
  return (
    <div className="relative py-12 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(248,113,113,0.1)_0%,transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(248,113,113,1) 1px, transparent 1px), linear-gradient(90deg, rgba(248,113,113,1) 1px, transparent 1px)",
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f87171]/10 border border-[#f87171]/20 mb-4">
            <Gift size={12} className="text-[#f87171]" />
            <span className="text-[#f87171] text-xs font-bold tracking-widest">
              FREE TO ENTER
            </span>
          </div>
          <BubbleText className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4 text-[#f87171]/60">{"GIVEAWAYS"}</BubbleText>
          <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto">
            Regular giveaways for our amazing community. Follow, watch, and win!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function HowToEnter() {
  const ways = [
    {
      icon: <Bell size={20} />,
      title: "FOLLOW & NOTIFY",
      description: "Follow AUSlots on Kick and enable notifications to know instantly when giveaways go live.",
      color: "#f87171",
    },
    {
      icon: <Users size={20} />,
      title: "JOIN DISCORD",
      description: "Our Discord community members get early access and exclusive giveaway opportunities.",
      color: "#5865f2",
    },
    {
      icon: <Trophy size={20} />,
      title: "WATCH & CHAT",
      description: "Many giveaways are announced live — you have to be in chat to enter and win.",
      color: "#00ff87",
    },
  ];

  return (
    <section className="mb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {ways.map((way, index) => (
          <motion.div
            key={way.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            className="relative p-5 rounded-2xl bg-[#111111] border border-white/[0.08] hover:border-white/15 transition-all duration-300 group overflow-hidden"
          >
            <div
              className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: way.color }}
            />
            <div className="relative z-10">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{
                  backgroundColor: `${way.color}15`,
                  color: way.color,
                  border: `1px solid ${way.color}20`,
                }}
              >
                {way.icon}
              </div>
              <h3
                className="font-black text-xs tracking-widest mb-2"
                style={{ color: way.color }}
              >
                {way.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">{way.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function ActiveGiveaways() {
  return (
    <section className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            ACTIVE GIVEAWAYS
          </h2>
          <p className="text-white/40 text-sm mt-1">
            Enter now for a chance to win
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <span className="text-white/40 text-xs font-bold tracking-wider">0 ACTIVE</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <EmptyState
          icon={<Gift size={48} />}
          title="No active giveaways right now"
          description="Check back soon! Follow our socials to be the first to know when new giveaways are announced."
          action={{
            label: "JOIN DISCORD",
            href: "https://discord.gg/auslots",
          }}
        />
      </motion.div>
    </section>
  );
}

function PastGiveaways() {
  const pastWinners: { username: string; prize: string; date: string; platform: string }[] = [];

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-black text-white tracking-tight mb-6">
          PAST WINNERS
        </h2>

        {pastWinners.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#111111] border border-white/[0.06] text-center">
            <div className="flex items-center justify-center">
              <Gift size={40} className="text-[#f87171]/30" />
            </div>
            <p className="text-white/40 text-sm mt-3">
              No past giveaway winners yet — be the first!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pastWinners.map((winner, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-[#111111] border border-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f87171]/20 flex items-center justify-center text-sm font-black text-[#f87171]">
                    {winner.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{winner.username}</div>
                    <div className="text-white/40 text-xs">{winner.prize}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/30 text-xs">{winner.date}</div>
                  <div className="text-white/20 text-xs">{winner.platform}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}

export default function GiveawaysPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <PageHeader />
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-20">
        <HowToEnter />
        <ActiveGiveaways />
        <PastGiveaways />
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Coins, Info, ShoppingBag, Monitor, MessageCircle, Target, PartyPopper } from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";
import RewardCard from "@/components/RewardCard";
import PointsBalance from "@/components/PointsBalance";
import Particles from "@/components/Particles";

const rewardItems = [
  {
    id: "1",
    gameName: "Crazy Ex Girlfriend",
    provider: "Nolimit City",
    spinCount: 50,
    pointCost: 3000,
    inventory: 87,
    maxInventory: 100,
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #c0392b 50%, #8b0000 100%)",
    providerColor: "#ff6b6b",
    imageUrl: "/images/crazy-ex-girlfriend.png",
  },
  {
    id: "2",
    gameName: "Chaos Crew 3",
    provider: "Hacksaw",
    spinCount: 50,
    pointCost: 3000,
    inventory: 91,
    maxInventory: 100,
    gradient: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #4c1d95 100%)",
    providerColor: "#a78bfa",
    imageUrl: "/images/chaos-crew-3.png",
  },
  {
    id: "3",
    gameName: "Sweet Bonanza 1000",
    provider: "Pragmatic Play",
    spinCount: 100,
    pointCost: 3875,
    inventory: 45,
    maxInventory: 100,
    gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #d97706 100%)",
    providerColor: "#fbbf24",
    imageUrl: "/images/sweet-bonanza-1000.png",
  },
  {
    id: "4",
    gameName: "Gates of Olympus 1000",
    provider: "Pragmatic Play",
    spinCount: 100,
    pointCost: 3875,
    inventory: 62,
    maxInventory: 100,
    gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 40%, #1d4ed8 100%)",
    providerColor: "#60a5fa",
    imageUrl: "/images/gates-of-olympus-1000.png",
  },
  {
    id: "5",
    gameName: "Wanted Dead or Wild",
    provider: "Hacksaw",
    spinCount: 75,
    pointCost: 4500,
    inventory: 18,
    maxInventory: 50,
    gradient: "linear-gradient(135deg, #d4a574 0%, #a0522d 50%, #5c3317 100%)",
    providerColor: "#d4a574",
    imageUrl: "/images/wanted-dead-or-wild.png",
  },
  {
    id: "6",
    gameName: "Sugar Rush 1000",
    provider: "Pragmatic Play",
    spinCount: 50,
    pointCost: 2500,
    inventory: 33,
    maxInventory: 100,
    gradient: "linear-gradient(135deg, #f472b6 0%, #db2777 50%, #9d174d 100%)",
    providerColor: "#f472b6",
    imageUrl: "/images/sugar-rush-1000.png",
  },
  {
    id: "7",
    gameName: "RIP City",
    provider: "Hacksaw",
    spinCount: 25,
    pointCost: 2000,
    inventory: 75,
    maxInventory: 100,
    gradient: "linear-gradient(135deg, #fb923c 0%, #ea580c 50%, #9a3412 100%)",
    providerColor: "#fb923c",
    imageUrl: "/images/rip-city.png",
  },
  {
    id: "8",
    gameName: "Starlight Princess 1000",
    provider: "Pragmatic Play",
    spinCount: 100,
    pointCost: 3875,
    inventory: 55,
    maxInventory: 100,
    gradient: "linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #581c87 100%)",
    providerColor: "#c084fc",
    imageUrl: "/images/starlight-princess-1000.png",
  },
];

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

export default function PointsShopPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <PageHeader />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-20">
        {/* Balance + Info row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-white mb-1">Available Rewards</h2>
            <p className="text-white/40 text-sm">
              {rewardItems.length} items available — Inventory refreshed weekly
            </p>
          </div>
          <PointsBalance size="md" />
        </div>

        <HowToEarn />

        {/* Rewards grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {rewardItems.map((item, index) => (
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

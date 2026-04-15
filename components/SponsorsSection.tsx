"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Star, Zap, Shield, Gift, CreditCard, Gamepad2 } from "lucide-react";

const sponsors = [
  {
    name: "Zesty.Bet",
    logo: "/images/zesty.bet_new_logo_modern.webp",
    url: "https://zesty.bet",
    tagline: "Fresh. Fast. Rewarding.",
    accentColor: "#4ade80",
    glowColor: "rgba(74,222,128,0.15)",
    borderColor: "rgba(74,222,128,0.2)",
    description:
      "Zesty.Bet is a next-generation online casino built for players who expect more. With a massive library of slots, live dealer games, and table games from top providers, Zesty.Bet delivers a premium experience with crypto-friendly banking, fast withdrawals, and generous ongoing promotions.",
    features: [
      { icon: Gamepad2,  label: "Thousands of slots & live games" },
      { icon: CreditCard, label: "Crypto & fiat payment options" },
      { icon: Gift,      label: "Generous welcome bonuses" },
      { icon: Zap,       label: "Lightning-fast withdrawals" },
    ],
  },
  {
    name: "ViperSpin",
    logo: "/images/viperspin_logo_final.webp",
    url: "https://viperspin.com",
    tagline: "Spin Bold. Win Big.",
    accentColor: "#06b6d4",
    glowColor: "rgba(6,182,212,0.15)",
    borderColor: "rgba(6,182,212,0.2)",
    description:
      "ViperSpin is a modern online casino packed with high-volatility slots, live casino action, and exclusive VIP rewards. Known for its sleek design and player-first approach, ViperSpin offers a wide variety of games from leading providers alongside competitive bonuses and a seamless mobile experience.",
    features: [
      { icon: Star,      label: "Exclusive VIP rewards program" },
      { icon: Gamepad2,  label: "High-volatility slots & live casino" },
      { icon: Shield,    label: "Licensed & secure platform" },
      { icon: Gift,      label: "Regular reload bonuses" },
    ],
  },
];

export default function SponsorsSection() {
  return (
    <section className="py-14 sm:py-24 relative">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#4ade80]/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#06b6d4]/5 blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff87]/10 border border-[#00ff87]/20 mb-4">
            <Star size={12} className="text-[#00ff87]" />
            <span className="text-[#00ff87] text-xs font-bold tracking-widest">OUR SPONSORS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            CHECK OUT OUR SPONSORS
          </h2>
          <p className="text-white/40 text-base max-w-lg mx-auto leading-relaxed">
            These platforms support AUSlots and help make our giveaways, raffles, and rewards possible.
            Play responsibly. 18+ only.
          </p>
        </motion.div>

        {/* Sponsor cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {sponsors.map((sponsor, i) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col h-full rounded-2xl bg-[#111111] border overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderColor: sponsor.borderColor,
                  boxShadow: `0 0 0 0 ${sponsor.glowColor}`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 40px ${sponsor.glowColor}`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 0 0 ${sponsor.glowColor}`;
                }}
              >
                {/* Top glow strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${sponsor.accentColor}, transparent)` }}
                />

                {/* Logo area */}
                <div
                  className="relative flex items-center justify-center py-10 px-8 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${sponsor.glowColor}, transparent 60%)` }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${sponsor.glowColor}, transparent 70%)` }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={220}
                      height={80}
                      className="object-contain max-h-[80px] drop-shadow-lg"
                    />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 pt-0">
                  {/* Tagline */}
                  <p
                    className="text-sm font-bold mb-3 tracking-wide"
                    style={{ color: sponsor.accentColor }}
                  >
                    {sponsor.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-white/55 text-sm leading-relaxed mb-5">
                    {sponsor.description}
                  </p>

                  {/* Feature pills */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {sponsor.features.map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
                        style={{
                          backgroundColor: `${sponsor.accentColor}10`,
                          color: `${sponsor.accentColor}cc`,
                          border: `1px solid ${sponsor.accentColor}20`,
                        }}
                      >
                        <Icon size={12} className="flex-shrink-0" />
                        <span className="leading-tight">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <div
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm tracking-widest transition-all duration-200 group-hover:brightness-110"
                      style={{
                        backgroundColor: `${sponsor.accentColor}18`,
                        color: sponsor.accentColor,
                        border: `1px solid ${sponsor.accentColor}30`,
                      }}
                    >
                      VISIT {sponsor.name.toUpperCase()}
                      <ExternalLink size={13} />
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-white/20 text-xs mt-8 max-w-xl mx-auto"
        >
          Sponsored content. Gambling can be addictive — please play responsibly. Must be 18+ to participate.
        </motion.p>
      </div>
    </section>
  );
}

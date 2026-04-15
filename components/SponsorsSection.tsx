"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Star, Zap, Shield, Gift, CreditCard, Gamepad2 } from "lucide-react";

const sponsors = [
  {
    name: "Zesty.Bet",
    logo: "/images/zesty.bet_new_logo_modern.webp",
    url: "https://zesty.bet",
    accentColor: "#4ade80",
    glowColor: "rgba(74,222,128,0.12)",
    borderColor: "rgba(74,222,128,0.18)",
    description:
      "Zesty.Bet is a next-generation online casino built for players who expect more — a massive library of slots, live dealer tables, and crypto-friendly banking with fast withdrawals.",
    features: [
      { icon: Gamepad2,   label: "Slots & live dealer games" },
      { icon: CreditCard, label: "Crypto & fiat payments" },
      { icon: Gift,       label: "Generous welcome bonuses" },
      { icon: Zap,        label: "Lightning-fast withdrawals" },
    ],
  },
  {
    name: "ViperSpin",
    logo: "/images/viperspin_logo_final.webp",
    url: "https://viperspin.com",
    accentColor: "#06b6d4",
    glowColor: "rgba(6,182,212,0.12)",
    borderColor: "rgba(6,182,212,0.18)",
    description:
      "ViperSpin is a modern casino packed with high-volatility slots, live casino action, and exclusive VIP rewards — designed for players who want a premium, player-first experience.",
    features: [
      { icon: Star,      label: "Exclusive VIP rewards" },
      { icon: Gamepad2,  label: "High-volatility slots" },
      { icon: Shield,    label: "Licensed & secure" },
      { icon: Gift,      label: "Regular reload bonuses" },
    ],
  },
];

export default function SponsorsSection() {
  return (
    <section className="py-14 sm:py-24 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#4ade80]/4 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#06b6d4]/4 blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff87]/10 border border-[#00ff87]/20 mb-5">
            <Star size={12} className="text-[#00ff87]" />
            <span className="text-[#00ff87] text-xs font-bold tracking-widest">OUR SPONSORS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            CHECK OUT OUR SPONSORS
          </h2>
          <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            These platforms support AUSlots and make our rewards possible.
            Play responsibly — 18+ only.
          </p>
        </motion.div>

        {/* Sponsor cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {sponsors.map((sponsor, i) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="h-full"
            >
              <a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col h-full rounded-2xl bg-[#111111] border overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ borderColor: sponsor.borderColor }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 40px ${sponsor.glowColor}`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${sponsor.accentColor}80, transparent)` }}
                />

                {/* Logo area */}
                <div
                  className="flex items-center justify-center px-10 py-12"
                  style={{ background: `linear-gradient(160deg, ${sponsor.glowColor} 0%, transparent 70%)` }}
                >
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={200}
                    height={72}
                    className="object-contain max-h-[72px] drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Divider */}
                <div className="mx-6 h-px bg-white/[0.06]" />

                {/* Content */}
                <div className="flex flex-col flex-1 px-6 py-6 gap-5">
                  {/* Description */}
                  <p className="text-white/50 text-sm leading-[1.7]">
                    {sponsor.description}
                  </p>

                  {/* Feature pills */}
                  <div className="grid grid-cols-2 gap-2">
                    {sponsor.features.map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold"
                        style={{
                          backgroundColor: `${sponsor.accentColor}0d`,
                          color: `${sponsor.accentColor}b3`,
                          border: `1px solid ${sponsor.accentColor}1a`,
                        }}
                      >
                        <Icon size={12} className="flex-shrink-0" style={{ color: sponsor.accentColor }} />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-1">
                    <div
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-xs tracking-widest transition-all duration-200 group-hover:brightness-110"
                      style={{
                        backgroundColor: `${sponsor.accentColor}15`,
                        color: sponsor.accentColor,
                        border: `1px solid ${sponsor.accentColor}25`,
                      }}
                    >
                      VISIT {sponsor.name.toUpperCase()}
                      <ExternalLink size={12} />
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
          className="text-center text-white/20 text-xs mt-10 max-w-md mx-auto"
        >
          Sponsored content. Gambling can be addictive — please play responsibly. Must be 18+.
        </motion.p>
      </div>
    </section>
  );
}

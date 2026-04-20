"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Coins,
  Gift,
  Zap,
  Ticket,
  ArrowRight,
  Star,
  Monitor,
  Wallet,
  Award,
  ChevronDown,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import { BubbleText } from "@/components/ui/bubble-text";
import StreamSchedule from "@/components/StreamSchedule";
import SocialLinks from "@/components/SocialLinks";
import SponsorsSection from "@/components/SponsorsSection";

const features = [
  {
    icon: <Coins size={28} />,
    title: "POINTS",
    description:
      "Earn points just by watching the stream. The longer you watch, the more you earn. Redeem them in the Points Shop.",
    color: "#00ff87",
    href: "/points-shop",
    gradient: "from-[#00ff87]/10 to-transparent",
  },
  {
    icon: <Ticket size={28} />,
    title: "RAFFLES",
    description:
      "Use your hard-earned points to enter exclusive raffles. Win cash, bonuses, merchandise and more.",
    color: "#a78bfa",
    href: "/raffles",
    gradient: "from-[#a78bfa]/10 to-transparent",
  },
  {
    icon: <Gift size={28} />,
    title: "THE VAULT",
    description:
      "Watch the vault fill up after every stream. When it hits max — something big drops for the community.",
    color: "#fbbf24",
    href: "/vault",
    gradient: "from-[#fbbf24]/10 to-transparent",
  },
  {
    icon: <Zap size={28} />,
    title: "BONUS HUNTS",
    description:
      "Guess the final balance of bonus hunts to win prizes. Watch live and put your predictions to the test.",
    color: "#60a5fa",
    href: "/bonus-hunt",
    gradient: "from-[#60a5fa]/10 to-transparent",
  },
];

function FeaturesSection() {
  return (
    <section className="py-14 sm:py-24 relative">
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
            <span className="text-[#00ff87] text-xs font-bold tracking-widest">
              PLATFORM FEATURES
            </span>
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            EVERYTHING YOU NEED
            <BubbleText className="text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#00ff87]/60">{"TO WIN BIG"}</BubbleText>
          </div>
          <p className="text-white/50 text-base max-w-lg mx-auto leading-relaxed">
            The AUSlotsRewards platform is packed with ways to earn, compete,
            and win. All for free — just tune in.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                href={feature.href}
                className="group relative flex flex-col h-full p-6 rounded-2xl bg-[#111111] border border-white/[0.08] hover:border-white/20 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden"
              >
                {/* Gradient top corner */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl bg-gradient-to-bl ${feature.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Icon */}
                <div
                  className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200"
                  style={{
                    backgroundColor: `${feature.color}15`,
                    color: feature.color,
                    border: `1px solid ${feature.color}25`,
                  }}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3
                  className="relative z-10 text-lg font-black tracking-tight mb-2 transition-colors duration-200"
                  style={{ color: feature.color }}
                >
                  {feature.title}
                </h3>
                <p className="relative z-10 text-white/50 text-sm leading-relaxed flex-1">
                  {feature.description}
                </p>

                {/* Arrow */}
                <div
                  className="relative z-10 flex items-center gap-1 mt-4 text-xs font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0"
                  style={{ color: feature.color }}
                >
                  EXPLORE
                  <ArrowRight size={12} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "WATCH THE STREAM",
      description:
        "Tune into AUSlots live on Kick. Points are automatically added to your account while you watch.",
      icon: <Monitor size={24} className="text-[#00ff87]" />,
    },
    {
      step: "02",
      title: "EARN POINTS",
      description:
        "The longer you watch and the more active you are in chat, the more points you rack up.",
      icon: <Wallet size={24} className="text-[#fbbf24]" />,
    },
    {
      step: "03",
      title: "REDEEM REWARDS",
      description:
        "Spend your points in our shop, enter raffles, or join giveaways to win amazing prizes.",
      icon: <Award size={24} className="text-[#a78bfa]" />,
    },
  ];

  return (
    <section className="py-14 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <BubbleText className="text-3xl sm:text-4xl tracking-tight text-[#00ff87]/60 mb-3">{"HOW IT WORKS"}</BubbleText>
          <p className="text-white/40 text-sm">Simple, free, and rewarding.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 relative">


          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-[#111111] border border-white/[0.08] hover:border-[#00ff87]/30 hover:bg-[#00ff87]/[0.03] transition-all duration-300"
            >
              <div className="relative w-16 h-16 rounded-2xl bg-[#00ff87]/10 border border-[#00ff87]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                {step.icon}
                <span className="absolute -top-2 -right-2 text-[10px] font-black bg-[#00ff87] text-black w-5 h-5 rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <div className="text-xs font-black text-[#00ff87]/50 tracking-widest mb-2">
                STEP {step.step}
              </div>
              <h3 className="text-white font-black text-base tracking-tight mb-2">
                {step.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="https://kick.com/auslots"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#00ff87] text-black font-black text-sm tracking-widest hover:bg-[#00e676] transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,255,135,0.4)]"
          >
            <div className="relative w-2 h-2">
              <div className="w-2 h-2 rounded-full bg-black" />
              <div className="absolute inset-0 rounded-full bg-black animate-ping opacity-50" />
            </div>
            WATCH AUSLOTS LIVE
          </a>
        </motion.div>
      </div>
    </section>
  );
}

const videos = [
  {
    title: "HOW TO DEPOSIT",
    href: "https://www.youtube.com/watch?v=gbZ1R7Ru3G0",
    thumbnail: "https://img.youtube.com/vi/gbZ1R7Ru3G0/maxresdefault.jpg",
  },
  {
    title: "HOW TO WITHDRAW",
    href: "https://www.youtube.com/watch?v=TgdfXKQ5PQw",
    thumbnail: "https://img.youtube.com/vi/TgdfXKQ5PQw/maxresdefault.jpg",
  },
];

function VideoTutorialsSection() {
  return (
    <section className="py-14 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="text-white/60 text-xs font-bold tracking-widest">• VIDEO TUTORIALS •</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {videos.map((video, i) => (
            <motion.a
              key={video.title}
              href={video.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#00ff87]/30 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-[#111111] overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-40 blur-sm group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                {/* Play icon + title */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00ff87]/20 border border-[#00ff87]/40 flex items-center justify-center group-hover:bg-[#00ff87]/30 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#00ff87">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                    <span className="text-[#00ff87] font-black text-sm tracking-widest drop-shadow-[0_0_8px_rgba(0,255,135,0.8)]">
                      {video.title}
                    </span>
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d0d]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-white/40 text-xs font-bold tracking-widest">YOUTUBE</span>
                </div>
                <span className="text-white/30 text-xs font-bold tracking-widest group-hover:text-[#00ff87] transition-colors">
                  WATCH →
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: "You cancelled the Kick login.",
  missing_params: "Login failed: missing parameters from Kick.",
  invalid_state: "Login failed: session mismatch (try again).",
  missing_verifier: "Login failed: PKCE verifier missing (try again).",
  server_error: "Login failed: server error. Check console for details.",
};

function AuthErrorBanner() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("auth_error");
  const detail = searchParams.get("detail");

  if (!authError) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] max-w-lg w-full px-4">
      <div className="bg-red-900/90 border border-red-500/50 rounded-xl px-5 py-4 text-sm text-red-200 shadow-xl backdrop-blur-sm">
        <span className="font-bold text-red-400 mr-2">Login Error:</span>
        {AUTH_ERROR_MESSAGES[authError] ?? authError}
        {detail && (
          <div className="mt-1 text-xs text-red-300/70 break-all">{decodeURIComponent(detail)}</div>
        )}
      </div>
    </div>
  );
}

function HelpSection() {
  const [open, setOpen] = useState<number | null>(null);
  const [nordvpnText, setNordvpnText] = useState<string>("");

  useEffect(() => {
    fetch("/api/help").then(r => r.json()).then(d => setNordvpnText(d.text ?? "")).catch(() => {});
  }, []);

  const items = [
    {
      title: "How to Deposit",
      icon: "💰",
      type: "link" as const,
      href: "https://www.youtube.com/watch?v=gbZ1R7Ru3G0",
      label: "Watch on YouTube",
    },
    {
      title: "How to Withdraw",
      icon: "🏦",
      type: "link" as const,
      href: "https://www.youtube.com/watch?v=TgdfXKQ5PQw",
      label: "Watch on YouTube",
    },
    {
      title: "NordVPN: How to access certain websites",
      icon: "🔒",
      type: "text" as const,
      content: nordvpnText,
    },
  ];

  return (
    <section className="py-14 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <HelpCircle size={12} className="text-white/60" />
            <span className="text-white/60 text-xs font-bold tracking-widest">HELP & GUIDES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Need help?</h2>
          <p className="text-white/40 text-sm mt-2">Everything you need to get started.</p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-white/[0.08] bg-[#111111] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-bold text-sm text-white/80 group-hover:text-white transition-colors tracking-wide">
                    {item.title}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-white/30 transition-transform duration-300 ${open === i ? "rotate-180 text-[#00ff87]" : ""}`}
                />
              </button>

              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-1 border-t border-white/[0.06]">
                  {item.type === "link" ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00ff87]/10 border border-[#00ff87]/20 text-[#00ff87] text-sm font-bold hover:bg-[#00ff87]/20 transition-all"
                    >
                      <ExternalLink size={13} />
                      {item.label}
                    </a>
                  ) : (
                    <p className="text-white/50 text-sm leading-relaxed whitespace-pre-wrap">
                      {item.content || "No content added yet. Check back soon!"}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <Suspense>
        <AuthErrorBanner />
      </Suspense>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SponsorsSection />
      <StreamSchedule />
      <VideoTutorialsSection />
      <HelpSection />
      <SocialLinks />
    </div>
  );
}

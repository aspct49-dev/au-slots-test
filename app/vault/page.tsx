"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BubbleText } from "@/components/ui/bubble-text";

interface Vault {
  currentAmount: number;
  maxAmount: number;
  updatedAt: number;
}

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${hours}h ago`;
}

export default function VaultPage() {
  const [vault, setVault] = useState<Vault | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/vault");
      if (res.ok) setVault(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(load, 30_000);
    return () => clearInterval(iv);
  }, [load]);

  const pct = vault ? Math.min(100, (vault.currentAmount / vault.maxAmount) * 100) : 0;
  const isFull = pct >= 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="relative py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,191,36,0.12)_0%,transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(rgba(251,191,36,1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 mb-4">
              <span className="text-[#fbbf24] text-xs font-bold tracking-widest">💰 COMMUNITY VAULT</span>
            </div>
            <BubbleText className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4 text-[#fbbf24]/60">
              {"THE VAULT"}
            </BubbleText>
            <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto">
              Watch the vault fill up after every stream. When it hits max — something big drops.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 lg:px-8 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#fbbf24]/30 border-t-[#fbbf24] rounded-full animate-spin" />
          </div>
        ) : vault ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

            {/* Vault visual */}
            <div className="relative bg-[#111111] border border-white/[0.08] rounded-3xl overflow-hidden p-8">
              {/* Glow */}
              <div
                className="absolute inset-0 transition-opacity duration-1000"
                style={{
                  background: `radial-gradient(ellipse at 50% 100%, rgba(251,191,36,${isFull ? 0.25 : pct / 600}) 0%, transparent 70%)`,
                }}
              />

              {/* Vault container */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Vault body */}
                <div className="relative w-56 h-72 sm:w-64 sm:h-80">
                  {/* Vault outline */}
                  <div
                    className="absolute inset-0 rounded-2xl border-4 overflow-hidden"
                    style={{ borderColor: isFull ? "#fbbf24" : "rgba(251,191,36,0.3)", boxShadow: isFull ? "0 0 40px rgba(251,191,36,0.5), inset 0 0 40px rgba(251,191,36,0.1)" : "none" }}
                  >
                    {/* Background */}
                    <div className="absolute inset-0 bg-[#0d0d0d]" />

                    {/* Liquid fill */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0"
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{
                        background: isFull
                          ? "linear-gradient(to top, #f59e0b, #fbbf24, #fde68a)"
                          : "linear-gradient(to top, #92400e, #b45309, #d97706, #fbbf24)",
                      }}
                    >
                      {/* Wave top */}
                      <div className="absolute -top-3 left-0 right-0 h-6 overflow-hidden">
                        <motion.div
                          animate={{ x: [0, -50, 0] }}
                          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                          className="flex"
                        >
                          <svg viewBox="0 0 200 24" className="w-[200%] h-6" preserveAspectRatio="none">
                            <path
                              d="M0,12 C25,0 50,24 75,12 C100,0 125,24 150,12 C175,0 200,24 225,12 L225,24 L0,24 Z"
                              fill={isFull ? "#fde68a" : "#fbbf24"}
                              fillOpacity="0.8"
                            />
                          </svg>
                        </motion.div>
                      </div>

                      {/* Shine */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </motion.div>

                    {/* Dollar signs floating */}
                    {pct > 10 && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(Math.floor(pct / 20))].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute text-[#fbbf24]/30 font-black text-lg select-none"
                            style={{ left: `${15 + (i * 23) % 65}%`, bottom: `${5 + (i * 17) % (pct - 5)}%` }}
                            animate={{ y: [-4, 4, -4], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                          >
                            $
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Vault door handle */}
                  <div className="absolute -right-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
                    <div className="w-4 h-10 bg-[#1a1a1a] border-2 border-white/20 rounded-full flex flex-col items-center justify-around py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    </div>
                  </div>

                  {/* Dial */}
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2">
                    <motion.div
                      className="w-12 h-12 rounded-full border-4 bg-[#1a1a1a] flex items-center justify-center"
                      style={{ borderColor: isFull ? "#fbbf24" : "rgba(255,255,255,0.15)" }}
                      animate={{ rotate: pct * 3.6 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                      <div className="w-1.5 h-4 bg-white/40 rounded-full" />
                    </motion.div>
                  </div>
                </div>

                {/* Percentage badge */}
                <motion.div
                  className="mt-6 px-6 py-3 rounded-2xl font-black text-3xl"
                  style={{
                    background: isFull ? "rgba(251,191,36,0.2)" : "rgba(251,191,36,0.08)",
                    border: `2px solid ${isFull ? "rgba(251,191,36,0.6)" : "rgba(251,191,36,0.2)"}`,
                    color: "#fbbf24",
                    boxShadow: isFull ? "0 0 30px rgba(251,191,36,0.3)" : "none",
                  }}
                >
                  {pct.toFixed(1)}%
                  {isFull && <span className="ml-2 text-xl">🔓</span>}
                </motion.div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Current</p>
                <p className="text-3xl font-black text-[#fbbf24]">${vault.currentAmount.toLocaleString()}</p>
              </div>
              <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Target</p>
                <p className="text-3xl font-black text-white">${vault.maxAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex justify-between text-xs font-bold text-white/40 mb-3">
                <span>$0</span>
                <span>${vault.maxAmount.toLocaleString()}</span>
              </div>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{
                    background: isFull
                      ? "linear-gradient(to right, #f59e0b, #fbbf24, #fde68a)"
                      : "linear-gradient(to right, #92400e, #fbbf24)",
                    boxShadow: isFull ? "0 0 12px rgba(251,191,36,0.6)" : "none",
                  }}
                />
              </div>
              <p className="text-white/20 text-xs mt-3 text-right">
                Last updated {timeAgo(vault.updatedAt)}
              </p>
            </div>

            {isFull && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#fbbf24]/10 border border-[#fbbf24]/40 rounded-2xl p-6 text-center"
                style={{ boxShadow: "0 0 40px rgba(251,191,36,0.2)" }}
              >
                <p className="text-4xl mb-2">🔓</p>
                <p className="text-[#fbbf24] font-black text-xl">VAULT IS FULL!</p>
                <p className="text-white/50 text-sm mt-1">Something big is coming. Stay tuned on stream!</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-20 text-white/20">
            <p className="font-bold">Vault data unavailable</p>
          </div>
        )}
      </div>
    </div>
  );
}

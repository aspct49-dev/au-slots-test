"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Coins, Package, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface RewardCardProps {
  id: string;
  gameName: string;
  provider: string;
  spinCount: number;
  pointCost: number;
  inventory: number;
  maxInventory: number;
  gradient: string;
  providerColor: string;
  imageUrl?: string;
}

type RedeemState = "idle" | "loading" | "success" | "error";

export default function RewardCard({
  id,
  gameName,
  provider,
  spinCount,
  pointCost,
  inventory,
  maxInventory,
  gradient,
  providerColor,
  imageUrl,
}: RewardCardProps) {
  const { user, isLoggedIn, openLoginModal, setPoints } = useAuth();
  const [redeemState, setRedeemState] = useState<RedeemState>("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const inventoryPercent = (inventory / maxInventory) * 100;
  const canAfford = isLoggedIn && user ? user.points >= pointCost : false;
  const soldOut = inventory === 0;
  const isDisabled = soldOut || (isLoggedIn && !canAfford) || redeemState === "loading";

  const handleRedeem = async () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    if (!canAfford || soldOut) return;

    setRedeemState("loading");
    setFeedbackMsg("");

    try {
      const res = await fetch("/api/points/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id, itemName: gameName, pointCost }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRedeemState("error");
        setFeedbackMsg(data.error ?? "Redemption failed. Please try again.");
        setTimeout(() => setRedeemState("idle"), 3000);
        return;
      }

      // Update the points balance in context from the API response
      setPoints(data.points);
      setRedeemState("success");
      setFeedbackMsg(data.message ?? "Redeemed!");
      setTimeout(() => setRedeemState("idle"), 4000);
    } catch {
      setRedeemState("error");
      setFeedbackMsg("Network error. Please try again.");
      setTimeout(() => setRedeemState("idle"), 3000);
    }
  };

  const buttonContent = () => {
    if (!isLoggedIn) return <><Lock size={12} />LOG IN</>;
    if (soldOut) return "SOLD OUT";
    if (redeemState === "loading") return <Loader2 size={14} className="animate-spin" />;
    if (redeemState === "success") return <><CheckCircle size={12} />DONE!</>;
    if (redeemState === "error") return <><AlertCircle size={12} />FAILED</>;
    if (!canAfford) return "NOT ENOUGH";
    return "REDEEM";
  };

  const buttonClass = () => {
    const base = "flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs tracking-widest transition-all duration-200";
    if (soldOut) return `${base} bg-white/5 text-white/20 cursor-not-allowed`;
    if (!isLoggedIn) return `${base} bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/30 hover:bg-[#00ff87]/20`;
    if (redeemState === "loading") return `${base} bg-[#00ff87]/20 text-[#00ff87] cursor-wait`;
    if (redeemState === "success") return `${base} bg-emerald-500/20 text-emerald-400 cursor-default`;
    if (redeemState === "error") return `${base} bg-red-500/20 text-red-400 cursor-default`;
    if (!canAfford) return `${base} bg-white/5 text-white/30 cursor-not-allowed`;
    return `${base} bg-[#00ff87] text-black hover:bg-[#00e676] hover:shadow-[0_0_15px_rgba(0,255,135,0.3)]`;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-[#111111] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-[#00ff87]/25 hover:shadow-[0_0_30px_rgba(0,255,135,0.08)] transition-all duration-300"
    >
      {/* Game thumbnail */}
      <div
        className="relative h-40 flex items-center justify-center overflow-hidden"
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={gameName}
              width={140}
              height={175}
              className="object-contain max-h-[140px] drop-shadow-lg"
            />
          ) : (
            <h3 className="text-white font-black text-sm tracking-tight leading-tight text-center">
              {gameName}
            </h3>
          )}
        </div>
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-black tracking-wider text-black"
          style={{ backgroundColor: providerColor }}
        >
          {provider.toUpperCase()}
        </div>
        <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 text-white text-[10px] font-black tracking-wider">
          {spinCount} SPINS
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#111111] to-transparent" />
      </div>

      {/* Card body */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-white font-bold text-base leading-tight mb-1">{gameName}</h3>
          <p className="text-white/40 text-xs font-medium">{provider}</p>
        </div>

        {/* Inventory bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Package size={12} className="text-white/30" />
              <span className="text-white/40 text-xs">Inventory</span>
            </div>
            <span className="text-white/70 text-xs font-semibold">
              {soldOut ? (
                <span className="text-red-400">SOLD OUT</span>
              ) : (
                `${inventory}/${maxInventory} LEFT`
              )}
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${inventoryPercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="h-full rounded-full"
              style={{
                background:
                  inventoryPercent > 60
                    ? "linear-gradient(90deg, #00ff87, #00e676)"
                    : inventoryPercent > 30
                    ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                    : "linear-gradient(90deg, #ef4444, #dc2626)",
              }}
            />
          </div>
        </div>

        {/* Price & redeem */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Coins size={16} className="text-[#00ff87]" />
            <span className="text-[#00ff87] font-black text-lg">
              {pointCost.toLocaleString()}
            </span>
            <span className="text-white/30 text-xs font-medium">pts</span>
          </div>

          <button onClick={handleRedeem} disabled={isDisabled} className={buttonClass()}>
            {buttonContent()}
          </button>
        </div>

        {/* Inline feedback */}
        <AnimatePresence>
          {feedbackMsg && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-xs mt-3 text-right ${
                redeemState === "success" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {feedbackMsg}
            </motion.p>
          )}
          {isLoggedIn && !canAfford && !soldOut && redeemState === "idle" && !feedbackMsg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-white/30 mt-3 text-right"
            >
              Need {(pointCost - (user?.points ?? 0)).toLocaleString()} more pts
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

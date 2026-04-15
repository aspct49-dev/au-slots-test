"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Coins, Package, Lock, CheckCircle, AlertCircle, Loader2, X, Send } from "lucide-react";
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

const inputCls = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#00ff87]/40 transition-colors";
const labelCls = "block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5";

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
  const [redemptionId, setRedemptionId] = useState<string | null>(null);
  const [infoForm, setInfoForm] = useState({ viperSpinEmail: "", zestyBetInfo: "", discordUsername: "" });
  const [submittingInfo, setSubmittingInfo] = useState(false);
  const [infoSubmitted, setInfoSubmitted] = useState(false);

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
      setRedemptionId(data.redemptionId ?? null);
      setInfoSubmitted(false);
      setInfoForm({ viperSpinEmail: "", zestyBetInfo: "", discordUsername: "" });
      setRedeemState("success");
      setFeedbackMsg(data.message ?? "Redeemed!");
    } catch {
      setRedeemState("error");
      setFeedbackMsg("Network error. Please try again.");
      setTimeout(() => setRedeemState("idle"), 3000);
    }
  };

  const submitInfo = async () => {
    if (!redemptionId) { setInfoSubmitted(true); return; }
    setSubmittingInfo(true);
    try {
      await fetch("/api/points/redeem/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redemptionId, ...infoForm }),
      });
    } catch { /* silently proceed */ }
    setSubmittingInfo(false);
    setInfoSubmitted(true);
  };

  const closeModal = () => {
    setRedeemState("idle");
    setInfoSubmitted(false);
    setRedemptionId(null);
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
    <>
      {/* Redemption info modal */}
      <AnimatePresence>
        {redeemState === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#111111] border border-[#00ff87]/30 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_40px_rgba(0,255,135,0.15)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#00ff87]/15 border border-[#00ff87]/30 flex items-center justify-center">
                  <CheckCircle size={24} className="text-[#00ff87]" />
                </div>
                {infoSubmitted && (
                  <button onClick={closeModal} className="text-white/30 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>

              <h3 className="text-white font-black text-lg mb-1">Redemption Confirmed!</h3>
              <p className="text-[#00ff87] font-semibold text-sm mb-5">
                {spinCount > 0 ? `${spinCount} free spins on ${gameName}` : gameName}
              </p>

              {infoSubmitted ? (
                /* Thank-you state */
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-[#00ff87]/10 border border-[#00ff87]/20 flex items-center justify-center mx-auto mb-4">
                    <Send size={22} className="text-[#00ff87]" />
                  </div>
                  <p className="text-white font-black text-base mb-1">You&apos;re all set!</p>
                  <p className="text-[#00ff87] font-semibold text-sm">Your reward will be with you shortly!</p>
                  <button
                    onClick={closeModal}
                    className="mt-5 w-full py-2.5 bg-[#00ff87] hover:bg-[#00e676] text-black font-black text-sm rounded-xl transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* Info collection form */
                <>
                  <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl px-4 py-3 mb-5">
                    <p className="text-white/50 text-xs leading-relaxed">
                      To deliver your reward, please provide your account details below. Fill in only what applies to your item.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>ViperSpin Email</label>
                      <input
                        className={inputCls}
                        type="email"
                        placeholder="your@email.com"
                        value={infoForm.viperSpinEmail}
                        onChange={e => setInfoForm(f => ({ ...f, viperSpinEmail: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Zesty.Bet Email or Username</label>
                      <input
                        className={inputCls}
                        placeholder="email or username"
                        value={infoForm.zestyBetInfo}
                        onChange={e => setInfoForm(f => ({ ...f, zestyBetInfo: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Discord Username</label>
                      <input
                        className={inputCls}
                        placeholder="username"
                        value={infoForm.discordUsername}
                        onChange={e => setInfoForm(f => ({ ...f, discordUsername: e.target.value }))}
                      />
                    </div>
                  </div>

                  <button
                    onClick={submitInfo}
                    disabled={submittingInfo}
                    className="mt-5 w-full py-2.5 bg-[#00ff87] hover:bg-[#00e676] disabled:opacity-60 text-black font-black text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {submittingInfo
                      ? <><Loader2 size={14} className="animate-spin" /> Submitting…</>
                      : <><Send size={14} /> Submit Details</>}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        {provider !== "AUSlots" && (
          <div
            className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-black tracking-wider max-w-[90px] truncate"
            style={{
              backgroundColor: providerColor,
              color: provider === "ViperSpin" ? "#ffffff" : "#000000",
            }}
          >
            {provider === "Pragmatic Play" ? "PRAGMATIC"
              : provider === "Nolimit City" ? "NOLIMIT"
              : provider === "PenguinGaming" ? "PENGUIN"
              : provider.toUpperCase()}
          </div>
        )}
        {spinCount > 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 text-white text-[10px] font-black tracking-wider">
            {spinCount} SPINS
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#111111] to-transparent" />
      </div>

      {/* Card body */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-white font-bold text-base leading-tight mb-1">{gameName}</h3>
          {provider !== "AUSlots" && (
            <p className="text-xs font-medium" style={{ color: provider === "Zesty.Bet" ? "#4ade80" : provider === "ViperSpin" ? "#06b6d4" : "rgba(255,255,255,0.4)" }}>
              {provider}
            </p>
          )}
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
    </>
  );
}

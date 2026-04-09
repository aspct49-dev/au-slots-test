"use client";

import { Coins } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface PointsBalanceProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function PointsBalance({
  className = "",
  size = "md",
}: PointsBalanceProps) {
  const { user, isLoggedIn, openLoginModal } = useAuth();

  if (!isLoggedIn) {
    return (
      <button
        onClick={openLoginModal}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00ff87]/10 border border-[#00ff87]/20 hover:bg-[#00ff87]/20 hover:border-[#00ff87]/40 transition-all duration-200 ${className}`}
      >
        <Coins size={16} className="text-[#00ff87]" />
        <span className="text-[#00ff87] font-bold text-sm">
          Log in to view balance
        </span>
      </button>
    );
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-4 text-lg",
  };

  const iconSize = size === "sm" ? 14 : size === "lg" ? 22 : 18;

  return (
    <div
      className={`inline-flex items-center gap-3 ${sizeClasses[size]} rounded-xl bg-[#00ff87]/10 border border-[#00ff87]/20 ${className}`}
    >
      <Coins size={iconSize} className="text-[#00ff87]" />
      <div>
        <div className="flex items-baseline gap-1">
          <span className="font-black text-[#00ff87]">
            {user?.points?.toLocaleString()}
          </span>
          <span className="text-[#00ff87]/60 text-xs font-medium">POINTS</span>
        </div>
        <div className="text-white/40 text-xs">Your balance</div>
      </div>
    </div>
  );
}

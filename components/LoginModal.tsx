"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

// Kick brand icon
function KickIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 2h20v20H2V2zm4 4v12h3V14l5 4h4l-6-6 6-6h-4l-5 4V6H6z" />
    </svg>
  );
}

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useAuth();

  const handleKickLogin = () => {
    // Full-page redirect to our OAuth initiation route
    window.location.href = "/api/auth/kick";
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={closeLoginModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center z-[101] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-sm bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#53fc18] to-transparent" />

              {/* Header */}
              <div className="relative p-8 pb-6">
                <button
                  onClick={closeLoginModal}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#53fc18]/10 border border-[#53fc18]/20 flex items-center justify-center mb-4">
                    <Image src="/images/logo.png" alt="AUSlots" width={48} height={48} className="rounded-full" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">WELCOME BACK</h2>
                  <p className="text-white/50 text-sm">
                    Log in with your Kick account to access rewards, raffles & more
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="px-8 pb-8 space-y-4">
                <button
                  onClick={handleKickLogin}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-200 bg-[#53fc18] hover:bg-[#45e014] text-black hover:shadow-[0_0_25px_rgba(83,252,24,0.4)]"
                >
                  <KickIcon />
                  LOG IN WITH KICK
                </button>

                <div className="space-y-2 pt-1">
                  <div className="flex items-start gap-2 text-xs text-white/30">
                    <span className="text-[#53fc18] mt-0.5">✓</span>
                    Your Botrix points balance syncs automatically
                  </div>
                  <div className="flex items-start gap-2 text-xs text-white/30">
                    <span className="text-[#53fc18] mt-0.5">✓</span>
                    Points deducted instantly when you redeem rewards
                  </div>
                  <div className="flex items-start gap-2 text-xs text-white/30">
                    <span className="text-[#53fc18] mt-0.5">✓</span>
                    Access raffles, challenges & giveaways
                  </div>
                </div>

                <p className="text-center text-white/25 text-xs pt-2">
                  By logging in you agree to our{" "}
                  <span className="text-[#53fc18]/60 cursor-pointer hover:text-[#53fc18]">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-[#53fc18]/60 cursor-pointer hover:text-[#53fc18]">
                    Privacy Policy
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

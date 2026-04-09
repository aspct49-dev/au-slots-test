"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111111]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff87]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        {icon && (
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 text-white/10"
          >
            {icon}
          </motion.div>
        )}

        <div className="w-16 h-16 rounded-full bg-[#00ff87]/5 border border-[#00ff87]/10 flex items-center justify-center mb-4">
          <Image src="/images/logo.png" alt="AUSlots" width={40} height={40} className="rounded-full" />
        </div>

        <h3 className="text-white/70 font-bold text-xl mb-2">{title}</h3>
        <p className="text-white/30 text-sm max-w-xs leading-relaxed mb-6">
          {description}
        </p>

        {action && (
          <>
            {action.href ? (
              <a
                href={action.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00ff87]/10 border border-[#00ff87]/20 text-[#00ff87] font-bold text-sm tracking-wider hover:bg-[#00ff87]/20 hover:border-[#00ff87]/40 transition-all duration-200"
              >
                {action.label}
              </a>
            ) : (
              <button
                onClick={action.onClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00ff87]/10 border border-[#00ff87]/20 text-[#00ff87] font-bold text-sm tracking-wider hover:bg-[#00ff87]/20 hover:border-[#00ff87]/40 transition-all duration-200"
              >
                {action.label}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

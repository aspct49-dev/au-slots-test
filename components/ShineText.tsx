"use client";

import { ReactNode } from "react";

interface ShineTextProps {
  children: ReactNode;
  className?: string;
  /** Shimmer speed in seconds (default: 3) */
  speed?: number;
  /** Color of the shine highlight */
  color?: string;
}

/**
 * Wraps text in a reflective shimmer animation.
 * Works best on large, bold headings.
 */
export default function ShineText({
  children,
  className = "",
  speed = 3,
  color = "rgba(255,255,255,0.4)",
}: ShineTextProps) {
  return (
    <span
      className={`relative inline-block ${className}`}
      style={{
        backgroundImage: `linear-gradient(
          120deg,
          transparent 0%,
          transparent 30%,
          ${color} 50%,
          transparent 70%,
          transparent 100%
        )`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        animation: `shine-sweep ${speed}s ease-in-out infinite`,
      }}
    >
      {children}
    </span>
  );
}

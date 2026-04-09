'use client';
import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface BubbleTextProps {
  children: string;
  className?: string;
}

export const BubbleText = ({ children, className }: BubbleTextProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseLeave = useCallback(() => setHoveredIndex(null), []);

  const chars = children.split("");

  return (
    <div
      onMouseLeave={handleMouseLeave}
      className={cn("cursor-default font-thin", className)}
    >
      {chars.map((char, idx) => {
        const distance =
          hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : null;

        return (
          <span
            key={idx}
            onMouseEnter={() => setHoveredIndex(idx)}
            className={cn(
              "transition-[font-weight,color] duration-200 ease-in-out",
              distance === 0 && "font-black text-white",
              distance === 1 && "font-medium",
              distance === 2 && "font-light",
            )}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </div>
  );
};

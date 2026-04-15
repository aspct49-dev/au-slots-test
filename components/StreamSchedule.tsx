"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";
import type { StreamDay } from "@/lib/scheduleStore";

export default function StreamSchedule() {
  const [scheduleData, setScheduleData] = useState<StreamDay[]>([]);

  useEffect(() => {
    fetch("/api/schedule", { cache: "no-store" })
      .then(r => r.json())
      .then(setScheduleData)
      .catch(() => {});
  }, []);

  return (
    <section className="py-12 sm:py-20 relative">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff87]/10 border border-[#00ff87]/20 mb-4">
            <Calendar size={12} className="text-[#00ff87]" />
            <span className="text-[#00ff87] text-xs font-bold tracking-widest">
              STREAM SCHEDULE
            </span>
          </div>
          <BubbleText className="text-3xl sm:text-4xl tracking-tight text-[#00ff87]/60 mb-3">{"WHEN WE GO LIVE"}</BubbleText>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Tune in for your chance to earn points and win rewards. All times in AEST (UTC+10).
          </p>
        </motion.div>

        {/* Schedule cards - horizontal scroll on mobile */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-3 min-w-max lg:min-w-0 lg:grid lg:grid-cols-7">
            {scheduleData.map((item, index) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={`relative flex flex-col w-40 lg:w-auto rounded-2xl overflow-hidden border transition-all duration-300 group ${
                  item.off
                    ? "bg-[#0d0d0d] border-white/5 opacity-40"
                    : item.special
                    ? "bg-[#1a1500] border-[#fbbf24]/20 hover:border-[#fbbf24]/40 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                    : item.isMain
                    ? "bg-[#001a0d] border-[#00ff87]/15 hover:border-[#00ff87]/35 hover:shadow-[0_0_20px_rgba(0,255,135,0.1)]"
                    : "bg-[#0f0f1a] border-[#a78bfa]/15 hover:border-[#a78bfa]/35 hover:shadow-[0_0_20px_rgba(167,139,250,0.1)]"
                }`}
              >
                {/* Day header */}
                <div
                  className="px-4 py-3 text-center border-b"
                  style={{
                    borderColor: item.off
                      ? "rgba(255,255,255,0.05)"
                      : `${item.color}20`,
                    backgroundColor: `${item.color}08`,
                  }}
                >
                  <span
                    className="text-xs font-black tracking-widest"
                    style={{ color: item.off ? "rgba(255,255,255,0.3)" : item.color }}
                  >
                    {item.day}
                  </span>
                </div>

                {/* Content */}
                <div className="px-4 py-4 flex flex-col gap-2 flex-1">
                  {item.special && (
                    <span className="self-start text-[10px] font-black tracking-widest text-[#fbbf24] bg-[#fbbf24]/10 px-2 py-0.5 rounded-full">
                      SPECIAL
                    </span>
                  )}
                  <div className="font-bold text-sm text-white">
                    {item.streamer}
                  </div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: item.off ? "rgba(255,255,255,0.2)" : item.color }}
                  >
                    {item.type}
                  </div>
                  {!item.off && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock size={11} className="text-white/30" />
                      <span className="text-xs text-white/50 font-medium">{item.time}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Watch now CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8"
        >
          <a
            href="https://kick.com/auslots"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#53fc18] text-black font-black text-sm tracking-widest hover:bg-[#45e014] transition-all duration-200 hover:shadow-[0_0_20px_rgba(83,252,24,0.4)]"
          >
            <div className="relative w-2 h-2">
              <div className="w-2 h-2 rounded-full bg-black" />
              <div className="absolute inset-0 rounded-full bg-black animate-ping opacity-50" />
            </div>
            WATCH ON KICK
          </a>
        </motion.div>
      </div>
    </section>
  );
}

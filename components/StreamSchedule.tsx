"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";

interface ScheduleEntry {
  id?: number;
  date: string;
  medi: string;
  layto: string;
  aus: string;
}

const STREAMERS = [
  { key: "medi" as const, label: "Medi", color: "#a78bfa" },
  { key: "layto" as const, label: "Layto", color: "#60a5fa" },
  { key: "aus" as const, label: "Aus", color: "#00ff87" },
];

/* ── helpers ──────────────────────────────────────────────── */

function toDateStr(d: Date) {
  return d.toISOString().split("T")[0];
}

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDayName(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-AU", { weekday: "long" });
}

function formatDayShort(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-AU", { weekday: "short" }).toUpperCase();
}

function formatDayNum(dateStr: string) {
  return new Date(dateStr + "T00:00:00").getDate();
}

function formatMonthYear(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-AU", { month: "long", year: "numeric" });
}

function isToday(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toDateString() === new Date().toDateString();
}

function isPast(dateStr: string) {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return new Date(dateStr + "T00:00:00") < t;
}

/* Generate 14 days starting from TODAY */
function generateTwoWeeks(): ScheduleEntry[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const entries: ScheduleEntry[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    entries.push({ date: toDateStr(d), medi: "TBA", layto: "TBA", aus: "TBA" });
  }
  return entries;
}

/* Merge API data onto generated skeleton */
function mergeEntries(skeleton: ScheduleEntry[], api: ScheduleEntry[]): ScheduleEntry[] {
  const map = new Map(api.map((e) => [e.date, e]));
  return skeleton.map((s) => map.get(s.date) ?? s);
}

/* Split into 7-day chunks */
function splitWeeks(entries: ScheduleEntry[]): ScheduleEntry[][] {
  const weeks: ScheduleEntry[][] = [];
  for (let i = 0; i < entries.length; i += 7) {
    weeks.push(entries.slice(i, i + 7));
  }
  return weeks;
}

/* ── component ────────────────────────────────────────────── */

export default function StreamSchedule() {
  const [apiEntries, setApiEntries] = useState<ScheduleEntry[]>([]);
  const [weekIdx, setWeekIdx] = useState(0);
  const [mobileDay, setMobileDay] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stream-schedule", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setApiEntries(data);
      })
      .catch(() => {});
  }, []);

  // Build the 2-week grid, fill in API data where available
  const skeleton = generateTwoWeeks();
  const merged = mergeEntries(skeleton, apiEntries);
  const weeks = splitWeeks(merged);
  const week = weeks[weekIdx] ?? [];

  // Mobile: default to today
  useEffect(() => {
    if (week.length > 0 && !mobileDay) {
      const todayStr = toDateStr(new Date());
      setMobileDay(week.find((e) => e.date === todayStr)?.date ?? week[0].date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week.length]);

  const weekLabel =
    week.length > 0
      ? `${formatFullDate(week[0].date).split(",").slice(1).join(",").trim()} — ${formatFullDate(week[week.length - 1].date).split(",").slice(1).join(",").trim()}`
      : "";

  const mobileEntry = week.find((e) => e.date === mobileDay);

  return (
    <section className="py-12 sm:py-20 relative" id="schedule">
      <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
        {/* ── Header ────────────────────────────────── */}
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
          <BubbleText className="text-3xl sm:text-4xl tracking-tight text-[#00ff87]/60 mb-3">
            {"WHEN WE GO LIVE"}
          </BubbleText>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            All times in AEST (UTC+10). Three streamers, one channel.
          </p>
        </motion.div>

        {/* ── Week navigation ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => { setWeekIdx((i) => Math.max(0, i - 1)); setMobileDay(null); }}
              disabled={weekIdx === 0}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed text-sm font-bold"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Prev Week</span>
            </button>

            <div className="text-center">
              <p className="text-white font-black text-sm sm:text-base tracking-tight">
                {week.length > 0 && formatMonthYear(week[0].date)}
              </p>
              <p className="text-white/30 text-[11px] tracking-wide mt-0.5">{weekLabel}</p>
            </div>

            <button
              onClick={() => { setWeekIdx((i) => Math.min(weeks.length - 1, i + 1)); setMobileDay(null); }}
              disabled={weekIdx >= weeks.length - 1}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed text-sm font-bold"
            >
              <span className="hidden sm:inline">Next Week</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Streamer legend */}
          <div className="flex items-center justify-center gap-5 sm:gap-6 mb-6">
            {STREAMERS.map((s) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}40` }}
                />
                <span className="text-[11px] font-bold tracking-wider" style={{ color: s.color }}>
                  {s.label.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* ═══════ DESKTOP TABLE ═══════ */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/[0.08]">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111111] border-b border-white/[0.08]">
                  <th className="px-5 py-3.5 text-left text-[11px] font-black tracking-widest text-white/40 uppercase w-[220px]">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-white/25" />
                      Date
                    </div>
                  </th>
                  {STREAMERS.map((s) => (
                    <th
                      key={s.key}
                      className="px-5 py-3.5 text-center text-[11px] font-black tracking-widest uppercase"
                      style={{ color: s.color }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}50` }}
                        />
                        {s.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {week.map((entry, i) => {
                    const today = isToday(entry.date);
                    const past = isPast(entry.date);
                    return (
                      <motion.tr
                        key={entry.date}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        className={`border-b border-white/[0.05] last:border-0 transition-all group ${
                          today
                            ? "bg-[#00ff87]/[0.05] hover:bg-[#00ff87]/[0.08]"
                            : past
                            ? "bg-[#0a0a0a]/50 hover:bg-white/[0.02]"
                            : i % 2 === 0
                            ? "bg-[#0d0d0d] hover:bg-white/[0.03]"
                            : "bg-[#0a0a0a] hover:bg-white/[0.03]"
                        }`}
                      >
                        {/* Date cell */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm ${
                                today
                                  ? "bg-[#00ff87] text-black shadow-[0_0_15px_rgba(0,255,135,0.3)]"
                                  : past
                                  ? "bg-white/[0.04] text-white/25"
                                  : "bg-white/[0.06] text-white/60 group-hover:bg-white/[0.1]"
                              }`}
                            >
                              {formatDayNum(entry.date)}
                            </div>
                            <div>
                              <span
                                className={`text-sm font-bold block ${
                                  today ? "text-[#00ff87]" : past ? "text-white/30" : "text-white/70"
                                }`}
                              >
                                {formatDayName(entry.date)}
                              </span>
                              {today && (
                                <span className="text-[9px] font-black text-[#00ff87] tracking-widest flex items-center gap-1 mt-0.5">
                                  <div className="w-1 h-1 rounded-full bg-[#00ff87] animate-pulse" />
                                  TODAY
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Streamer cells */}
                        {STREAMERS.map((s) => {
                          const time = entry[s.key];
                          const isOff = !time || time.toUpperCase() === "OFF";
                          const isTBA = time?.toUpperCase() === "TBA";
                          return (
                            <td key={s.key} className="px-5 py-3.5 text-center">
                              {isOff ? (
                                <span className={`text-xs font-bold tracking-wider ${past ? "text-white/10" : "text-white/15"}`}>
                                  OFF
                                </span>
                              ) : isTBA ? (
                                <span className={`text-xs font-bold tracking-wider ${past ? "text-white/10" : "text-white/20"}`}>
                                  TBA
                                </span>
                              ) : (
                                <div
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${past ? "opacity-40" : ""}`}
                                  style={{
                                    backgroundColor: `${s.color}10`,
                                    border: `1px solid ${s.color}20`,
                                  }}
                                >
                                  <Clock size={10} style={{ color: s.color, opacity: 0.6 }} />
                                  <span className="text-sm font-bold" style={{ color: s.color }}>
                                    {time}
                                  </span>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* ═══════ MOBILE VIEW ═══════ */}
          <div className="md:hidden">
            {/* Day selector strip */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
              {week.map((entry) => {
                const today = isToday(entry.date);
                const selected = mobileDay === entry.date;
                return (
                  <button
                    key={entry.date}
                    onClick={() => setMobileDay(entry.date)}
                    className={`flex flex-col items-center px-3 py-2.5 rounded-xl flex-shrink-0 transition-all min-w-[56px] ${
                      selected
                        ? today
                          ? "bg-[#00ff87]/20 border-[#00ff87]/40 border"
                          : "bg-white/10 border-white/20 border"
                        : "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-bold tracking-wider ${
                        selected ? (today ? "text-[#00ff87]" : "text-white/80") : "text-white/30"
                      }`}
                    >
                      {formatDayShort(entry.date)}
                    </span>
                    <span
                      className={`text-lg font-black mt-0.5 ${
                        selected ? (today ? "text-[#00ff87]" : "text-white") : "text-white/50"
                      }`}
                    >
                      {formatDayNum(entry.date)}
                    </span>
                    {today && <div className="w-1 h-1 rounded-full bg-[#00ff87] mt-1" />}
                  </button>
                );
              })}
            </div>

            {/* Selected day detail */}
            <AnimatePresence mode="wait">
              {mobileEntry && (
                <motion.div
                  key={mobileEntry.date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div className="text-center mb-4">
                    <p
                      className={`text-sm font-black ${
                        isToday(mobileEntry.date) ? "text-[#00ff87]" : "text-white/70"
                      }`}
                    >
                      {formatFullDate(mobileEntry.date)}
                    </p>
                    {isToday(mobileEntry.date) && (
                      <span className="text-[10px] font-black text-[#00ff87] tracking-widest">
                        • LIVE TODAY •
                      </span>
                    )}
                  </div>

                  {STREAMERS.map((s) => {
                    const time = mobileEntry[s.key];
                    const isOff = !time || time.toUpperCase() === "OFF";
                    const isTBA = time?.toUpperCase() === "TBA";
                    return (
                      <div
                        key={s.key}
                        className={`relative rounded-2xl p-4 border overflow-hidden ${
                          isOff || isTBA ? "bg-white/[0.02] border-white/[0.06]" : "border-transparent"
                        }`}
                        style={
                          !isOff && !isTBA
                            ? {
                                background: `linear-gradient(135deg, ${s.color}08, ${s.color}04)`,
                                borderColor: `${s.color}20`,
                              }
                            : undefined
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{
                                backgroundColor: isOff || isTBA ? "rgba(255,255,255,0.04)" : `${s.color}15`,
                                border: `1px solid ${isOff || isTBA ? "rgba(255,255,255,0.06)" : `${s.color}25`}`,
                              }}
                            >
                              <span
                                className="text-sm font-black"
                                style={{
                                  color: isOff || isTBA ? "rgba(255,255,255,0.15)" : s.color,
                                }}
                              >
                                {s.label.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <span
                                className="text-sm font-black"
                                style={{ color: isOff || isTBA ? "rgba(255,255,255,0.25)" : s.color }}
                              >
                                {s.label}
                              </span>
                              {isOff && (
                                <p className="text-[10px] text-white/15 font-bold tracking-wider">DAY OFF</p>
                              )}
                              {isTBA && (
                                <p className="text-[10px] text-white/15 font-bold tracking-wider">TO BE ANNOUNCED</p>
                              )}
                            </div>
                          </div>
                          {isOff ? (
                            <span className="text-xs font-bold text-white/15">OFF</span>
                          ) : isTBA ? (
                            <span className="text-xs font-bold text-white/20">TBA</span>
                          ) : (
                            <div
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                              style={{
                                backgroundColor: `${s.color}15`,
                                border: `1px solid ${s.color}25`,
                              }}
                            >
                              <Clock size={11} style={{ color: s.color, opacity: 0.7 }} />
                              <span className="text-sm font-bold" style={{ color: s.color }}>
                                {time}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Week dots */}
          {weeks.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-6">
              {weeks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setWeekIdx(i); setMobileDay(null); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === weekIdx
                      ? "bg-[#00ff87] shadow-[0_0_8px_rgba(0,255,135,0.4)] scale-125"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* CTA */}
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

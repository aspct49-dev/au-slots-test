"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";

interface ScheduleEntry {
  id: number;
  date: string;
  medi: string;
  layto: string;
  aus: string;
}

const STREAMERS = [
  { key: "medi" as const, label: "Medi", color: "#a78bfa", gradient: "from-[#a78bfa]/20 to-[#a78bfa]/5" },
  { key: "layto" as const, label: "Layto", color: "#60a5fa", gradient: "from-[#60a5fa]/20 to-[#60a5fa]/5" },
  { key: "aus" as const, label: "Aus", color: "#00ff87", gradient: "from-[#00ff87]/20 to-[#00ff87]/5" },
];

function formatDayName(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { weekday: "long" });
}

function formatDayShort(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { weekday: "short" }).toUpperCase();
}

function formatDayNum(dateStr: string) {
  return new Date(dateStr + "T00:00:00").getDate();
}

function formatMonthYear(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { month: "long", year: "numeric" });
}

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function isToday(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toDateString() === new Date().toDateString();
}

function isPast(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr + "T00:00:00") < today;
}

// Group entries into weeks
function groupByWeek(entries: ScheduleEntry[]): ScheduleEntry[][] {
  if (entries.length === 0) return [];
  const weeks: ScheduleEntry[][] = [];
  let currentWeek: ScheduleEntry[] = [];

  for (const entry of entries) {
    const d = new Date(entry.date + "T00:00:00");
    const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon...
    if (dayOfWeek === 1 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(entry);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);
  return weeks;
}

// Find which week contains today
function findCurrentWeekIndex(weeks: ScheduleEntry[][]): number {
  const todayStr = new Date().toISOString().split("T")[0];
  for (let i = 0; i < weeks.length; i++) {
    if (weeks[i].some(e => e.date === todayStr)) return i;
  }
  // If today's not in data, find the nearest future week
  for (let i = 0; i < weeks.length; i++) {
    if (weeks[i].some(e => e.date >= todayStr)) return i;
  }
  return 0;
}

export default function StreamSchedule() {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [weekIdx, setWeekIdx] = useState(0);
  const [mobileSelected, setMobileSelected] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/stream-schedule", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        // Show from yesterday onward (keep past days in the same week)
        const sorted = data.sort((a: ScheduleEntry, b: ScheduleEntry) => a.date.localeCompare(b.date));
        setEntries(sorted);
      })
      .catch(() => {});
  }, []);

  const weeks = groupByWeek(entries);

  useEffect(() => {
    if (weeks.length > 0) {
      const idx = findCurrentWeekIndex(weeks);
      setWeekIdx(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  const week = weeks[weekIdx] ?? [];
  const todayStr = new Date().toISOString().split("T")[0];

  // Set initially selected mobile day to today if in current week
  useEffect(() => {
    if (week.length > 0 && !mobileSelected) {
      const todayEntry = week.find(e => e.date === todayStr);
      setMobileSelected(todayEntry ? todayEntry.date : week[0].date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week]);

  const weekRange = week.length > 0
    ? `${formatFullDate(week[0].date).split(",").slice(1).join(",").trim()} — ${formatFullDate(week[week.length - 1].date).split(",").slice(1).join(",").trim()}`
    : "";

  const selectedEntry = week.find(e => e.date === mobileSelected);

  return (
    <section className="py-12 sm:py-20 relative" id="schedule">
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
            <span className="text-[#00ff87] text-xs font-bold tracking-widest">STREAM SCHEDULE</span>
          </div>
          <BubbleText className="text-3xl sm:text-4xl tracking-tight text-[#00ff87]/60 mb-3">{"WHEN WE GO LIVE"}</BubbleText>
          <p className="text-white/50 text-sm max-w-md mx-auto">All times in AEST (UTC+10). Three streamers, one channel.</p>
        </motion.div>

        {entries.length === 0 ? (
          <p className="text-center text-white/20 text-sm py-12">No schedule available yet.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Week navigation */}
            <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
              <button
                onClick={() => setWeekIdx(i => Math.max(0, i - 1))}
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
                <p className="text-white/30 text-[11px] tracking-wide mt-0.5">{weekRange}</p>
              </div>

              <button
                onClick={() => setWeekIdx(i => Math.min(weeks.length - 1, i + 1))}
                disabled={weekIdx >= weeks.length - 1}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed text-sm font-bold"
              >
                <span className="hidden sm:inline">Next Week</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Streamer legend */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
              {STREAMERS.map(s => (
                <div key={s.key} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}40` }} />
                  <span className="text-xs font-bold tracking-wider" style={{ color: s.color }}>{s.label.toUpperCase()}</span>
                </div>
              ))}
            </div>

            {/* ──── DESKTOP TABLE ──── */}
            <div ref={tableRef} className="hidden md:block overflow-x-auto rounded-2xl border border-white/[0.08] max-w-5xl mx-auto backdrop-blur-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#111111]/80 border-b border-white/[0.08]">
                    <th className="px-5 py-3.5 text-left text-[11px] font-black tracking-widest text-white/40 uppercase w-[200px]">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-white/25" />
                        Date
                      </div>
                    </th>
                    {STREAMERS.map(s => (
                      <th key={s.key} className="px-5 py-3.5 text-center text-[11px] font-black tracking-widest uppercase" style={{ color: s.color }}>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}50` }} />
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
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.04 }}
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
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {/* Day number circle */}
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm transition-all ${
                                today
                                  ? "bg-[#00ff87] text-black shadow-[0_0_15px_rgba(0,255,135,0.3)]"
                                  : past
                                  ? "bg-white/[0.04] text-white/25"
                                  : "bg-white/[0.06] text-white/60 group-hover:bg-white/[0.1]"
                              }`}>
                                {formatDayNum(entry.date)}
                              </div>
                              <div>
                                <span className={`text-sm font-bold block ${today ? "text-[#00ff87]" : past ? "text-white/30" : "text-white/70"}`}>
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
                          {STREAMERS.map(s => {
                            const time = entry[s.key];
                            const isOff = !time || time.toUpperCase() === "OFF";
                            return (
                              <td key={s.key} className="px-5 py-4 text-center">
                                {isOff ? (
                                  <span className={`text-xs font-bold tracking-wider ${past ? "text-white/10" : "text-white/15"}`}>OFF</span>
                                ) : (
                                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                                    style={{
                                      backgroundColor: `${s.color}10`,
                                      border: `1px solid ${s.color}20`,
                                    }}
                                  >
                                    <Clock size={10} style={{ color: s.color, opacity: 0.6 }} />
                                    <span className={`text-sm font-bold ${past ? "opacity-40" : ""}`} style={{ color: s.color }}>
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

            {/* ──── MOBILE CARD VIEW ──── */}
            <div className="md:hidden">
              {/* Day selector strip */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
                {week.map(entry => {
                  const today = isToday(entry.date);
                  const selected = mobileSelected === entry.date;
                  return (
                    <button
                      key={entry.date}
                      onClick={() => setMobileSelected(entry.date)}
                      className={`flex flex-col items-center px-3 py-2.5 rounded-xl flex-shrink-0 transition-all min-w-[56px] ${
                        selected
                          ? today
                            ? "bg-[#00ff87]/20 border-[#00ff87]/40 border"
                            : "bg-white/10 border-white/20 border"
                          : "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className={`text-[10px] font-bold tracking-wider ${
                        selected ? (today ? "text-[#00ff87]" : "text-white/80") : "text-white/30"
                      }`}>
                        {formatDayShort(entry.date)}
                      </span>
                      <span className={`text-lg font-black mt-0.5 ${
                        selected ? (today ? "text-[#00ff87]" : "text-white") : "text-white/50"
                      }`}>
                        {formatDayNum(entry.date)}
                      </span>
                      {today && (
                        <div className="w-1 h-1 rounded-full bg-[#00ff87] mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected day detail */}
              <AnimatePresence mode="wait">
                {selectedEntry && (
                  <motion.div
                    key={selectedEntry.date}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <div className="text-center mb-4">
                      <p className={`text-sm font-black ${isToday(selectedEntry.date) ? "text-[#00ff87]" : "text-white/70"}`}>
                        {formatFullDate(selectedEntry.date)}
                      </p>
                      {isToday(selectedEntry.date) && (
                        <span className="text-[10px] font-black text-[#00ff87] tracking-widest">• LIVE TODAY •</span>
                      )}
                    </div>

                    {STREAMERS.map(s => {
                      const time = selectedEntry[s.key];
                      const isOff = !time || time.toUpperCase() === "OFF";
                      return (
                        <div
                          key={s.key}
                          className={`relative rounded-2xl p-4 border transition-all overflow-hidden ${
                            isOff
                              ? "bg-white/[0.02] border-white/[0.06]"
                              : "border-transparent"
                          }`}
                          style={!isOff ? {
                            background: `linear-gradient(135deg, ${s.color}08, ${s.color}04)`,
                            borderColor: `${s.color}20`,
                          } : undefined}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{
                                  backgroundColor: isOff ? "rgba(255,255,255,0.04)" : `${s.color}15`,
                                  border: `1px solid ${isOff ? "rgba(255,255,255,0.06)" : `${s.color}25`}`,
                                }}
                              >
                                <span className="text-sm font-black" style={{ color: isOff ? "rgba(255,255,255,0.15)" : s.color }}>
                                  {s.label.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-black" style={{ color: isOff ? "rgba(255,255,255,0.25)" : s.color }}>
                                  {s.label}
                                </span>
                                {isOff && <p className="text-[10px] text-white/15 font-bold tracking-wider">DAY OFF</p>}
                              </div>
                            </div>
                            {isOff ? (
                              <span className="text-xs font-bold text-white/15">OFF</span>
                            ) : (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                                style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}25` }}
                              >
                                <Clock size={11} style={{ color: s.color, opacity: 0.7 }} />
                                <span className="text-sm font-bold" style={{ color: s.color }}>{time}</span>
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

            {/* Week indicator dots */}
            {weeks.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-6">
                {weeks.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setWeekIdx(i)}
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
        )}

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

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Save } from "lucide-react";

interface StreamDay {
  day: string;
  fullDay: string;
  streamer: string;
  time: string;
  type: string;
  color: string;
  isMain: boolean;
  special?: boolean;
  off?: boolean;
}

const defaultSchedule: StreamDay[] = [
  { day: "MON", fullDay: "Monday",    streamer: "AUSlots", time: "7PM AEST", type: "Main Stream",   color: "#00ff87", isMain: true },
  { day: "TUE", fullDay: "Tuesday",   streamer: "AUSlots", time: "7PM AEST", type: "Main Stream",   color: "#00ff87", isMain: true },
  { day: "WED", fullDay: "Wednesday", streamer: "AUSlots", time: "7PM AEST", type: "Main Stream",   color: "#00ff87", isMain: true },
  { day: "THU", fullDay: "Thursday",  streamer: "AUSlots", time: "7PM AEST", type: "Big Hunt Night", color: "#fbbf24", isMain: true, special: true },
  { day: "FRI", fullDay: "Friday",    streamer: "AUSlots", time: "7PM AEST", type: "Main Stream",   color: "#00ff87", isMain: true },
  { day: "SAT", fullDay: "Saturday",  streamer: "Guest Streamer", time: "TBD", type: "Guest Night", color: "#a78bfa", isMain: false },
  { day: "SUN", fullDay: "Sunday",    streamer: "–",       time: "–",        type: "Rest Day",      color: "#444444", isMain: false, off: true },
];

const PRESET_COLORS = ["#00ff87", "#fbbf24", "#a78bfa", "#f87171", "#38bdf8", "#fb923c", "#444444"];

const inputCls = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff87]/40 transition-colors";
const labelCls = "block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1";

export default function AdminSchedule() {
  const [schedule, setSchedule] = useState<StreamDay[]>(defaultSchedule);
  const [saved, setSaved] = useState(false);

  const update = (i: number, key: keyof StreamDay, val: string | boolean) => {
    setSchedule(p => p.map((d, idx) => idx === i ? { ...d, [key]: val } : d));
    setSaved(false);
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2"><Calendar size={20} className="text-[#38bdf8]" /> Stream Schedule</h1>
          <p className="text-white/40 text-sm mt-0.5">Edit the 7-day stream schedule</p>
        </div>
        <button onClick={save} className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-xl transition-all ${saved ? "bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/30" : "bg-[#00ff87] hover:bg-[#00e676] text-black"}`}>
          <Save size={14} /> {saved ? "Saved!" : "Save Schedule"}
        </button>
      </div>

      <div className="space-y-3">
        {schedule.map((day, i) => (
          <motion.div key={day.day} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-[#111111] border border-white/[0.06] rounded-2xl p-4"
          >
            <div className="flex items-center gap-4">
              {/* Day label */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm" style={{ background: `${day.color}18`, color: day.color, border: `1px solid ${day.color}30` }}>
                {day.day}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                <div>
                  <label className={labelCls}>Streamer</label>
                  <input className={inputCls} value={day.streamer} onChange={e => update(i, "streamer", e.target.value)} disabled={day.off} />
                </div>
                <div>
                  <label className={labelCls}>Time</label>
                  <input className={inputCls} value={day.time} onChange={e => update(i, "time", e.target.value)} disabled={day.off} placeholder="7PM AEST" />
                </div>
                <div>
                  <label className={labelCls}>Stream Type</label>
                  <input className={inputCls} value={day.type} onChange={e => update(i, "type", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Colour</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={day.color} onChange={e => update(i, "color", e.target.value)} className="w-9 h-9 rounded-lg border border-white/10 bg-[#1a1a1a] cursor-pointer flex-shrink-0" />
                    <div className="flex gap-1 flex-wrap">
                      {PRESET_COLORS.map(c => (
                        <button key={c} onClick={() => update(i, "color", c)} className="w-5 h-5 rounded-full border-2 transition-all" style={{ background: c, borderColor: day.color === c ? "white" : "transparent" }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <label className="flex items-center gap-2 cursor-pointer">
                  <button onClick={() => update(i, "off", !day.off)} className={`w-8 h-5 rounded-full transition-all ${day.off ? "bg-red-500/50" : "bg-white/10"}`}>
                    <div className={`w-3 h-3 rounded-full bg-white shadow transition-all mx-1 ${day.off ? "translate-x-3" : "translate-x-0"}`} />
                  </button>
                  <span className="text-[10px] text-white/40">Off</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <button onClick={() => update(i, "special", !day.special)} className={`w-8 h-5 rounded-full transition-all ${day.special ? "bg-amber-400" : "bg-white/10"}`}>
                    <div className={`w-3 h-3 rounded-full bg-white shadow transition-all mx-1 ${day.special ? "translate-x-3" : "translate-x-0"}`} />
                  </button>
                  <span className="text-[10px] text-white/40">Special</span>
                </label>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

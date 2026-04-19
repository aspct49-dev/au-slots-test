"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Save } from "lucide-react";

interface ScheduleEntry {
  id?: number;
  date: string;
  medi: string;
  layto: string;
  aus: string;
  dirty?: boolean;
}

const STREAMERS = [
  { key: "medi" as const, label: "Medi", color: "#a78bfa" },
  { key: "layto" as const, label: "Layto", color: "#60a5fa" },
  { key: "aus" as const, label: "Aus", color: "#00ff87" },
];

const TIME_PRESETS = [
  "OFF", "5PM - 7PM", "7PM - 1AM", "7PM - 2AM",
  "10AM - 5PM", "11AM - 1PM", "1PM - 7PM", "12PM - 6PM",
  "9AM - 1PM", "2PM - 8PM", "6PM - 10PM",
];

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export default function AdminSchedule() {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [customTime, setCustomTime] = useState<{ date: string; key: string } | null>(null);
  const [customVal, setCustomVal] = useState("");

  useEffect(() => {
    fetch("/api/stream-schedule", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setEntries(data);
        } else {
          // Auto-generate 14 days starting from today if empty
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const generated: ScheduleEntry[] = [];
          for (let i = 0; i < 14; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            generated.push({ date: d.toISOString().split("T")[0], medi: "OFF", layto: "OFF", aus: "OFF", dirty: true });
          }
          setEntries(generated);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function update(date: string, key: "medi" | "layto" | "aus", val: string) {
    setEntries(prev => prev.map(e => e.date === date ? { ...e, [key]: val, dirty: true } : e));
  }

  async function saveAll() {
    const dirty = entries.filter(e => e.dirty);
    if (!dirty.length) return;
    setSaving(true);
    try {
      const res = await fetch("/api/stream-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dirty.map(e => ({ date: e.date, medi: e.medi, layto: e.layto, aus: e.aus }))),
      });
      if (res.ok) {
        setEntries(prev => prev.map(e => ({ ...e, dirty: false })));
        setMsg("Saved!");
        setTimeout(() => setMsg(""), 2500);
      } else {
        const body = await res.json().catch(() => ({}));
        setMsg(`Error ${res.status}: ${body.error || "Unknown error"}`);
        setTimeout(() => setMsg(""), 5000);
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteEntry(date: string) {
    if (!confirm(`Delete ${formatDateLabel(date)}?`)) return;
    await fetch("/api/stream-schedule", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
    setEntries(prev => prev.filter(e => e.date !== date));
  }

  function addWeek() {
    const lastDate = entries.length > 0
      ? new Date(entries[entries.length - 1].date + "T00:00:00")
      : (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d; })();
    const newEntries: ScheduleEntry[] = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(lastDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      if (!entries.find(e => e.date === dateStr)) {
        newEntries.push({ date: dateStr, medi: "OFF", layto: "OFF", aus: "OFF", dirty: true });
      }
    }
    setEntries(prev => [...prev, ...newEntries]);
  }

  function applyCustomTime() {
    if (!customTime || !customVal.trim()) { setCustomTime(null); return; }
    update(customTime.date, customTime.key as "medi" | "layto" | "aus", customVal.trim());
    setCustomTime(null);
    setCustomVal("");
  }

  if (loading) return <div className="text-white/40 text-sm p-8 text-center">Loading…</div>;

  const dirtyCount = entries.filter(e => e.dirty).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Calendar size={20} className="text-[#38bdf8]" /> Stream Schedule
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Manage stream times for Medi, Layto, and Aus</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addWeek}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-sm rounded-xl transition-all"
          >
            <Plus size={14} /> Add Week
          </button>
          <button
            onClick={saveAll}
            disabled={!dirtyCount || saving}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-xl transition-all disabled:opacity-40 ${
              dirtyCount ? "bg-[#00ff87] text-black hover:bg-[#00e676]" : "bg-white/5 text-white/40"
            }`}
          >
            <Save size={14} />
            {saving ? "Saving…" : `Save All${dirtyCount ? ` (${dirtyCount})` : ""}`}
          </button>
        </div>
      </div>

      {msg && <p className="text-[#00ff87] text-sm font-bold text-center bg-[#00ff87]/10 border border-[#00ff87]/20 rounded-xl py-2">{msg}</p>}

      {/* Custom time modal */}
      {customTime && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setCustomTime(null)}>
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <p className="text-white font-black mb-4">Custom Time for {customTime.key.charAt(0).toUpperCase() + customTime.key.slice(1)}</p>
            <input
              autoFocus
              value={customVal}
              onChange={e => setCustomVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && applyCustomTime()}
              placeholder="e.g. 8PM - 12AM"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-white/30 mb-4"
            />
            <div className="flex gap-2">
              <button onClick={applyCustomTime} className="flex-1 py-2.5 bg-[#00ff87] text-black font-black rounded-xl text-sm">Apply</button>
              <button onClick={() => setCustomTime(null)} className="flex-1 py-2.5 bg-white/5 text-white font-bold rounded-xl text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-[#111111] border-b border-white/[0.08]">
              <th className="px-5 py-3 text-left text-xs font-black tracking-widest text-white/40 uppercase">Date</th>
              {STREAMERS.map(s => (
                <th key={s.key} className="px-4 py-3 text-center text-xs font-black tracking-widest uppercase min-w-[160px]" style={{ color: s.color }}>
                  {s.label}
                </th>
              ))}
              <th className="px-4 py-3 w-16" />
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr
                key={entry.date}
                className={`border-b border-white/[0.05] last:border-0 ${
                  entry.dirty ? "bg-[#fbbf24]/[0.03]" : i % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#0a0a0a]"
                }`}
              >
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    {entry.dirty && <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] flex-shrink-0" />}
                    <span className="text-sm font-bold text-white/70">{formatDateLabel(entry.date)}</span>
                  </div>
                </td>
                {STREAMERS.map(s => (
                  <td key={s.key} className="px-3 py-2">
                    <div className="flex gap-1">
                      <select
                        value={TIME_PRESETS.includes(entry[s.key]) ? entry[s.key] : "__custom__"}
                        onChange={e => {
                          if (e.target.value === "__custom__") {
                            setCustomVal(entry[s.key]);
                            setCustomTime({ date: entry.date, key: s.key });
                          } else {
                            update(entry.date, s.key, e.target.value);
                          }
                        }}
                        className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
                        style={{ color: entry[s.key].toUpperCase() === "OFF" ? "rgba(255,255,255,0.2)" : s.color }}
                      >
                        {TIME_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
                        {!TIME_PRESETS.includes(entry[s.key]) && (
                          <option value={entry[s.key]}>{entry[s.key]}</option>
                        )}
                        <option value="__custom__">Custom…</option>
                      </select>
                    </div>
                  </td>
                ))}
                <td className="px-3 py-2">
                  <button
                    onClick={() => deleteEntry(entry.date)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && (
          <div className="text-center py-16 text-white/20 text-sm">
            No schedule entries yet. Click <span className="font-bold text-white/40">Add Week</span> to get started.
          </div>
        )}
      </div>
    </div>
  );
}

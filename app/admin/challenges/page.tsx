"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Pencil, Trash2, X, Save } from "lucide-react";

type ChallengeType = "DAILY" | "WEEKLY" | "ONE-TIME";
type Difficulty = "EASY" | "MEDIUM" | "HARD";

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  type: ChallengeType;
  difficulty: Difficulty;
  active: boolean;
}

const TYPE_COLOR: Record<ChallengeType, string> = {
  DAILY: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  WEEKLY: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "ONE-TIME": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const DIFF_COLOR: Record<Difficulty, string> = {
  EASY: "text-[#00ff87]", MEDIUM: "text-yellow-400", HARD: "text-red-400",
};

const inputCls = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff87]/40 transition-colors";
const labelCls = "block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5";

const emptyChallenge = (): Omit<Challenge, "id"> => ({
  title: "", description: "", points: 100, type: "DAILY", difficulty: "EASY", active: true,
});

export default function AdminChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<Challenge | null>(null);
  const [form, setForm] = useState(emptyChallenge());

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.title) return;
    if (mode === "add") {
      setChallenges(p => [{ ...form, id: Date.now().toString() }, ...p]);
    } else if (editTarget) {
      setChallenges(p => p.map(c => c.id === editTarget.id ? { ...form, id: c.id } : c));
    }
    setMode("list"); setEditTarget(null); setForm(emptyChallenge());
  };

  const startEdit = (c: Challenge) => { setEditTarget(c); setForm(c); setMode("edit"); };
  const toggleActive = (id: string) => setChallenges(p => p.map(c => c.id === id ? { ...c, active: !c.active } : c));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2"><Target size={20} className="text-[#f87171]" /> Challenges</h1>
          <p className="text-white/40 text-sm mt-0.5">{challenges.filter(c => c.active).length} active challenges</p>
        </div>
        {mode === "list" && (
          <button onClick={() => { setForm(emptyChallenge()); setMode("add"); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#00ff87] hover:bg-[#00e676] text-black font-bold text-sm rounded-xl transition-all">
            <Plus size={15} /> Add Challenge
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {mode !== "list" ? (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-black text-white mb-4">{mode === "add" ? "Add Challenge" : `Editing: ${editTarget?.title}`}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Watch 2 hours of stream" /></div>
              <div className="md:col-span-2"><label className={labelCls}>Description</label><textarea rows={2} className={`${inputCls} resize-none`} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Challenge details..." /></div>
              <div><label className={labelCls}>Points Reward</label><input type="number" className={inputCls} value={form.points} onChange={e => set("points", +e.target.value)} /></div>
              <div>
                <label className={labelCls}>Type</label>
                <select className={inputCls} value={form.type} onChange={e => set("type", e.target.value as ChallengeType)}>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="ONE-TIME">One-Time</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Difficulty</label>
                <select className={inputCls} value={form.difficulty} onChange={e => set("difficulty", e.target.value as Difficulty)}>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button type="button" onClick={() => set("active", !form.active)} className={`w-10 h-6 rounded-full transition-all ${form.active ? "bg-[#00ff87]" : "bg-white/10"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-all mx-1 ${form.active ? "translate-x-4" : "translate-x-0"}`} />
                </button>
                <span className="text-sm text-white/60">{form.active ? "Active" : "Inactive"}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-[#00ff87] hover:bg-[#00e676] text-black font-bold text-sm rounded-xl transition-all"><Save size={14} /> Save</button>
              <button onClick={() => { setMode("list"); setEditTarget(null); }} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 font-semibold text-sm rounded-xl transition-all">Cancel</button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {challenges.length === 0 ? (
              <div className="text-center py-20 text-white/20">
                <Target size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-bold">No challenges yet</p>
              </div>
            ) : challenges.map(c => (
              <div key={c.id} className={`flex items-center gap-4 bg-[#111111] border rounded-xl px-4 py-3 transition-all ${c.active ? "border-white/[0.06]" : "border-white/[0.03] opacity-50"}`}>
                <button onClick={() => toggleActive(c.id)} className={`w-8 h-5 rounded-full transition-all flex-shrink-0 ${c.active ? "bg-[#00ff87]" : "bg-white/10"}`}>
                  <div className={`w-3 h-3 rounded-full bg-white shadow transition-all mx-1 ${c.active ? "translate-x-3" : "translate-x-0"}`} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TYPE_COLOR[c.type]}`}>{c.type}</span>
                    <p className="font-bold text-white text-sm truncate">{c.title}</p>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5"><span className={DIFF_COLOR[c.difficulty]}>{c.difficulty}</span> · {c.points.toLocaleString()} pts</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(c)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"><Pencil size={13} /></button>
                  <button onClick={() => setChallenges(p => p.filter(ch => ch.id !== c.id))} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, Pencil, Trash2, X, Save, ChevronDown } from "lucide-react";
import { reviews as initialReviews, type SlotReview, type Volatility, type Tag } from "@/lib/reviewsData";

const VOLATILITY_OPTIONS: Volatility[] = ["LOW", "MEDIUM", "HIGH", "VERY HIGH"];
const TAG_OPTIONS: Tag[] = ["HOT", "NEW", "STREAMER FAV", "CLASSIC"];

const VOLATILITY_COLOR: Record<Volatility, string> = {
  LOW: "text-blue-400 bg-blue-500/20 border-blue-500/30",
  MEDIUM: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
  HIGH: "text-orange-400 bg-orange-500/20 border-orange-500/30",
  "VERY HIGH": "text-red-400 bg-red-500/20 border-red-500/30",
};

const emptyReview = (): Omit<SlotReview, "id"> => ({
  gameName: "",
  provider: "",
  providerColor: "#00ff87",
  imageUrl: "",
  gradientFallback: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
  rtp: 96.0,
  volatility: "VERY HIGH",
  releaseDate: "",
  maxWin: "",
  minBet: "$0.20",
  maxBet: "$100",
  streamerRating: 8.0,
  userRating: 8.0,
  userRatingCount: 0,
  tags: [],
  about: "",
  bettingAndFeatures: "",
  gameplayFeatures: [""],
  streamerTake: "",
  finalVerdict: "",
  gamingTips: [""],
});

type FormData = Omit<SlotReview, "id">;

function ReviewForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: FormData;
  onSave: (data: FormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormData>(initial);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setArr = (key: "gameplayFeatures" | "gamingTips", i: number, val: string) =>
    setForm((f) => {
      const arr = [...(f[key] as string[])];
      arr[i] = val;
      return { ...f, [key]: arr };
    });

  const addArr = (key: "gameplayFeatures" | "gamingTips") =>
    setForm((f) => ({ ...f, [key]: [...(f[key] as string[]), ""] }));

  const removeArr = (key: "gameplayFeatures" | "gamingTips", i: number) =>
    setForm((f) => ({ ...f, [key]: (f[key] as string[]).filter((_, idx) => idx !== i) }));

  const toggleTag = (tag: Tag) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));

  const inputCls = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff87]/40 transition-colors";
  const labelCls = "block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5";

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Game Name</label>
          <input className={inputCls} value={form.gameName} onChange={(e) => set("gameName", e.target.value)} placeholder="e.g. Gates of Olympus 1000" />
        </div>
        <div>
          <label className={labelCls}>Provider</label>
          <input className={inputCls} value={form.provider} onChange={(e) => set("provider", e.target.value)} placeholder="e.g. Pragmatic Play" />
        </div>
        <div>
          <label className={labelCls}>Provider Colour (hex)</label>
          <div className="flex gap-2">
            <input type="color" value={form.providerColor} onChange={(e) => set("providerColor", e.target.value)} className="w-10 h-10 rounded-lg border border-white/10 bg-[#1a1a1a] cursor-pointer" />
            <input className={inputCls} value={form.providerColor} onChange={(e) => set("providerColor", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Image URL</label>
          <input className={inputCls} value={form.imageUrl ?? ""} onChange={(e) => set("imageUrl", e.target.value)} placeholder="/images/my-slot.png" />
        </div>
        <div>
          <label className={labelCls}>RTP (%)</label>
          <input type="number" step="0.01" className={inputCls} value={form.rtp} onChange={(e) => set("rtp", parseFloat(e.target.value))} />
        </div>
        <div>
          <label className={labelCls}>Volatility</label>
          <select className={inputCls} value={form.volatility} onChange={(e) => set("volatility", e.target.value as Volatility)}>
            {VOLATILITY_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Release Date (YYYY-MM)</label>
          <input className={inputCls} value={form.releaseDate} onChange={(e) => set("releaseDate", e.target.value)} placeholder="2024-01" />
        </div>
        <div>
          <label className={labelCls}>Max Win</label>
          <input className={inputCls} value={form.maxWin} onChange={(e) => set("maxWin", e.target.value)} placeholder="5,000x" />
        </div>
        <div>
          <label className={labelCls}>Min Bet</label>
          <input className={inputCls} value={form.minBet} onChange={(e) => set("minBet", e.target.value)} placeholder="$0.20" />
        </div>
        <div>
          <label className={labelCls}>Max Bet</label>
          <input className={inputCls} value={form.maxBet} onChange={(e) => set("maxBet", e.target.value)} placeholder="$100" />
        </div>
        <div>
          <label className={labelCls}>AUSlots Rating (1–10)</label>
          <input type="number" step="0.1" min="1" max="10" className={inputCls} value={form.streamerRating} onChange={(e) => set("streamerRating", parseFloat(e.target.value))} />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className={labelCls}>Tags</label>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                form.tags.includes(tag) ? "bg-[#00ff87] text-black" : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Text fields */}
      {(["about", "bettingAndFeatures", "streamerTake", "finalVerdict"] as const).map((field) => (
        <div key={field}>
          <label className={labelCls}>{field.replace(/([A-Z])/g, " $1").trim()}</label>
          <textarea
            rows={4}
            className={`${inputCls} resize-none`}
            value={form[field]}
            onChange={(e) => set(field, e.target.value)}
            placeholder={`Write the ${field} section...`}
          />
        </div>
      ))}

      {/* Gameplay features */}
      {(["gameplayFeatures", "gamingTips"] as const).map((key) => (
        <div key={key}>
          <label className={labelCls}>{key === "gameplayFeatures" ? "Gameplay Features" : "Gaming Tips"}</label>
          <div className="space-y-2">
            {(form[key] as string[]).map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inputCls}
                  value={item}
                  onChange={(e) => setArr(key, i, e.target.value)}
                  placeholder={`Item ${i + 1}`}
                />
                <button type="button" onClick={() => removeArr(key, i)} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addArr(key)} className="flex items-center gap-2 text-xs text-[#00ff87] hover:text-[#00e676] transition-colors">
              <Plus size={13} /> Add item
            </button>
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00ff87] hover:bg-[#00e676] text-black font-bold text-sm rounded-xl transition-all"
        >
          <Save size={14} /> Save Review
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 font-semibold text-sm rounded-xl transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<SlotReview[]>(initialReviews);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<SlotReview | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = (data: FormData) => {
    const newReview: SlotReview = { ...data, id: Date.now().toString() };
    setReviews((r) => [newReview, ...r]);
    setMode("list");
  };

  const handleEdit = (data: FormData) => {
    setReviews((r) => r.map((rev) => (rev.id === editTarget?.id ? { ...data, id: rev.id } : rev)));
    setMode("list");
    setEditTarget(null);
  };

  const confirmDelete = (id: string) => setDeleteId(id);

  const doDelete = () => {
    setReviews((r) => r.filter((rev) => rev.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Reviews</h1>
          <p className="text-white/40 text-sm mt-0.5">{reviews.length} slot reviews</p>
        </div>
        {mode === "list" && (
          <button
            onClick={() => setMode("add")}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00ff87] hover:bg-[#00e676] text-black font-bold text-sm rounded-xl transition-all"
          >
            <Plus size={15} /> Add Review
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {mode === "list" ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="flex items-center gap-4 bg-[#111111] border border-white/[0.06] rounded-xl px-4 py-3 hover:border-white/10 transition-all">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{rev.gameName}</p>
                  <p className="text-xs text-white/40">{rev.provider} · RTP {rev.rtp}% · {rev.volatility}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${VOLATILITY_COLOR[rev.volatility]}`}>
                    {rev.volatility}
                  </span>
                  <span className="text-amber-400 text-xs font-bold">{rev.streamerRating}/10</span>
                  <button
                    onClick={() => { setEditTarget(rev); setMode("edit"); }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => confirmDelete(rev.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-base font-black text-white mb-6">
              {mode === "add" ? "Add New Review" : `Editing: ${editTarget?.gameName}`}
            </h2>
            <ReviewForm
              initial={mode === "edit" && editTarget ? editTarget : emptyReview()}
              onSave={mode === "add" ? handleAdd : handleEdit}
              onCancel={() => { setMode("list"); setEditTarget(null); }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111111] border border-white/10 rounded-2xl p-6 max-w-sm w-full"
            >
              <p className="text-white font-black text-lg mb-2">Delete review?</p>
              <p className="text-white/50 text-sm mb-6">This can't be undone.</p>
              <div className="flex gap-3">
                <button onClick={doDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold text-sm rounded-xl transition-all">Delete</button>
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 font-semibold text-sm rounded-xl transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

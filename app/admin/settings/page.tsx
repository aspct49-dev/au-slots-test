"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Radio, Tv2, Plus, X, Loader2, UserCheck, BarChart2, HelpCircle } from "lucide-react";

interface Stat { value: string; label: string; }

function StatsEditor() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (i: number, field: keyof Stat, val: string) => {
    setStats(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true); setError(null);
    const res = await fetch("/api/admin/stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stats),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error ?? "Failed to save");
    else { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="lg:col-span-2 bg-[#111111] border border-white/[0.06] rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={15} className="text-[#00ff87]" />
          <h2 className="text-xs font-black text-white/50 uppercase tracking-widest">Hero Stats</h2>
        </div>
        <button
          onClick={save}
          disabled={saving || loading}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-bold text-xs rounded-lg transition-all ${saved ? "bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/30" : "bg-[#00ff87]/10 hover:bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/20"} disabled:opacity-50`}
        >
          {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
          {saved ? "Saved!" : "Save"}
        </button>
      </div>
      <p className="text-white/30 text-xs leading-relaxed">Edit the four stats shown on the homepage hero section.</p>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {loading ? (
        <div className="flex items-center gap-2 text-white/20 text-xs"><Loader2 size={12} className="animate-spin" /> Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="flex gap-2 items-center px-3 py-2 rounded-xl bg-[#1a1a1a] border border-white/[0.06]">
              <input
                value={stat.value}
                onChange={e => update(i, "value", e.target.value)}
                placeholder="Value"
                className="w-20 bg-transparent text-[#00ff87] font-black text-sm focus:outline-none placeholder:text-white/20"
              />
              <span className="text-white/10">|</span>
              <input
                value={stat.label}
                onChange={e => update(i, "label", e.target.value)}
                placeholder="Label"
                className="flex-1 bg-transparent text-white/60 text-sm focus:outline-none placeholder:text-white/20"
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

interface SiteSettings {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  liveNow: boolean;
  kickChannel: string;
  discordUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  responsibleGamblingNote: string;
}

const defaults: SiteSettings = {
  siteName: "AUSlotsRewards",
  heroTitle: "AUSLOTS REWARDS",
  heroSubtitle: "Watch streams, earn points, redeem rewards.",
  liveNow: false,
  kickChannel: "auslots",
  discordUrl: "https://discord.gg/auslots",
  twitterUrl: "",
  youtubeUrl: "https://www.youtube.com/@auslots",
  instagramUrl: "https://www.instagram.com/auslotsofficial/",
  responsibleGamblingNote: "Gambling can be addictive. Play responsibly. 18+ only.",
};

const inputCls = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00ff87]/40 transition-colors";
const labelCls = "block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5";

function StreamerManager() {
  const [streamers, setStreamers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/streamers")
      .then(r => r.json())
      .then(setStreamers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = async () => {
    const u = input.trim().toLowerCase();
    if (!u) return;
    setAdding(true); setError(null);
    const res = await fetch("/api/admin/streamers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed to add"); }
    else { setStreamers(data); setInput(""); }
    setAdding(false);
  };

  const remove = async (username: string) => {
    setRemoving(username); setError(null);
    const res = await fetch("/api/admin/streamers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed to remove"); }
    else { setStreamers(data); }
    setRemoving(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="lg:col-span-2 bg-[#111111] border border-white/[0.06] rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Tv2 size={15} className="text-[#a78bfa]" />
        <h2 className="text-xs font-black text-white/50 uppercase tracking-widest">Streamer Role</h2>
      </div>
      <p className="text-white/30 text-xs leading-relaxed">
        Streamers can access <span className="text-white/50 font-semibold">Bonus Hunt, Giveaways, and Tournament</span> in the admin panel. They cannot access the shop, redemptions, or other admin sections.
      </p>

      {/* Add form */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setError(null); }}
          onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Kick username"
          className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#a78bfa]/40 transition-colors"
        />
        <button
          onClick={add}
          disabled={adding || !input.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#a78bfa]/10 hover:bg-[#a78bfa]/20 border border-[#a78bfa]/20 text-[#a78bfa] font-bold text-sm rounded-xl transition-all disabled:opacity-50"
        >
          {adding ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          Add
        </button>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Streamer list */}
      {loading ? (
        <div className="flex items-center gap-2 text-white/20 text-xs">
          <Loader2 size={12} className="animate-spin" /> Loading...
        </div>
      ) : streamers.length === 0 ? (
        <p className="text-white/20 text-xs">No streamers added yet.</p>
      ) : (
        <div className="space-y-2">
          {streamers.map(username => (
            <div key={username} className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#1a1a1a] border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <UserCheck size={13} className="text-[#a78bfa]" />
                <span className="text-sm font-semibold text-white/70">{username}</span>
              </div>
              <button
                onClick={() => remove(username)}
                disabled={removing === username}
                className="p-1 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"
              >
                {removing === username ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function NordVPNEditor() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/help")
      .then(r => r.json())
      .then(d => setText(d.text ?? ""))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setError(null);
    const res = await fetch("/api/admin/help", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error ?? "Failed to save");
    else { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="lg:col-span-2 bg-[#111111] border border-white/[0.06] rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle size={15} className="text-[#00ff87]" />
          <h2 className="text-xs font-black text-white/50 uppercase tracking-widest">NordVPN Help Text</h2>
        </div>
        <button
          onClick={save}
          disabled={saving || loading}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-bold text-xs rounded-lg transition-all ${saved ? "bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/30" : "bg-[#00ff87]/10 hover:bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/20"} disabled:opacity-50`}
        >
          {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
          {saved ? "Saved!" : "Save"}
        </button>
      </div>
      <p className="text-white/30 text-xs leading-relaxed">
        This text appears in the <span className="text-white/50 font-semibold">Help &amp; Guides</span> section under &quot;NordVPN: How to access certain websites&quot;.
      </p>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {loading ? (
        <div className="flex items-center gap-2 text-white/20 text-xs"><Loader2 size={12} className="animate-spin" /> Loading...</div>
      ) : (
        <textarea
          rows={6}
          value={text}
          onChange={e => { setText(e.target.value); setSaved(false); }}
          placeholder="Enter NordVPN instructions here..."
          className={`${inputCls} resize-none`}
        />
      )}
    </motion.div>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => {
    setSettings(p => ({ ...p, [k]: v }));
    setSaved(false);
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2"><Settings size={20} className="text-white/60" /> Settings</h1>
          <p className="text-white/40 text-sm mt-0.5">Site-wide configuration</p>
        </div>
        <button onClick={save} className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-xl transition-all ${saved ? "bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/30" : "bg-[#00ff87] hover:bg-[#00e676] text-black"}`}>
          <Save size={14} /> {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${settings.liveNow ? "bg-[#00ff87]/10 border border-[#00ff87]/20" : "bg-white/5"}`}>
                <Radio size={18} className={settings.liveNow ? "text-[#00ff87]" : "text-white/30"} />
              </div>
              <div>
                <p className="font-black text-white text-sm">LIVE NOW Badge</p>
                <p className="text-xs text-white/40">{settings.liveNow ? "Showing in navbar — stream is live" : "Hidden — stream is offline"}</p>
              </div>
            </div>
            <button onClick={() => set("liveNow", !settings.liveNow)} className={`w-14 h-7 rounded-full transition-all relative ${settings.liveNow ? "bg-[#00ff87]" : "bg-white/10"}`}>
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${settings.liveNow ? "left-8" : "left-1"}`} />
            </button>
          </div>
        </motion.div>

        {/* General */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          <h2 className="text-xs font-black text-white/50 uppercase tracking-widest">General</h2>
          <div><label className={labelCls}>Site Name</label><input className={inputCls} value={settings.siteName} onChange={e => set("siteName", e.target.value)} /></div>
          <div><label className={labelCls}>Hero Title</label><input className={inputCls} value={settings.heroTitle} onChange={e => set("heroTitle", e.target.value)} /></div>
          <div><label className={labelCls}>Hero Subtitle</label><input className={inputCls} value={settings.heroSubtitle} onChange={e => set("heroSubtitle", e.target.value)} /></div>
          <div><label className={labelCls}>Kick Channel Slug</label><input className={inputCls} value={settings.kickChannel} onChange={e => set("kickChannel", e.target.value)} /></div>
        </motion.div>

        {/* Social links */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          <h2 className="text-xs font-black text-white/50 uppercase tracking-widest">Social Links</h2>
          <div><label className={labelCls}>Discord</label><input className={inputCls} value={settings.discordUrl} onChange={e => set("discordUrl", e.target.value)} placeholder="https://discord.gg/..." /></div>
          <div><label className={labelCls}>YouTube</label><input className={inputCls} value={settings.youtubeUrl} onChange={e => set("youtubeUrl", e.target.value)} placeholder="https://youtube.com/@..." /></div>
          <div><label className={labelCls}>Instagram</label><input className={inputCls} value={settings.instagramUrl} onChange={e => set("instagramUrl", e.target.value)} placeholder="https://instagram.com/..." /></div>
          <div><label className={labelCls}>Twitter / X</label><input className={inputCls} value={settings.twitterUrl} onChange={e => set("twitterUrl", e.target.value)} placeholder="https://x.com/..." /></div>
        </motion.div>

        {/* Responsible gambling */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2 bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
          <h2 className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">Responsible Gambling Note</h2>
          <textarea rows={2} className={`${inputCls} resize-none`} value={settings.responsibleGamblingNote} onChange={e => set("responsibleGamblingNote", e.target.value)} />
        </motion.div>

        {/* Hero stats */}
        <StatsEditor />

        {/* NordVPN help text */}
        <NordVPNEditor />

        {/* Streamer role management */}
        <StreamerManager />
      </div>
    </div>
  );
}

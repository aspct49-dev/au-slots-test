"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Radio } from "lucide-react";

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
      </div>
    </div>
  );
}

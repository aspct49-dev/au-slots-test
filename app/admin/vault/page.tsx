"use client";

import { useState, useEffect } from "react";

export default function AdminVaultPage() {
  const [current, setCurrent] = useState("");
  const [max, setMax] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/vault")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setCurrent(String(data.currentAmount));
          setMax(String(data.maxAmount));
        }
      })
      .catch(() => {});
  }, []);

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/vault", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentAmount: Number(current), maxAmount: Number(max) }),
      });
      if (res.ok) setMsg("Saved!");
      else setMsg("Error saving.");
    } catch {
      setMsg("Error saving.");
    }
    setSaving(false);
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-black text-white mb-2">Vault Settings</h1>
      <p className="text-white/40 text-sm mb-8">Manually set the vault amounts. The public vault page updates live.</p>

      <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Current Amount ($)
          </label>
          <input
            type="number"
            value={current}
            onChange={e => setCurrent(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-lg focus:outline-none focus:border-[#fbbf24]/50 transition-colors"
            placeholder="0"
            min={0}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Target / Max Amount ($)
          </label>
          <input
            type="number"
            value={max}
            onChange={e => setMax(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-lg focus:outline-none focus:border-[#fbbf24]/50 transition-colors"
            placeholder="5000"
            min={1}
          />
        </div>

        {current && max && (
          <div className="bg-[#fbbf24]/5 border border-[#fbbf24]/20 rounded-xl p-3 text-center">
            <p className="text-[#fbbf24] font-black text-xl">
              {Math.min(100, (Number(current) / Number(max)) * 100).toFixed(1)}% full
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={saving || !current || !max}
            className="flex-1 py-3 rounded-xl bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-black text-sm tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Vault"}
          </button>
          <button
            onClick={async () => {
              if (!confirm("Reset vault to $0? This cannot be undone.")) return;
              setCurrent("0");
              setSaving(true);
              try {
                const res = await fetch("/api/admin/vault", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ currentAmount: 0, maxAmount: Number(max) || 5000 }),
                });
                if (res.ok) setMsg("Vault reset to $0!");
                else setMsg("Error resetting.");
              } catch {
                setMsg("Error resetting.");
              }
              setSaving(false);
            }}
            disabled={saving}
            className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-black text-sm tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>

        {msg && (
          <p className={`text-center text-sm font-bold ${msg.includes("Error") ? "text-red-400" : "text-[#00ff87]"}`}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, HelpCircle, TrendingUp, Target, Clock, Lock, Trophy, Users, DollarSign, Hash, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";
import { useAuth } from "@/context/AuthContext";
import type { Hunt, Guess } from "@/lib/huntStore";

interface HuntData {
  hunt: Hunt;
  totalGuesses: number;
  myGuess: Guess | null;
  winnerGuess: Guess | null;
}

function PageHeader() {
  return (
    <div className="relative py-12 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,191,36,0.1)_0%,transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(rgba(251,191,36,1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 mb-4">
            <Flame size={12} className="text-[#fbbf24]" />
            <span className="text-[#fbbf24] text-xs font-bold tracking-widest">PREDICT &amp; WIN</span>
          </div>
          <BubbleText className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4 text-[#fbbf24]/60">{"BONUS HUNTS"}</BubbleText>
          <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto">
            Guess the ending balance, get closest to win!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { icon: <Target size={22} />, title: "HUNT STARTS", description: "AUSlots opens bonus buys across multiple games. Starting balance is shown.", color: "#fbbf24" },
    { icon: <TrendingUp size={22} />, title: "MAKE YOUR PREDICTION", description: "Guess what the final balance will be when all bonuses are done. You can update your guess while entries are open.", color: "#00ff87" },
    { icon: <Clock size={22} />, title: "WATCH LIVE", description: "Tune in on Kick as the bonuses play out one by one.", color: "#60a5fa" },
    { icon: <Flame size={22} />, title: "CLOSEST WINS", description: "The guess closest to the actual ending balance wins!", color: "#f87171" },
  ];
  return (
    <section className="mb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 mb-6">
        <HelpCircle size={18} className="text-[#fbbf24]" />
        <h2 className="text-xl font-black text-white tracking-tight">HOW BONUS HUNTS WORK</h2>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step, i) => (
          <motion.div key={step.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
            className="relative p-5 rounded-2xl bg-[#111111] border border-white/[0.08] hover:border-white/15 transition-all overflow-hidden group"
          >
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: step.color }} />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${step.color}15`, color: step.color, border: `1px solid ${step.color}20` }}>
                {step.icon}
              </div>
              <div className="absolute top-4 right-4 text-4xl font-black opacity-10" style={{ color: step.color }}>{i + 1}</div>
              <h3 className="font-black text-xs tracking-widest mb-2" style={{ color: step.color }}>{step.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function BonusHuntPage() {
  const { isLoggedIn, user, openLoginModal } = useAuth();
  const [data, setData] = useState<HuntData | null>(null);
  const [loadingHunt, setLoadingHunt] = useState(true);
  const [guessInput, setGuessInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/hunt");
    if (res.ok) {
      const json = await res.json();
      setData(json ? json : null);
      if (json?.myGuess) setGuessInput(String(json.myGuess.guess));
    }
    setLoadingHunt(false);
  }, []);

  useEffect(() => { load(); const iv = setInterval(load, 15_000); return () => clearInterval(iv); }, [load]);

  const submitGuess = async () => {
    if (!isLoggedIn) { openLoginModal(); return; }
    const val = parseFloat(guessInput);
    if (isNaN(val) || val <= 0) { setSubmitMsg({ type: "error", text: "Enter a valid amount" }); return; }
    setSubmitting(true); setSubmitMsg(null);
    const res = await fetch("/api/hunt/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess: val }),
    });
    const json = await res.json();
    if (!res.ok) {
      setSubmitMsg({ type: "error", text: json.error ?? "Failed to submit" });
    } else {
      setSubmitMsg({ type: "success", text: json.updated ? "Guess updated!" : "Guess submitted!" });
      await load();
    }
    setSubmitting(false);
    setTimeout(() => setSubmitMsg(null), 4000);
  };

  const hunt = data?.hunt;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <PageHeader />
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-20">
        <HowItWorks />

        {/* ── Active / Closed / Ended hunt ── */}
        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white tracking-tight">
              {hunt ? (hunt.status === "ended" ? "HUNT RESULTS" : "ACTIVE HUNT") : "ACTIVE HUNTS"}
            </h2>
            {hunt && hunt.status !== "ended" && (
              <span className={`text-xs font-black tracking-widest uppercase ${hunt.status === "active" ? "text-[#00ff87]" : "text-yellow-400"}`}>
                {hunt.status === "active" ? "● Entries Open" : "🔒 Entries Closed"}
              </span>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {loadingHunt ? (
              <motion.div key="loading" className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin text-[#fbbf24]/40" />
              </motion.div>

            ) : !hunt ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 rounded-2xl bg-[#111111] border border-white/[0.06] text-center">
                <Flame size={40} className="text-[#fbbf24]/30 mx-auto mb-3" />
                <p className="text-white/60 font-bold">No active hunt right now</p>
                <p className="text-white/30 text-sm mt-1">Watch the stream — the next hunt will appear here when it starts!</p>
                <a href="https://kick.com/auslots" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-black text-sm rounded-xl transition-all">
                  WATCH LIVE
                </a>
              </motion.div>

            ) : hunt.status === "ended" ? (
              /* ── Results ── */
              <motion.div key="ended" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Winner card */}
                {data?.winnerGuess ? (
                  <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-2xl p-6 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-[#fbbf24]/20 flex items-center justify-center flex-shrink-0">
                      <Trophy size={28} className="text-[#fbbf24]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#fbbf24]/60 font-bold tracking-widest uppercase mb-0.5">Winner</p>
                      <p className="text-3xl font-black text-[#fbbf24]">{data.winnerGuess.username}</p>
                      <p className="text-white/50 text-sm mt-1">
                        Guessed <span className="text-white font-bold">${data.winnerGuess.guess.toLocaleString()}</span>
                        {" · "}Ending was <span className="text-white font-bold">${hunt.endingBalance?.toLocaleString()}</span>
                        {" · "}Off by <span className="text-[#fbbf24] font-bold">${Math.abs(data.winnerGuess.guess - (hunt.endingBalance ?? 0)).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 text-center text-white/40">
                    No guesses were submitted for this hunt.
                  </div>
                )}

                {/* Hunt summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Starting Balance", value: `$${hunt.startingBalance.toLocaleString()}`, color: "#fbbf24" },
                    { label: "Ending Balance", value: `$${hunt.endingBalance?.toLocaleString()}`, color: "#00ff87" },
                    { label: "Bonuses", value: hunt.numberOfBonuses, color: "#60a5fa" },
                    { label: "Total Guesses", value: data.totalGuesses, color: "#a78bfa" },
                  ].map(s => (
                    <div key={s.label} className="bg-[#111111] border border-white/[0.06] rounded-xl p-4 text-center">
                      <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-white/40 text-xs mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* My result */}
                {data?.myGuess && (
                  <div className={`rounded-xl p-4 border flex items-center gap-3 ${data.winnerGuess?.id === data.myGuess.id ? "bg-[#fbbf24]/10 border-[#fbbf24]/30" : "bg-[#111111] border-white/[0.06]"}`}>
                    {data.winnerGuess?.id === data.myGuess.id
                      ? <Trophy size={16} className="text-[#fbbf24]" />
                      : <CheckCircle size={16} className="text-white/30" />}
                    <span className="text-white/60 text-sm">
                      Your guess: <span className="text-white font-bold">${data.myGuess.guess.toLocaleString()}</span>
                      {" · "}Off by <span className="font-bold text-white/80">${Math.abs(data.myGuess.guess - (hunt.endingBalance ?? 0)).toLocaleString()}</span>
                    </span>
                  </div>
                )}
              </motion.div>

            ) : (
              /* ── Active / Closed — guessing UI ── */
              <motion.div key="active" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`grid gap-6 ${hunt.casinoElementsUrl ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-3"}`}>
                {/* Left: Hunt info + guess form */}
                <div className={`space-y-4 ${hunt.casinoElementsUrl ? "" : "lg:col-span-3"}`}>
                  <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-black text-white/60 uppercase tracking-widest">Hunt Info</h3>
                    {[
                      { icon: <DollarSign size={14} className="text-[#fbbf24]" />, label: "Starting Balance", value: `$${hunt.startingBalance.toLocaleString()}` },
                      { icon: <Hash size={14} className="text-[#60a5fa]" />, label: "Bonuses", value: hunt.numberOfBonuses },
                      { icon: <Users size={14} className="text-[#00ff87]" />, label: "Guesses So Far", value: data.totalGuesses },
                    ].map(r => (
                      <div key={r.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                        <div className="flex items-center gap-2 text-white/50 text-sm">{r.icon}{r.label}</div>
                        <span className="font-black text-white text-sm">{r.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6">
                    {hunt.status === "closed" ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                        <Lock size={32} className="text-yellow-400/60" />
                        <p className="text-yellow-400 font-black text-lg">Entries Are Closed</p>
                        <p className="text-white/40 text-sm max-w-xs">No more guesses can be submitted. Watch the hunt live to see who wins!</p>
                        {data?.myGuess && (
                          <p className="text-white/60 text-sm mt-2">
                            Your guess: <span className="text-white font-bold">${data.myGuess.guess.toLocaleString()}</span>
                          </p>
                        )}
                        <a href="https://kick.com/auslots" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-black text-sm rounded-xl transition-all">
                          WATCH LIVE
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-base font-black text-white mb-1">
                            {data?.myGuess ? "Update Your Guess" : "Submit Your Guess"}
                          </h3>
                          <p className="text-white/40 text-sm">What do you think the ending balance will be?</p>
                        </div>

                        {data?.myGuess && (
                          <div className="flex items-center gap-2 text-[#00ff87] text-sm font-semibold bg-[#00ff87]/5 border border-[#00ff87]/20 rounded-xl px-4 py-2.5">
                            <CheckCircle size={14} />
                            Current guess: ${data.myGuess.guess.toLocaleString()} — you can change it below
                          </div>
                        )}

                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                              type="number"
                              min={1}
                              value={guessInput}
                              onChange={e => setGuessInput(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && submitGuess()}
                              placeholder="e.g. 3500"
                              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#fbbf24]/40 transition-colors"
                            />
                          </div>
                          <button
                            onClick={submitGuess}
                            disabled={submitting || !guessInput}
                            className="flex items-center gap-2 px-6 py-3 bg-[#fbbf24] hover:bg-[#f59e0b] disabled:opacity-50 text-black font-black text-sm rounded-xl transition-all"
                          >
                            {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
                            {!isLoggedIn ? "LOG IN TO GUESS" : data?.myGuess ? "UPDATE" : "SUBMIT"}
                          </button>
                        </div>

                        <AnimatePresence>
                          {submitMsg && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className={`flex items-center gap-2 text-sm font-semibold ${submitMsg.type === "success" ? "text-[#00ff87]" : "text-red-400"}`}
                            >
                              {submitMsg.type === "success" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                              {submitMsg.text}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Casino Elements tracker */}
                {hunt.casinoElementsUrl && (
                  <div className="rounded-2xl overflow-hidden border border-white/[0.06]" style={{ minHeight: 500 }}>
                    <iframe
                      src={hunt.casinoElementsUrl}
                      className="w-full h-full"
                      style={{ border: "none", background: "#0a0a0a", minHeight: 500 }}
                      allowFullScreen
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>
    </div>
  );
}

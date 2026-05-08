"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Plus, Trophy, RotateCcw, ChevronRight, ChevronLeft } from "lucide-react";

type BracketSize = 4 | 8 | 16 | 32;
type Phase = "size" | "details" | "bracket";

interface Player {
  name: string;
  slot: string;
}

type WinnerSlot = "p1" | "p2" | null;

interface Match {
  id: string;
  player1: Player;
  player2: Player;
  mult1: string;
  mult2: string;
  winner: WinnerSlot;
  round: number;
  position: number;
}

const EMPTY_PLAYER: Player = { name: "", slot: "" };

// ── Layout constants ───────────────────────────────────────────────────────────
const ROW_H    = 56;               // taller row to fit name + slot subtitle
const FOOTER_H = 26;               // decide-winner footer
const CARD_H   = ROW_H * 2 + 2 + FOOTER_H;
const BASE_GAP = 14;
const SLOT_PX  = CARD_H + BASE_GAP;
const COL_W    = 220;
const COL_GAP  = 44;
const LABEL_H  = 30;
const WIN_H    = 64;

function padTop(r: number)   { return (SLOT_PX / 2) * (Math.pow(2, r) - 1); }
function gapBetween(r: number){ return SLOT_PX * Math.pow(2, r) - CARD_H; }

function cardCenterY(r: number, i: number) {
  return LABEL_H + padTop(r) + i * (CARD_H + gapBetween(r)) + CARD_H / 2;
}
function rowCenterY(r: number, i: number, row: 0 | 1) {
  const cardTop = LABEL_H + padTop(r) + i * (CARD_H + gapBetween(r));
  return row === 0
    ? cardTop + 1 + ROW_H / 2
    : cardTop + 1 + ROW_H + 1 + ROW_H / 2;
}

// ── Bracket data helpers ───────────────────────────────────────────────────────
function buildBracket(players: Player[]): Match[] {
  const matches: Match[] = [];
  const size = players.length;
  for (let i = 0; i < size / 2; i++)
    matches.push({
      id: `0-${i}`,
      player1: players[i*2] ?? EMPTY_PLAYER,
      player2: players[i*2+1] ?? EMPTY_PLAYER,
      mult1: "", mult2: "",
      winner: null, round: 0, position: i,
    });
  const totalRounds = Math.log2(size);
  for (let r = 1; r < totalRounds; r++) {
    const count = size / Math.pow(2, r + 1);
    for (let i = 0; i < count; i++)
      matches.push({
        id: `${r}-${i}`,
        player1: { ...EMPTY_PLAYER }, player2: { ...EMPTY_PLAYER },
        mult1: "", mult2: "",
        winner: null, round: r, position: i,
      });
  }
  return matches;
}

function advanceWinner(matches: Match[], matchId: string, which: "p1" | "p2"): Match[] {
  const updated = matches.map(m => m.id === matchId ? { ...m, winner: which as WinnerSlot } : m);
  const match   = updated.find(m => m.id === matchId)!;
  const winningPlayer = which === "p1" ? match.player1 : match.player2;
  const nextId  = `${match.round + 1}-${Math.floor(match.position / 2)}`;
  const next    = updated.find(m => m.id === nextId);
  if (!next) return updated;
  const first = match.position % 2 === 0;
  return updated.map(m => m.id === nextId
    ? { ...m,
        player1: first ? { ...winningPlayer } : m.player1,
        player2: first ? m.player2 : { ...winningPlayer },
      }
    : m);
}

function decideByMultiplier(matches: Match[], matchId: string): Match[] {
  const m = matches.find(x => x.id === matchId);
  if (!m) return matches;
  const a = parseFloat(m.mult1);
  const b = parseFloat(m.mult2);
  if (isNaN(a) || isNaN(b)) return matches;
  return advanceWinner(matches, matchId, a >= b ? "p1" : "p2");
}

function setMult(matches: Match[], matchId: string, which: 1 | 2, val: string): Match[] {
  return matches.map(m => m.id === matchId
    ? { ...m, [which === 1 ? "mult1" : "mult2"]: val } as Match
    : m);
}

function setPlayerField(matches: Match[], matchId: string, which: 1 | 2, field: keyof Player, val: string): Match[] {
  return matches.map(m => {
    if (m.id !== matchId) return m;
    const p = which === 1 ? m.player1 : m.player2;
    const updated = { ...p, [field]: val };
    return which === 1 ? { ...m, player1: updated } : { ...m, player2: updated };
  });
}

function getRoundLabel(round: number, totalRounds: number): string {
  const fromEnd = totalRounds - 1 - round;
  if (fromEnd === 0) return "Grand Final";
  if (fromEnd === 1) return "Semi Finals";
  if (fromEnd === 2) return "Quarter Finals";
  if (fromEnd === 3) return "Round of 16";
  return `Round ${round + 1}`;
}

// ── SVG wires ──────────────────────────────────────────────────────────────────
function BracketWires({ totalRounds }: { totalRounds: number }) {
  const svgW = (totalRounds + 1) * COL_W + totalRounds * COL_GAP + 4;
  const r0Cnt = Math.pow(2, totalRounds - 1);
  const svgH = LABEL_H + r0Cnt * CARD_H + (r0Cnt - 1) * BASE_GAP + 80;
  const S = "rgba(255,255,255,0.22)";

  const els: React.ReactNode[] = [];

  for (let r = 0; r < totalRounds; r++) {
    const xRight = r * (COL_W + COL_GAP) + COL_W;
    const xLeft1 = (r + 1) * (COL_W + COL_GAP);
    const xMid   = xRight + COL_GAP / 2;

    if (r < totalRounds - 1) {
      const numNext = Math.pow(2, totalRounds - 2 - r);
      for (let j = 0; j < numNext; j++) {
        const topY = cardCenterY(r, j * 2);
        const botY = cardCenterY(r, j * 2 + 1);
        const tgt0 = rowCenterY(r + 1, j, 0);
        const tgt1 = rowCenterY(r + 1, j, 1);

        els.push(
          <g key={`w-${r}-${j}`} stroke={S} strokeWidth={1.5} fill="none" strokeLinecap="square" strokeLinejoin="miter">
            <line x1={xRight} y1={topY} x2={xMid} y2={topY} />
            <line x1={xRight} y1={botY} x2={xMid} y2={botY} />
            <line x1={xMid} y1={topY} x2={xMid} y2={botY} />
            <polyline points={`${xMid},${topY} ${xMid},${tgt0} ${xLeft1},${tgt0}`} />
            <polyline points={`${xMid},${botY} ${xMid},${tgt1} ${xLeft1},${tgt1}`} />
          </g>
        );
      }
    } else {
      const finalY  = cardCenterY(r, 0);
      const winnerY = LABEL_H + padTop(totalRounds - 1) + CARD_H / 2;
      els.push(
        <line key="win" stroke={S} strokeWidth={1.5}
          x1={xRight} y1={finalY} x2={xLeft1} y2={winnerY} />
      );
    }
  }

  return (
    <svg className="absolute top-0 left-0 pointer-events-none" width={svgW} height={svgH}
      style={{ overflow: "visible" }}>
      {els}
    </svg>
  );
}

// ── Match card ─────────────────────────────────────────────────────────────────
function MatchCard({ match, onMultChange, onPlayerChange, onDecide, onReset }: {
  match: Match;
  onMultChange: (which: 1 | 2, val: string) => void;
  onPlayerChange: (which: 1 | 2, field: keyof Player, val: string) => void;
  onDecide: () => void;
  onReset: () => void;
}) {
  const ready = match.player1.name.trim() !== "" && match.player2.name.trim() !== "";
  const bothFilled = match.mult1.trim() !== "" && match.mult2.trim() !== ""
    && !isNaN(parseFloat(match.mult1)) && !isNaN(parseFloat(match.mult2));
  const canDecide = ready && bothFilled && !match.winner;
  const winnerName = match.winner === "p1" ? match.player1.name : match.winner === "p2" ? match.player2.name : null;

  const renderRow = (player: Player, mult: string, which: 1 | 2, isFirst: boolean) => {
    const isWinner = (which === 1 && match.winner === "p1") || (which === 2 && match.winner === "p2");
    const isLoser  = match.winner !== null && !isWinner;
    const initial  = player.name.trim() ? player.name.trim().charAt(0).toUpperCase() : "?";
    return (
      <div
        className={`flex items-center gap-2 px-2.5 transition-all
          ${isFirst ? "border-b border-white/[0.07]" : ""}
          ${isWinner ? "bg-[#00ff87]/10" : ""}
          ${isLoser ? "opacity-40" : ""}
        `}
        style={{ height: ROW_H }}
      >
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black border
          ${isWinner ? "bg-[#00ff87]/20 text-[#00ff87] border-[#00ff87]/30"
            : "bg-white/5 text-white/50 border-white/10"}`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <input
            value={player.name}
            onChange={e => onPlayerChange(which, "name", e.target.value)}
            placeholder="Name"
            className={`w-full bg-transparent border-0 p-0 text-sm font-bold focus:outline-none truncate
              ${isWinner ? "text-[#00ff87]" : "text-white/80 placeholder:text-white/25"}`}
          />
          <input
            value={player.slot}
            onChange={e => onPlayerChange(which, "slot", e.target.value)}
            placeholder="Slot"
            className="w-full bg-transparent border-0 p-0 text-[10px] text-white/55 placeholder:text-white/20 focus:outline-none truncate"
          />
        </div>
        <input
          type="text"
          inputMode="decimal"
          value={mult}
          onChange={e => onMultChange(which, e.target.value)}
          placeholder="0"
          className={`w-14 rounded-md px-1.5 py-1 text-xs placeholder:text-white/20 focus:outline-none transition-colors text-right flex-shrink-0
            ${isWinner ? "bg-[#00ff87]/15 border border-[#00ff87]/30 text-[#00ff87]"
              : isLoser ? "bg-red-500/10 border border-red-500/20 text-red-400/70"
              : "bg-[#1a1a1a] border border-white/10 text-white focus:border-[#00ff87]/40"}`}
        />
        {isWinner && <Trophy size={11} className="text-[#00ff87] flex-shrink-0" />}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-shrink-0 rounded-xl overflow-hidden"
      style={{
        width: COL_W,
        border: `1px solid ${match.winner ? "rgba(0,255,135,0.3)" : "rgba(255,255,255,0.07)"}`,
        background: "#111111",
      }}>
      {renderRow(match.player1, match.mult1, 1, true)}
      {renderRow(match.player2, match.mult2, 2, false)}
      <div style={{ height: FOOTER_H }} className="border-t border-white/[0.07]">
        {winnerName ? (
          <button
            onClick={onReset}
            title="Reset match"
            className="w-full h-full flex items-center justify-center gap-1 text-[10px] font-black tracking-widest text-[#00ff87]/70 hover:text-red-400/80 hover:bg-red-500/5 uppercase transition-all"
          >
            <Trophy size={10} /> {winnerName} <span className="opacity-40 ml-1">↺</span>
          </button>
        ) : canDecide ? (
          <button
            onClick={onDecide}
            className="w-full h-full bg-[#00ff87]/10 hover:bg-[#00ff87]/25 text-[#00ff87] text-[10px] font-black tracking-widest uppercase transition-all"
          >
            Decide Winner
          </button>
        ) : (
          <div className="h-full flex items-center justify-center text-[10px] tracking-widest text-white/20 uppercase">
            {ready ? "Enter multipliers" : "Awaiting players"}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AdminTournament() {
  const [phase, setPhase]         = useState<Phase>("size");
  const [size, setSize]           = useState<BracketSize>(8);
  const [players, setPlayers]     = useState<Player[]>(Array(8).fill(null).map(() => ({ name: "", slot: "" })));
  const [matches, setMatches]     = useState<Match[]>([]);
  const [tournamentName, setTournamentName] = useState("Slot Tournament");

  const handleSizeChange = (s: BracketSize) => {
    setSize(s);
    setPlayers(Array(s).fill(null).map(() => ({ name: "", slot: "" })));
  };

  const goToDetails = () => setPhase("details");

  const startTournament = () => {
    const filled = players.map((p, i) => ({
      name: p.name.trim() || `Player ${i + 1}`,
      slot: p.slot.trim(),
    }));
    setMatches(buildBracket(filled));
    setPhase("bracket");
  };

  const onMultChange = (id: string, which: 1 | 2, val: string) =>
    setMatches(prev => setMult(prev, id, which, val));

  const onPlayerChange = (id: string, which: 1 | 2, field: keyof Player, val: string) =>
    setMatches(prev => setPlayerField(prev, id, which, field, val));

  const onDecide = (id: string) =>
    setMatches(prev => decideByMultiplier(prev, id));

  const onReset = (id: string) =>
    setMatches(prev => prev.map(m => m.id === id ? { ...m, winner: null } : m));

  const reset = () => {
    setPhase("size");
    setMatches([]);
    setPlayers(Array(size).fill(null).map(() => ({ name: "", slot: "" })));
  };

  const totalRounds = Math.log2(size);
  const finalMatch  = matches.find(m => m.round === totalRounds - 1);
  const champion    = finalMatch?.winner === "p1" ? finalMatch.player1
                    : finalMatch?.winner === "p2" ? finalMatch.player2
                    : null;
  const rounds      = Array.from({ length: totalRounds }, (_, r) => matches.filter(m => m.round === r));
  const winnerTop   = padTop(totalRounds - 1) + CARD_H / 2 - WIN_H / 2;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Swords size={20} className="text-[#00ff87]" /> Tournament Bracket
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Single elimination — highest multiplier wins each match</p>
        </div>
        {phase === "bracket" && (
          <button onClick={reset} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 font-bold text-sm rounded-xl transition-all">
            <RotateCcw size={14} /> New Tournament
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {phase === "size" && (
          <motion.div key="size" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Tournament Name</label>
              <input value={tournamentName} onChange={e => setTournamentName(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00ff87]/40 transition-colors"
                placeholder="e.g. AUSlots Slot Tournament" />
            </div>
            <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Bracket Size</label>
              <div className="flex gap-3">
                {([4,8,16,32] as BracketSize[]).map(s => (
                  <button key={s} onClick={() => handleSizeChange(s)}
                    className={`flex-1 py-3 rounded-xl text-sm font-black tracking-wider transition-all ${size===s?"bg-[#00ff87] text-black":"bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-white/30 mt-3">{size} participants — {Math.log2(size)} rounds</p>
            </div>
            <button onClick={goToDetails} className="flex items-center gap-2 px-6 py-3 bg-[#00ff87] hover:bg-[#00e676] text-black font-black text-sm rounded-xl transition-all">
              Next: Add Participants <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {phase === "details" && (
          <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Participants & Slots</label>
                <span className="text-[11px] text-white/30">{size} players · enter name + slot they&apos;ll play</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {players.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-2.5">
                    <span className="text-xs text-white/30 font-black w-6 text-center flex-shrink-0">{i+1}</span>
                    <input
                      value={p.name}
                      onChange={e => { const n=[...players]; n[i] = { ...n[i], name: e.target.value }; setPlayers(n); }}
                      placeholder={`Player ${i+1}`}
                      className="flex-1 min-w-0 bg-transparent border-0 px-2 py-1.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
                    />
                    <span className="text-white/15 text-xs">·</span>
                    <input
                      value={p.slot}
                      onChange={e => { const n=[...players]; n[i] = { ...n[i], slot: e.target.value }; setPlayers(n); }}
                      placeholder="Slot game"
                      className="flex-1 min-w-0 bg-transparent border-0 px-2 py-1.5 text-xs text-white/70 placeholder:text-white/25 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPhase("size")} className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white/60 font-bold text-sm rounded-xl transition-all">
                <ChevronLeft size={16} /> Back
              </button>
              <button onClick={startTournament} className="flex items-center gap-2 px-6 py-3 bg-[#00ff87] hover:bg-[#00e676] text-black font-black text-sm rounded-xl transition-all">
                <Plus size={16} /> Create Bracket
              </button>
            </div>
          </motion.div>
        )}

        {phase === "bracket" && (
          <motion.div key="bracket" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <AnimatePresence>
              {champion && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-[#00ff87]/10 border border-[#00ff87]/30 rounded-2xl p-5 flex items-center gap-4">
                  <Trophy size={28} className="text-[#00ff87]" />
                  <div>
                    <p className="text-xs font-bold tracking-widest text-[#00ff87]/60 uppercase">Champion</p>
                    <p className="text-2xl font-black text-[#00ff87]">{champion.name}</p>
                    <p className="text-xs text-white/40">{champion.slot || tournamentName}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-xs text-white/30">Enter both multipliers, then click <span className="text-[#00ff87]/80 font-bold">Decide Winner</span> — the higher multiplier advances.</p>

            <div className="overflow-x-auto pb-6">
              <div className="relative inline-flex items-start" style={{ gap: 0 }}>
                <BracketWires totalRounds={totalRounds} />

                {rounds.map((roundMatches, r) => (
                  <div key={r} className="flex flex-col flex-shrink-0" style={{ width: COL_W, marginRight: COL_GAP }}>
                    <p className="text-[11px] font-black tracking-widest text-[#00ff87]/60 uppercase text-center whitespace-nowrap"
                      style={{ height: LABEL_H, lineHeight: `${LABEL_H}px` }}>
                      {getRoundLabel(r, totalRounds)}
                    </p>
                    <div className="flex flex-col" style={{ paddingTop: padTop(r), gap: gapBetween(r) }}>
                      {roundMatches.map(match => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onMultChange={(which, val) => onMultChange(match.id, which, val)}
                          onPlayerChange={(which, field, val) => onPlayerChange(match.id, which, field, val)}
                          onDecide={() => onDecide(match.id)}
                          onReset={() => onReset(match.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex flex-col flex-shrink-0" style={{ width: COL_W }}>
                  <p className="text-[11px] font-black tracking-widest text-[#00ff87]/60 uppercase text-center"
                    style={{ height: LABEL_H, lineHeight: `${LABEL_H}px` }}>
                    Winner
                  </p>
                  <div style={{ paddingTop: winnerTop }}>
                    <div className={`w-full rounded-xl border flex items-center justify-center px-4 ${champion ? "bg-[#00ff87]/10 border-[#00ff87]/40" : "bg-[#111111] border-white/[0.07]"}`}
                      style={{ height: WIN_H }}>
                      {champion ? (
                        <div className="flex items-center gap-2 min-w-0">
                          <Trophy size={14} className="text-[#00ff87] flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-black text-[#00ff87] truncate">{champion.name}</p>
                            {champion.slot && <p className="text-[10px] text-[#00ff87]/60 truncate">{champion.slot}</p>}
                          </div>
                        </div>
                      ) : (
                        <span className="text-white/25 text-sm italic">TBD</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Plus, Trophy, RotateCcw, ChevronRight } from "lucide-react";

type BracketSize = 4 | 8 | 16 | 32;

interface Match {
  id: string;
  player1: string;
  player2: string;
  winner: string | null;
  round: number;
  position: number;
}

// ── Layout constants ───────────────────────────────────────────────────────────
const ROW_H   = 40;               // px — height of each player row inside a card
const CARD_H  = ROW_H * 2 + 2;   // 82px — two rows + 1px divider + 1px outer border
const BASE_GAP = 14;              // gap between round-0 cards
const SLOT    = CARD_H + BASE_GAP;// 96px
const COL_W   = 192;
const COL_GAP = 40;
const LABEL_H = 30;               // label text row height (incl. margin)
const WIN_H   = 56;

function padTop(r: number)   { return (SLOT / 2) * (Math.pow(2, r) - 1); }
function gapBetween(r: number){ return SLOT * Math.pow(2, r) - CARD_H; }

/** Y-centre of match card (r, i) */
function cardCenterY(r: number, i: number) {
  return LABEL_H + padTop(r) + i * (CARD_H + gapBetween(r)) + CARD_H / 2;
}
/** Y-centre of player row 0 or 1 inside match (r, i) */
function rowCenterY(r: number, i: number, row: 0 | 1) {
  const cardTop = LABEL_H + padTop(r) + i * (CARD_H + gapBetween(r));
  return row === 0
    ? cardTop + 1 + ROW_H / 2          // top row centre (skip 1px card top border)
    : cardTop + 1 + ROW_H + 1 + ROW_H / 2; // bot row centre (skip divider)
}

// ── Bracket data helpers ───────────────────────────────────────────────────────
function buildBracket(players: string[]): Match[] {
  const matches: Match[] = [];
  const size = players.length;
  for (let i = 0; i < size / 2; i++)
    matches.push({ id: `0-${i}`, player1: players[i*2]??"TBD", player2: players[i*2+1]??"TBD", winner: null, round: 0, position: i });
  const totalRounds = Math.log2(size);
  for (let r = 1; r < totalRounds; r++) {
    const count = size / Math.pow(2, r + 1);
    for (let i = 0; i < count; i++)
      matches.push({ id: `${r}-${i}`, player1: "TBD", player2: "TBD", winner: null, round: r, position: i });
  }
  return matches;
}

function advanceWinner(matches: Match[], matchId: string, winner: string): Match[] {
  const updated = matches.map(m => m.id === matchId ? { ...m, winner } : m);
  const match   = updated.find(m => m.id === matchId)!;
  const nextId  = `${match.round + 1}-${Math.floor(match.position / 2)}`;
  const next    = updated.find(m => m.id === nextId);
  if (!next) return updated;
  const first   = match.position % 2 === 0;
  return updated.map(m => m.id === nextId
    ? { ...m, player1: first ? winner : m.player1, player2: first ? m.player2 : winner }
    : m);
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
    const xRight = r * (COL_W + COL_GAP) + COL_W;   // right edge of col r
    const xLeft1 = (r + 1) * (COL_W + COL_GAP);     // left edge of col r+1
    const xMid   = xRight + COL_GAP / 2;

    if (r < totalRounds - 1) {
      // Connect pairs of round-r matches → round-(r+1) match
      const numNext = Math.pow(2, totalRounds - 2 - r);
      for (let j = 0; j < numNext; j++) {
        // The two feeder matches
        const topY = cardCenterY(r, j * 2);
        const botY = cardCenterY(r, j * 2 + 1);
        // Target player rows in the next-round match
        const tgt0 = rowCenterY(r + 1, j, 0);  // top player row
        const tgt1 = rowCenterY(r + 1, j, 1);  // bot player row

        els.push(
          <g key={`w-${r}-${j}`} stroke={S} strokeWidth={1.5} fill="none" strokeLinecap="square" strokeLinejoin="miter">
            {/* Arm: right edge of top feeder → midX */}
            <line x1={xRight} y1={topY} x2={xMid} y2={topY} />
            {/* Arm: right edge of bot feeder → midX */}
            <line x1={xRight} y1={botY} x2={xMid} y2={botY} />
            {/* Vertical bar at midX spanning both feeders */}
            <line x1={xMid} y1={topY} x2={xMid} y2={botY} />
            {/* Output: midX → top player row of next match */}
            <polyline points={`${xMid},${topY} ${xMid},${tgt0} ${xLeft1},${tgt0}`} />
            {/* Output: midX → bot player row of next match */}
            <polyline points={`${xMid},${botY} ${xMid},${tgt1} ${xLeft1},${tgt1}`} />
          </g>
        );
      }
    } else {
      // Final → winner slot
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
function MatchCard({ match, onWinner }: { match: Match; onWinner: (w: string) => void }) {
  const canAdvance = match.player1 !== "TBD" && match.player2 !== "TBD" && !match.winner;
  return (
    <div className="flex flex-col flex-shrink-0 rounded-xl overflow-hidden"
      style={{
        width: COL_W,
        border: `1px solid ${match.winner ? "rgba(0,255,135,0.3)" : "rgba(255,255,255,0.07)"}`,
        background: "#111111",
      }}>
      {([match.player1, match.player2] as const).map((player, i) => (
        <button
          key={i}
          disabled={!canAdvance || player === "TBD"}
          onClick={() => canAdvance && player !== "TBD" && onWinner(player)}
          style={{ height: ROW_H }}
          className={`w-full text-left px-3 flex items-center justify-between group transition-all
            ${i === 0 ? "border-b border-white/[0.07]" : ""}
            ${match.winner === player ? "text-[#00ff87] bg-[#00ff87]/10" : "text-white/60"}
            ${canAdvance && player !== "TBD" ? "hover:bg-white/5 hover:text-white cursor-pointer" : "cursor-default"}
            ${player === "TBD" ? "text-white/25 italic" : ""}
          `}
        >
          <span className="text-sm font-semibold truncate pr-1">{player}</span>
          {match.winner === player && <Trophy size={11} className="text-[#00ff87] flex-shrink-0" />}
          {canAdvance && player !== "TBD" && match.winner !== player && (
            <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 text-white/40 flex-shrink-0 transition-all" />
          )}
        </button>
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AdminTournament() {
  const [phase, setPhase]               = useState<"setup"|"bracket">("setup");
  const [size, setSize]                 = useState<BracketSize>(8);
  const [playerNames, setPlayerNames]   = useState<string[]>(Array(8).fill(""));
  const [matches, setMatches]           = useState<Match[]>([]);
  const [tournamentName, setTournamentName] = useState("Slot Tournament");

  const handleSizeChange = (s: BracketSize) => { setSize(s); setPlayerNames(Array(s).fill("")); };
  const startTournament  = () => { setMatches(buildBracket(playerNames.map((n,i) => n.trim() || `Player ${i+1}`))); setPhase("bracket"); };
  const handleWinner     = (id: string, w: string) => setMatches(prev => advanceWinner(prev, id, w));
  const reset            = () => { setPhase("setup"); setMatches([]); setPlayerNames(Array(size).fill("")); };

  const totalRounds = Math.log2(size);
  const champion    = matches.find(m => m.round === totalRounds - 1)?.winner;
  const rounds      = Array.from({ length: totalRounds }, (_, r) => matches.filter(m => m.round === r));
  const winnerTop   = padTop(totalRounds - 1) + CARD_H / 2 - WIN_H / 2;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Swords size={20} className="text-[#00ff87]" /> Tournament Bracket
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Single elimination — up to 32 players</p>
        </div>
        {phase === "bracket" && (
          <button onClick={reset} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 font-bold text-sm rounded-xl transition-all">
            <RotateCcw size={14} /> New Tournament
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {phase === "setup" ? (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
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
            </div>
            <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Player Names</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {playerNames.map((name, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-white/30 w-5 text-right flex-shrink-0">{i+1}</span>
                    <input value={name} onChange={e => { const n=[...playerNames]; n[i]=e.target.value; setPlayerNames(n); }} placeholder={`Player ${i+1}`}
                      className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff87]/40 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
            <button onClick={startTournament} className="flex items-center gap-2 px-6 py-3 bg-[#00ff87] hover:bg-[#00e676] text-black font-black text-sm rounded-xl transition-all">
              <Plus size={16} /> Create Bracket
            </button>
          </motion.div>
        ) : (
          <motion.div key="bracket" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <AnimatePresence>
              {champion && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-[#00ff87]/10 border border-[#00ff87]/30 rounded-2xl p-5 flex items-center gap-4">
                  <Trophy size={28} className="text-[#00ff87]" />
                  <div>
                    <p className="text-xs font-bold tracking-widest text-[#00ff87]/60 uppercase">Champion</p>
                    <p className="text-2xl font-black text-[#00ff87]">{champion}</p>
                    <p className="text-xs text-white/40">{tournamentName}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-xs text-white/30">Click a player name to advance them to the next round.</p>

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
                        <MatchCard key={match.id} match={match} onWinner={w => handleWinner(match.id, w)} />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Winner column */}
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
                          <span className="text-sm font-black text-[#00ff87] truncate">{champion}</span>
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

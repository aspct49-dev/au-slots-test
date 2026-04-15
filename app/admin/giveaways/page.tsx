"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Play, StopCircle, Shuffle, CheckCircle, MessageSquare, Users, Trash2, Wifi, WifiOff } from "lucide-react";

interface ChatMessage { username: string; message: string; timestamp: number; }
interface Entry { username: string; enteredAt: number; }

const KICK_CHANNEL    = process.env.NEXT_PUBLIC_KICK_CHANNEL ?? "auslots";
const KICK_CHATROOM_ID = process.env.NEXT_PUBLIC_KICK_CHATROOM_ID
  ? parseInt(process.env.NEXT_PUBLIC_KICK_CHATROOM_ID, 10)
  : null;
const PUSHER_KEY = "32cbd69e4b950bf97679";

export default function AdminGiveaways() {
  const [keyword, setKeyword]             = useState("!enter");
  const [isListening, setIsListening]     = useState(false);
  const [entries, setEntries]             = useState<Entry[]>([]);
  const [winner, setWinner]               = useState<string | null>(null);
  const [winnerMessages, setWinnerMessages] = useState<ChatMessage[]>([]);
  const [isSpinning, setIsSpinning]       = useState(false);
  const [spinDisplay, setSpinDisplay]     = useState("");
  const [wsStatus, setWsStatus]           = useState<"disconnected" | "connecting" | "connected" | "error">("disconnected");

  // Refs so WebSocket handler always reads current values (avoids stale closure)
  const isListeningRef = useRef(false);
  const keywordRef     = useRef("!enter");
  const winnerRef      = useRef<string | null>(null);
  const wsRef          = useRef<WebSocket | null>(null);
  const spinRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatroomIdRef  = useRef<number | null>(null);

  // Keep refs in sync with state
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { keywordRef.current = keyword; }, [keyword]);
  useEffect(() => { winnerRef.current = winner; }, [winner]);

  // ── Chat connection ──────────────────────────────────────────────────────────
  const connectChat = useCallback(async (): Promise<boolean> => {
    if (wsRef.current) return true; // already connected
    setWsStatus("connecting");

    // Use hardcoded chatroom ID if available, otherwise fetch via proxy
    if (!chatroomIdRef.current) {
      if (KICK_CHATROOM_ID) {
        chatroomIdRef.current = KICK_CHATROOM_ID;
      } else {
        try {
          const res  = await fetch(`/api/kick/chatroom?channel=${encodeURIComponent(KICK_CHANNEL)}`);
          const data = await res.json();
          if (!data.chatroomId) { setWsStatus("error"); return false; }
          chatroomIdRef.current = data.chatroomId;
        } catch {
          setWsStatus("error");
          return false;
        }
      }
    }

    const roomId = chatroomIdRef.current;
    const ws = new WebSocket(
      `wss://ws-us2.pusher.com/app/${PUSHER_KEY}?protocol=7&client=js&version=7.4.0&flash=false`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus("connected");
      ws.send(JSON.stringify({
        event: "pusher:subscribe",
        data:  { channel: `chatrooms.${roomId}.v2` },
      }));
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.event !== "App\\Events\\ChatMessageEvent") return;

        const data     = JSON.parse(msg.data);
        const username: string = data?.sender?.username ?? data?.sender?.slug ?? "";
        const text: string     = data?.content ?? "";
        if (!username || !text) return;

        const chatMsg: ChatMessage = { username, message: text, timestamp: Date.now() };

        // Track winner messages — uses ref so it's always current
        if (winnerRef.current && username.toLowerCase() === winnerRef.current.toLowerCase()) {
          setWinnerMessages(p => [chatMsg, ...p].slice(0, 50));
        }

        // Keyword entry — uses refs to avoid stale closure
        if (
          isListeningRef.current &&
          text.trim().toLowerCase() === keywordRef.current.trim().toLowerCase()
        ) {
          setEntries(prev => {
            if (prev.some(en => en.username.toLowerCase() === username.toLowerCase())) return prev;
            return [...prev, { username, enteredAt: Date.now() }];
          });
        }
      } catch { /* ignore malformed */ }
    };

    ws.onerror = () => setWsStatus("error");
    ws.onclose = () => {
      setWsStatus("disconnected");
      wsRef.current = null;
    };

    return true;
  }, []);

  const disconnectChat = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setWsStatus("disconnected");
    setIsListening(false);
  }, []);

  const startListening = async () => {
    if (wsStatus !== "connected") {
      const ok = await connectChat();
      if (!ok) return; // don't start listening if connection failed
    }
    setIsListening(true);
  };

  const stopListening = () => setIsListening(false);

  // ── Spinner ──────────────────────────────────────────────────────────────────
  const spin = () => {
    if (entries.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setWinner(null);
    setWinnerMessages([]);
    const names    = entries.map(e => e.username);
    let ticks      = 0;
    const maxTicks = 40 + Math.floor(Math.random() * 20);
    if (spinRef.current) clearInterval(spinRef.current);
    spinRef.current = setInterval(() => {
      setSpinDisplay(names[Math.floor(Math.random() * names.length)]);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(spinRef.current!);
        const picked = names[Math.floor(Math.random() * names.length)];
        setSpinDisplay(picked);
        setWinner(picked);
        setIsSpinning(false);
      }
    }, 80);
  };

  // Cleanup on unmount
  useEffect(() => () => {
    spinRef.current && clearInterval(spinRef.current);
    disconnectChat();
  }, [disconnectChat]);

  const STATUS_COLOR = { disconnected: "text-white/30", connecting: "text-yellow-400", connected: "text-[#00ff87]", error: "text-red-400" };
  const STATUS_LABEL = { disconnected: "Disconnected", connecting: "Connecting…", connected: "Live", error: "Connection Error" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Gift size={20} className="text-[#00ff87]" /> Giveaway Spinner
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Collect entries from Kick chat and spin a winner</p>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-bold ${STATUS_COLOR[wsStatus]}`}>
          {wsStatus === "connected" ? <Wifi size={13} /> : <WifiOff size={13} />}
          {STATUS_LABEL[wsStatus]}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-black text-white/60 uppercase tracking-widest">Setup</h2>

            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5">Entry Keyword</label>
              <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                disabled={isListening}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00ff87]/40 transition-colors disabled:opacity-40"
                placeholder="!enter"
              />
              <p className="text-[11px] text-white/30 mt-1.5">Viewers type this in Kick chat to enter</p>
            </div>

            <div className="flex flex-col gap-2">
              {!isListening ? (
                <button
                  onClick={startListening}
                  disabled={wsStatus === "connecting"}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#00ff87] hover:bg-[#00e676] disabled:opacity-50 text-black font-bold text-sm rounded-xl transition-all"
                >
                  <Play size={14} />
                  {wsStatus === "connecting" ? "Connecting…" : "Start Collecting"}
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="flex items-center justify-center gap-2 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-sm rounded-xl transition-all border border-red-500/30"
                >
                  <StopCircle size={14} /> Stop Collecting
                </button>
              )}
              {wsStatus === "connected" && !isListening && (
                <button
                  onClick={disconnectChat}
                  className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-white/40 font-semibold text-sm rounded-xl transition-all"
                >
                  <WifiOff size={14} /> Disconnect
                </button>
              )}
              {wsStatus === "error" && (
                <button
                  onClick={connectChat}
                  className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-red-400 font-semibold text-sm rounded-xl transition-all"
                >
                  <Wifi size={14} /> Retry Connection
                </button>
              )}
            </div>

            <div className="border-t border-white/[0.06] pt-4 flex flex-col gap-2">
              <button
                onClick={spin}
                disabled={entries.length === 0 || isSpinning}
                className="flex items-center justify-center gap-2 py-3 bg-[#00ff87]/10 hover:bg-[#00ff87]/20 disabled:opacity-30 text-[#00ff87] font-black text-sm rounded-xl transition-all border border-[#00ff87]/20 hover:border-[#00ff87]/40"
              >
                <Shuffle size={15} /> SPIN ({entries.length} {entries.length === 1 ? "entry" : "entries"})
              </button>
              <button
                onClick={() => { setEntries([]); setWinner(null); setWinnerMessages([]); setSpinDisplay(""); }}
                className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 text-white/30 font-semibold text-xs rounded-xl transition-all"
              >
                <Trash2 size={12} /> Clear All
              </button>
            </div>
          </div>

          {/* Entries list */}
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                <Users size={13} /> Entries
              </h2>
              <span className="text-xs font-bold text-[#00ff87]">{entries.length}</span>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
              {entries.length === 0 ? (
                <p className="text-white/20 text-xs text-center py-4">No entries yet</p>
              ) : (
                entries.map((e, i) => (
                  <div key={e.username} className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-white/5">
                    <span className="text-xs text-white/70">{e.username}</span>
                    <span className="text-[10px] text-white/30">#{i + 1}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Spinner + Winner */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px]">
            {isSpinning || spinDisplay ? (
              <motion.div
                key={spinDisplay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-3xl font-black tracking-tight ${isSpinning ? "text-white/60" : "text-[#00ff87]"}`}
              >
                {spinDisplay}
              </motion.div>
            ) : (
              <p className="text-white/20 text-sm">Add entries and press SPIN</p>
            )}
            {isSpinning && (
              <div className="mt-4 w-8 h-1 bg-[#00ff87]/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#00ff87] rounded-full"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
                />
              </div>
            )}
          </div>

          <AnimatePresence>
            {winner && !isSpinning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#00ff87]/10 border border-[#00ff87]/30 rounded-2xl p-5 flex items-center gap-4"
              >
                <CheckCircle size={28} className="text-[#00ff87] flex-shrink-0" />
                <div>
                  <p className="text-xs text-[#00ff87]/60 font-bold tracking-widest uppercase mb-0.5">Winner</p>
                  <p className="text-2xl font-black text-[#00ff87]">{winner}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {winner && (
            <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
              <h2 className="text-sm font-black text-white/60 uppercase tracking-widest flex items-center gap-2 mb-3">
                <MessageSquare size={13} className="text-[#00ff87]" />
                {winner}&apos;s Messages
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                {winnerMessages.length === 0 ? (
                  <p className="text-white/20 text-xs text-center py-4">Waiting for {winner} to send a message…</p>
                ) : (
                  winnerMessages.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-2 p-2.5 bg-[#1a1a1a] rounded-xl">
                      <span className="text-[#00ff87] font-bold text-xs shrink-0">{m.username}:</span>
                      <span className="text-white/70 text-xs break-all">{m.message}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

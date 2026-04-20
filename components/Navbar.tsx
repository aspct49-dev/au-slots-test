"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
  Coins,
  Youtube,
  Instagram,
  Shield,
  ClipboardList,
  Tv2,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const socialLinks = [
  {
    name: "Kick",
    href: "https://kick.com/auslots",
    icon: (
      <Image src="/images/kick-logo.png" alt="Kick" width={16} height={16} className="object-contain" />
    ),
    color: "#53fc18",
  },
  {
    name: "X / Twitter",
    href: "https://x.com/AuslotsOfficial",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "#e7e7e7",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@auslots",
    icon: <Youtube size={16} />,
    color: "#ff0000",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/ausofficialhq",
    icon: <Instagram size={16} />,
    color: "#e1306c",
  },
  {
    name: "Snapchat",
    href: "https://www.snapchat.com/@theausofficial",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C7 2 4 5.5 4 9v.5c-.5.2-1.5.7-1.5 1.5 0 .7.5 1 1 1.2-.2.4-.5 1.3-1.5 1.8-.5.2-.5 1 0 1.2 1.5.5 2.5 1.5 3 2.3.5.8 1 1.5 4 1.5.5 0 1 .5 1.5 1H12h1c.5-.5 1-1 1.5-1 3 0 3.5-.7 4-1.5.5-.8 1.5-1.8 3-2.3.5-.2.5-1 0-1.2-1-.5-1.3-1.4-1.5-1.8.5-.2 1-.5 1-1.2 0-.8-1-1.3-1.5-1.5V9c0-3.5-3-7-8-7z" />
      </svg>
    ),
    color: "#fffc00",
  },
];

const helpLinks = [
  {
    name: "How to Deposit",
    href: "https://www.youtube.com/watch?v=gbZ1R7Ru3G0",
    icon: "💰",
  },
  {
    name: "How to Withdraw",
    href: "https://www.youtube.com/watch?v=TgdfXKQ5PQw",
    icon: "🏦",
  },
  {
    name: "NordVPN: Access certain websites",
    href: "https://nordvpn.com/?srsltid=AfmBOorQ9Bu1OI60eC6bnj0-U9_LPTYWtsOrvYdaA-q484Xkm0flDeIM",
    icon: "🔒",
  },
];

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "SOCIALS", href: "#", dropdown: "socials" },
  { name: "HELP", href: "#", dropdown: "help" },
  { name: "REVIEWS", href: "/reviews" },
  { name: "STORE", href: "/points-shop" },
  { name: "HUNTS", href: "/bonus-hunt" },
  { name: "RAFFLES", href: "/raffles" },
  { name: "VAULT", href: "/vault" },
];

const ADMIN_USERNAMES = (process.env.NEXT_PUBLIC_ADMIN_USERNAMES ?? "auslots")
  .split(",").map(u => u.trim().toLowerCase());

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoggedIn, openLoginModal, logout } = useAuth();
  const isAdmin = isLoggedIn && ADMIN_USERNAMES.includes(user?.username?.toLowerCase() ?? "");
  const [isStreamer, setIsStreamer] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const socialsRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const KICK_CHANNEL = process.env.NEXT_PUBLIC_KICK_CHANNEL ?? "auslots";

  const checkLive = useCallback(async () => {
    try {
      const res = await fetch(`https://kick.com/api/v2/channels/${KICK_CHANNEL}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return;
      const data = await res.json();
      setIsLive(!!data?.livestream);
    } catch {
      // silently ignore
    }
  }, [KICK_CHANNEL]);

  useEffect(() => {
    checkLive();
    const interval = setInterval(checkLive, 60_000); // re-check every 60s
    return () => clearInterval(interval);
  }, [checkLive]);

  useEffect(() => {
    if (!isLoggedIn || isAdmin) { setIsStreamer(false); return; }
    fetch("/api/admin/streamers")
      .then(r => r.ok ? r.json() : [])
      .then((list: string[]) => setIsStreamer(list.includes(user?.username?.toLowerCase() ?? "")))
      .catch(() => {});
  }, [isLoggedIn, isAdmin, user?.username]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (socialsRef.current && !socialsRef.current.contains(e.target as Node)) {
        setSocialsOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="AUSlots"
                width={96}
                height={96}
                className="rounded-xl transition-transform group-hover:scale-110"
              />
              <span className="font-black text-lg tracking-widest text-white group-hover:text-[#00ff87] transition-colors">
                AUSLOTS
              </span>
            </Link>

            {/* Center nav - desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.dropdown === "socials" ? (
                  <div key={link.name} ref={socialsRef} className="relative">
                    <button
                      onClick={() => { setSocialsOpen(!socialsOpen); setHelpOpen(false); }}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold tracking-widest transition-all duration-200 ${
                        socialsOpen
                          ? "text-[#00ff87] bg-[#00ff87]/10"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.name}
                      <ChevronDown size={12} className={`transition-transform duration-200 ${socialsOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {socialsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                        >
                          {socialLinks.map((social) => (
                            <a
                              key={social.name}
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setSocialsOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group/social"
                            >
                              <span style={{ color: social.color }} className="opacity-80 group-hover/social:opacity-100 transition-opacity">
                                {social.icon}
                              </span>
                              <span className="text-sm font-medium text-white/70 group-hover/social:text-white transition-colors">
                                {social.name}
                              </span>
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : link.dropdown === "help" ? (
                  <div key={link.name} ref={helpRef} className="relative">
                    <button
                      onClick={() => { setHelpOpen(!helpOpen); setSocialsOpen(false); }}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold tracking-widest transition-all duration-200 ${
                        helpOpen
                          ? "text-[#00ff87] bg-[#00ff87]/10"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.name}
                      <ChevronDown size={12} className={`transition-transform duration-200 ${helpOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {helpOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                        >
                          {helpLinks.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setHelpOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group/help"
                            >
                              <span className="text-base">{item.icon}</span>
                              <span className="text-sm font-medium text-white/70 group-hover/help:text-white transition-colors">
                                {item.name}
                              </span>
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-xs font-bold tracking-widest transition-all duration-200 ${
                      pathname === link.href
                        ? "text-[#00ff87] bg-[#00ff87]/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Schedule icon */}
              <Link href="/#schedule" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-[#00ff87]/30 hover:bg-[#00ff87]/10 transition-all duration-200 group">
                <CalendarDays size={16} className="text-white/40 group-hover:text-[#00ff87] transition-colors" />
              </Link>
              {/* Live button — always visible, glows when streaming */}
              <a
                href="https://kick.com/auslots"
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${
                  isLive
                    ? "bg-[#00ff87]/15 border-[#00ff87]/50 hover:bg-[#00ff87]/25"
                    : "bg-white/[0.03] border-white/10 hover:border-white/20"
                }`}
                style={isLive ? { boxShadow: "0 0 12px rgba(0,255,135,0.4), 0 0 28px rgba(0,255,135,0.15)" } : {}}
              >
                <div className="relative w-2 h-2 flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${isLive ? "bg-[#00ff87]" : "bg-white/25"}`} />
                  {isLive && <div className="absolute inset-0 rounded-full bg-[#00ff87] animate-ping opacity-70" />}
                </div>
                <span className={`text-xs font-bold tracking-wider transition-all duration-500 ${
                  isLive ? "text-[#00ff87] drop-shadow-[0_0_6px_rgba(0,255,135,0.9)]" : "text-white/30"
                }`}>
                  {isLive ? "LIVE NOW" : "OFFLINE"}
                </span>
              </a>

              {/* Auth */}
              {isLoggedIn ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1a1a1a] border border-white/10 hover:border-[#00ff87]/30 transition-all duration-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#00ff87]/20 flex items-center justify-center text-xs font-bold text-[#00ff87]">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-xs font-bold text-white leading-none">
                        {user?.username?.slice(0, 12)}
                      </span>
                      <span className="text-[10px] text-[#00ff87] font-semibold leading-none mt-0.5">
                        {user?.points?.toLocaleString()} PTS
                      </span>
                    </div>
                    <ChevronDown size={12} className="text-white/40" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-bold text-white">{user?.username}</p>
                          <p className="text-xs text-[#00ff87] font-semibold mt-0.5">
                            {user?.points?.toLocaleString()} points
                          </p>
                        </div>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 hover:bg-[#00ff87]/5 transition-colors text-sm text-[#00ff87] hover:text-[#00ff87] border-b border-white/5"
                          >
                            <Shield size={14} />
                            Admin Panel
                          </Link>
                        )}
                        {isStreamer && (
                          <Link
                            href="/admin/bonus-hunt"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 hover:bg-[#a78bfa]/5 transition-colors text-sm text-[#a78bfa] hover:text-[#a78bfa] border-b border-white/5"
                          >
                            <Tv2 size={14} />
                            Streamer Panel
                          </Link>
                        )}
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white border-b border-white/5"
                        >
                          <ClipboardList size={14} />
                          My Dashboard
                        </Link>
                        <Link
                          href="/points-shop"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white"
                        >
                          <Coins size={14} />
                          Points Shop
                        </Link>
                        <button
                          onClick={async () => { await logout(); setUserMenuOpen(false); }}
                          className="flex items-center gap-2 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-red-400 hover:text-red-300 w-full"
                        >
                          <LogOut size={14} />
                          Log Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="px-4 py-2 rounded-xl bg-[#00ff87] hover:bg-[#00e676] text-black font-bold text-xs tracking-widest transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,135,0.4)]"
                >
                  LOG IN
                </button>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#0a0a0a] border-b border-white/10 overflow-hidden lg:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) =>
                link.dropdown === "socials" ? (
                  <div key={link.name}>
                    <button
                      onClick={() => setSocialsOpen(!socialsOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                      {link.name}
                      <ChevronDown size={14} className={`transition-transform ${socialsOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {socialsOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-4 mt-1 space-y-1">
                          {socialLinks.map((s) => (
                            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
                              <span style={{ color: s.color }}>{s.icon}</span>
                              <span className="text-sm text-white/60 hover:text-white transition-colors">{s.name}</span>
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : link.dropdown === "help" ? (
                  <div key={link.name}>
                    <button
                      onClick={() => setHelpOpen(!helpOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                      {link.name}
                      <ChevronDown size={14} className={`transition-transform ${helpOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {helpOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-4 mt-1 space-y-1">
                          {helpLinks.map((item) => (
                            <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
                              <span className="text-base">{item.icon}</span>
                              <span className="text-sm text-white/60 hover:text-white transition-colors">{item.name}</span>
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold tracking-wider transition-all ${
                      pathname === link.href
                        ? "text-[#00ff87] bg-[#00ff87]/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              )}
              <div className="pt-2 border-t border-white/10">
                <a
                  href="https://kick.com/auslots"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-500 ${
                    isLive
                      ? "bg-[#00ff87]/10 border-[#00ff87]/30"
                      : "bg-white/[0.02] border-white/10"
                  }`}
                  style={isLive ? { boxShadow: "0 0 10px rgba(0,255,135,0.2)" } : {}}
                >
                  <div className="relative w-2 h-2">
                    <div className={`w-2 h-2 rounded-full ${isLive ? "bg-[#00ff87]" : "bg-white/25"}`} />
                    {isLive && <div className="absolute inset-0 rounded-full bg-[#00ff87] animate-ping opacity-75" />}
                  </div>
                  <span className={`text-sm font-bold tracking-wider ${isLive ? "text-[#00ff87] drop-shadow-[0_0_6px_rgba(0,255,135,0.8)]" : "text-white/30"}`}>
                    {isLive ? "LIVE ON KICK" : "OFFLINE"}
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

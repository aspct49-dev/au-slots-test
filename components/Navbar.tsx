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
  Twitch,
  Youtube,
  Instagram,
  Facebook,
  Shield,
  ClipboardList,
  Tv2,
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
    name: "Twitch",
    href: "https://www.twitch.tv/auslots/",
    icon: <Twitch size={16} />,
    color: "#9146ff",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@auslots?sub_confirmation=1",
    icon: <Youtube size={16} />,
    color: "#ff0000",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/auslotsofficial/",
    icon: <Instagram size={16} />,
    color: "#e1306c",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/AuslotsOfficial/",
    icon: <Facebook size={16} />,
    color: "#1877f2",
  },
  {
    name: "Snapchat",
    href: "https://www.snapchat.com/add/aussieslots",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C7 2 4 5.5 4 9v.5c-.5.2-1.5.7-1.5 1.5 0 .7.5 1 1 1.2-.2.4-.5 1.3-1.5 1.8-.5.2-.5 1 0 1.2 1.5.5 2.5 1.5 3 2.3.5.8 1 1.5 4 1.5.5 0 1 .5 1.5 1H12h1c.5-.5 1-1 1.5-1 3 0 3.5-.7 4-1.5.5-.8 1.5-1.8 3-2.3.5-.2.5-1 0-1.2-1-.5-1.3-1.4-1.5-1.8.5-.2 1-.5 1-1.2 0-.8-1-1.3-1.5-1.5V9c0-3.5-3-7-8-7z" />
      </svg>
    ),
    color: "#fffc00",
  },
  {
    name: "Discord",
    href: "https://discord.gg/auslots",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.04.033.051a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    color: "#5865f2",
  },
];

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "SOCIALS", href: "#", dropdown: true },
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const socialsRef = useRef<HTMLDivElement>(null);
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
                width={36}
                height={36}
                className="rounded-xl transition-transform group-hover:scale-110"
              />
              <span className="font-black text-lg tracking-widest text-white group-hover:text-[#00ff87] transition-colors">
                AUSLOTS
              </span>
            </Link>

            {/* Center nav - desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.name} ref={socialsRef} className="relative">
                    <button
                      onClick={() => setSocialsOpen(!socialsOpen)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold tracking-widest transition-all duration-200 ${
                        socialsOpen
                          ? "text-[#00ff87] bg-[#00ff87]/10"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${socialsOpen ? "rotate-180" : ""}`}
                      />
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
                link.dropdown ? (
                  <div key={link.name}>
                    <button
                      onClick={() => setSocialsOpen(!socialsOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                      {link.name}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${socialsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {socialsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden ml-4 mt-1 space-y-1"
                        >
                          {socialLinks.map((s) => (
                            <a
                              key={s.name}
                              href={s.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                            >
                              <span style={{ color: s.color }}>{s.icon}</span>
                              <span className="text-sm text-white/60 hover:text-white transition-colors">
                                {s.name}
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

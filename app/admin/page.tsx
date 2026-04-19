"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  Ticket,
  Calendar,
  Gift,
  Swords,
  Users,
  Settings,
  ArrowRight,
  Activity,
  Lock,
} from "lucide-react";
import { reviews } from "@/lib/reviewsData";

const cards = [
  {
    label: "Reviews",
    value: reviews.length,
    sub: "slot reviews published",
    href: "/admin/reviews",
    icon: Star,
    color: "#fbbf24",
  },
  {
    label: "Points Shop",
    value: 8,
    sub: "items in store",
    href: "/admin/shop",
    icon: ShoppingBag,
    color: "#00ff87",
  },
  {
    label: "Raffles",
    value: "–",
    sub: "active raffles",
    href: "/admin/raffles",
    icon: Ticket,
    color: "#a78bfa",
  },
  {
    label: "Giveaways",
    value: "–",
    sub: "running giveaways",
    href: "/admin/giveaways",
    icon: Gift,
    color: "#f472b6",
  },
  {
    label: "Schedule",
    value: 7,
    sub: "days configured",
    href: "/admin/schedule",
    icon: Calendar,
    color: "#38bdf8",
  },
  {
    label: "Tournament",
    value: "–",
    sub: "active bracket",
    href: "/admin/tournament",
    icon: Swords,
    color: "#00ff87",
  },
  {
    label: "Users",
    value: "–",
    sub: "points lookup",
    href: "/admin/users",
    icon: Users,
    color: "#60a5fa",
  },
];

const quickActions = [
  { label: "Add Slot Review",    href: "/admin/reviews",    icon: Star },
  { label: "Create Raffle",      href: "/admin/raffles",    icon: Ticket },
  { label: "New Giveaway",       href: "/admin/giveaways",  icon: Gift },
  { label: "Vault",              href: "/admin/vault",      icon: Lock },
  { label: "New Tournament",     href: "/admin/tournament", icon: Swords },
  { label: "Update Schedule",    href: "/admin/schedule",   icon: Calendar },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Activity size={18} className="text-[#00ff87]" />
          <h1 className="text-2xl font-black text-white tracking-tight">Dashboard</h1>
        </div>
        <p className="text-white/40 text-sm">Welcome back. Here's what's going on.</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, value, sub, href, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              href={href}
              className="group block bg-[#111111] border border-white/[0.06] rounded-2xl p-4 hover:border-white/20 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
                <ArrowRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors mt-1" />
              </div>
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-[11px] text-white/40 mt-0.5">{sub}</p>
              <p className="text-xs font-bold text-white/60 mt-2">{label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-sm font-black tracking-widest text-white/40 uppercase mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-4 py-3 bg-[#111111] border border-white/[0.06] rounded-xl hover:bg-[#00ff87]/5 hover:border-[#00ff87]/20 hover:text-[#00ff87] text-white/60 text-sm font-semibold transition-all group"
            >
              <Icon size={15} className="group-hover:text-[#00ff87] text-white/30 transition-colors" />
              {label}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Settings shortcut */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Link
          href="/admin/settings"
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <Settings size={13} />
          Site Settings
        </Link>
      </motion.div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Star,
  ShoppingBag,
  Ticket,
  Calendar,
  Users,
  Settings,
  Gift,
  Swords,
  ChevronRight,
  Menu,
  X,
  Shield,
  ClipboardList,
  Flame,
} from "lucide-react";

const ADMIN_USERNAMES = (process.env.NEXT_PUBLIC_ADMIN_USERNAMES ?? "auslots")
  .split(",")
  .map((u) => u.trim().toLowerCase());

const navItems = [
  { label: "Dashboard",    href: "/admin",             icon: LayoutDashboard },
  { label: "Reviews",      href: "/admin/reviews",     icon: Star },
  { label: "Points Shop",  href: "/admin/shop",        icon: ShoppingBag },
  { label: "Redemptions",  href: "/admin/redemptions", icon: ClipboardList },
  { label: "Bonus Hunt",   href: "/admin/bonus-hunt",  icon: Flame },
  { label: "Raffles",      href: "/admin/raffles",     icon: Ticket },
  { label: "Giveaways",    href: "/admin/giveaways",   icon: Gift },
  { label: "Schedule",     href: "/admin/schedule",    icon: Calendar },
  { label: "Tournament",   href: "/admin/tournament",  icon: Swords },
  { label: "Users",        href: "/admin/users",       icon: Users },
  { label: "Settings",     href: "/admin/settings",    icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, isLoading, openLoginModal } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = isLoggedIn && ADMIN_USERNAMES.includes(user?.username?.toLowerCase() ?? "");

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      if (!isLoggedIn) openLoginModal();
      else router.replace("/");
    }
  }, [isLoading, isAdmin, isLoggedIn, openLoginModal, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00ff87]/30 border-t-[#00ff87] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-60 fixed top-0 left-0 h-full bg-[#0d0d0d] border-r border-white/[0.06] z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-[#00ff87]/10 border border-[#00ff87]/20 flex items-center justify-center">
            <Shield size={16} className="text-[#00ff87]" />
          </div>
          <div>
            <p className="text-xs font-black tracking-widest text-white">ADMIN</p>
            <p className="text-[10px] text-[#00ff87] font-semibold">AUSlots Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  active
                    ? "bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={16} className={active ? "text-[#00ff87]" : "text-white/30 group-hover:text-white/60"} />
                {label}
                {active && <ChevronRight size={12} className="ml-auto text-[#00ff87]/50" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#00ff87]/20 flex items-center justify-center text-xs font-black text-[#00ff87]">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-white">{user?.username}</p>
              <p className="text-[10px] text-[#00ff87]">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-[#111111] border border-white/10 rounded-xl text-white/60 hover:text-white"
      >
        <Menu size={18} />
      </button>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-60 bg-[#0d0d0d] border-r border-white/[0.06] z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00ff87]/10 border border-[#00ff87]/20 flex items-center justify-center">
                    <Shield size={16} className="text-[#00ff87]" />
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-widest text-white">ADMIN</p>
                    <p className="text-[10px] text-[#00ff87] font-semibold">AUSlots Panel</p>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-white/40 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                {navItems.map(({ label, href, icon: Icon }) => {
                  const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                        active
                          ? "bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={16} className={active ? "text-[#00ff87]" : "text-white/30 group-hover:text-white/60"} />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-60 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}

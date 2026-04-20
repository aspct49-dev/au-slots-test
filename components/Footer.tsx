"use client";

import Link from "next/link";
import Image from "next/image";
import { Youtube, Instagram } from "lucide-react";

const footerLinks = {
  Platform: [
    { name: "Home", href: "/" },
    { name: "Points Shop", href: "/points-shop" },
    { name: "Raffles", href: "/raffles" },
  ],
  Community: [
    { name: "Bonus Hunts", href: "/bonus-hunt" },
    { name: "Vault", href: "/vault" },
    { name: "Schedule", href: "/schedule" },
  ],
  Socials: [
    { name: "Kick", href: "https://kick.com/auslots" },
    { name: "X / Twitter", href: "https://x.com/AuslotsOfficial" },
    { name: "YouTube", href: "https://www.youtube.com/@auslots" },
    { name: "Instagram", href: "https://www.instagram.com/ausofficialhq" },
    { name: "Snapchat", href: "https://www.snapchat.com/@theausofficial" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/[0.06] mt-12 sm:mt-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <Image
                src="/images/logo.png"
                alt="AUSlots"
                width={40}
                height={40}
                className="rounded-xl"
              />
              <span className="font-black text-xl tracking-widest text-white">
                AUSLOTS
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Australia&apos;s premier streaming rewards community. Earn points, win prizes,
              and be part of something epic.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a href="https://kick.com/auslots" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#53fc18]/20 hover:border-[#53fc18]/40 transition-all group/icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white/50 group-hover/icon:text-[#53fc18] transition-colors">
                  <path d="M2 2h20v20H2V2zm4 4v12h3V14l5 4h4l-6-6 6-6h-4l-5 4V6H6z" />
                </svg>
              </a>
              <a href="https://x.com/AuslotsOfficial" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all group/icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-white/50 group-hover/icon:text-white transition-colors">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@auslots" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#ff0000]/20 hover:border-[#ff0000]/40 transition-all group/icon">
                <Youtube size={14} className="text-white/50 group-hover/icon:text-[#ff0000] transition-colors" />
              </a>
              <a href="https://www.instagram.com/ausofficialhq" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#e1306c]/20 hover:border-[#e1306c]/40 transition-all group/icon">
                <Instagram size={14} className="text-white/50 group-hover/icon:text-[#e1306c] transition-colors" />
              </a>
              <a href="https://www.snapchat.com/@theausofficial" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#fffc00]/20 hover:border-[#fffc00]/40 transition-all group/icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white/50 group-hover/icon:text-[#fffc00] transition-colors">
                  <path d="M12 2C7 2 4 5.5 4 9v.5c-.5.2-1.5.7-1.5 1.5 0 .7.5 1 1 1.2-.2.4-.5 1.3-1.5 1.8-.5.2-.5 1 0 1.2 1.5.5 2.5 1.5 3 2.3.5.8 1 1.5 4 1.5.5 0 1 .5 1.5 1H12h1c.5-.5 1-1 1.5-1 3 0 3.5-.7 4-1.5.5-.8 1.5-1.8 3-2.3.5-.2.5-1 0-1.2-1-.5-1.3-1.4-1.5-1.8.5-.2 1-.5 1-1.2 0-.8-1-1.3-1.5-1.5V9c0-3.5-3-7-8-7z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-[#00ff87] transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; 2024 AUSlotsRewards.com — All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white/20 text-xs cursor-pointer hover:text-white/50 transition-colors">
              Privacy Policy
            </span>
            <span className="text-white/20 text-xs cursor-pointer hover:text-white/50 transition-colors">
              Terms of Service
            </span>
            <span className="text-white/20 text-xs cursor-pointer hover:text-white/50 transition-colors">
              Responsible Gaming
            </span>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-[#111111] border border-white/5">
          <p className="text-white/25 text-xs text-center leading-relaxed">
            AUSlotsRewards.com is a community rewards platform. Content is intended for entertainment purposes only.
            Please gamble responsibly. If you have a gambling problem, seek help at{" "}
            <span className="text-[#00ff87]/50">gamblinghelponline.org.au</span>.
            18+ only.
          </p>
        </div>
      </div>
    </footer>
  );
}

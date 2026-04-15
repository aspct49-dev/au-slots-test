"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitch, Youtube, Instagram, Facebook } from "lucide-react";

const footerLinks = {
  Platform: [
    { name: "Home", href: "/" },
    { name: "Points Shop", href: "/points-shop" },
    { name: "Raffles", href: "/raffles" },
  ],
  Community: [
    { name: "Bonus Hunts", href: "/bonus-hunt" },
    { name: "Giveaways", href: "/giveaways" },
    { name: "Discord", href: "https://discord.gg/auslots" },
  ],
  Socials: [
    { name: "Kick", href: "https://kick.com/auslots" },
    { name: "Twitch", href: "https://www.twitch.tv/auslots/" },
    { name: "YouTube", href: "https://www.youtube.com/@auslots" },
    { name: "Instagram", href: "https://www.instagram.com/auslotsofficial/" },
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
              <a
                href="https://kick.com/auslots"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#53fc18]/20 hover:border-[#53fc18]/40 transition-all group/icon"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white/50 group-hover/icon:text-[#53fc18] transition-colors">
                  <path d="M2 2h20v20H2V2zm4 4v12h3V14l5 4h4l-6-6 6-6h-4l-5 4V6H6z" />
                </svg>
              </a>
              <a
                href="https://www.twitch.tv/auslots/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#9146ff]/20 hover:border-[#9146ff]/40 transition-all group/icon"
              >
                <Twitch size={14} className="text-white/50 group-hover/icon:text-[#9146ff] transition-colors" />
              </a>
              <a
                href="https://www.youtube.com/@auslots"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#ff0000]/20 hover:border-[#ff0000]/40 transition-all group/icon"
              >
                <Youtube size={14} className="text-white/50 group-hover/icon:text-[#ff0000] transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/auslotsofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#e1306c]/20 hover:border-[#e1306c]/40 transition-all group/icon"
              >
                <Instagram size={14} className="text-white/50 group-hover/icon:text-[#e1306c] transition-colors" />
              </a>
              <a
                href="https://discord.gg/auslots"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#5865f2]/20 hover:border-[#5865f2]/40 transition-all group/icon"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" className="text-white/50 group-hover/icon:text-[#5865f2] transition-colors">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.04.033.051a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/AuslotsOfficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877f2]/20 hover:border-[#1877f2]/40 transition-all group/icon"
              >
                <Facebook size={14} className="text-white/50 group-hover/icon:text-[#1877f2] transition-colors" />
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

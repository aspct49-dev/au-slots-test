"use client";

import { motion } from "framer-motion";
import { Twitch, Youtube, Instagram, Facebook, Users } from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";

const socials = [
  {
    name: "Kick",
    handle: "@auslots",
    description: "Watch us LIVE",
    href: "https://kick.com/auslots",
    color: "#53fc18",
    bgColor: "rgba(83,252,24,0.08)",
    borderColor: "rgba(83,252,24,0.15)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 2h20v20H2V2zm4 4v12h3V14l5 4h4l-6-6 6-6h-4l-5 4V6H6z" />
      </svg>
    ),
    badge: "LIVE",
  },
  {
    name: "Discord",
    handle: "discord.gg/auslots",
    description: "Join our community",
    href: "https://discord.gg/auslots",
    color: "#5865f2",
    bgColor: "rgba(88,101,242,0.08)",
    borderColor: "rgba(88,101,242,0.15)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.04.033.051a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    badge: "COMMUNITY",
  },
  {
    name: "Twitch",
    handle: "@auslots",
    description: "VODs & highlights",
    href: "https://www.twitch.tv/auslots/",
    color: "#9146ff",
    bgColor: "rgba(145,70,255,0.08)",
    borderColor: "rgba(145,70,255,0.15)",
    icon: <Twitch size={24} />,
    badge: null,
  },
  {
    name: "YouTube",
    handle: "@auslots",
    description: "Subscribe for videos",
    href: "https://www.youtube.com/@auslots?sub_confirmation=1",
    color: "#ff0000",
    bgColor: "rgba(255,0,0,0.08)",
    borderColor: "rgba(255,0,0,0.15)",
    icon: <Youtube size={24} />,
    badge: null,
  },
  {
    name: "Instagram",
    handle: "@auslotsofficial",
    description: "Follow for updates",
    href: "https://www.instagram.com/auslotsofficial/",
    color: "#e1306c",
    bgColor: "rgba(225,48,108,0.08)",
    borderColor: "rgba(225,48,108,0.15)",
    icon: <Instagram size={24} />,
    badge: null,
  },
  {
    name: "Facebook",
    handle: "AuslotsOfficial",
    description: "Like our page",
    href: "https://www.facebook.com/AuslotsOfficial/",
    color: "#1877f2",
    bgColor: "rgba(24,119,242,0.08)",
    borderColor: "rgba(24,119,242,0.15)",
    icon: <Facebook size={24} />,
    badge: null,
  },
  {
    name: "Snapchat",
    handle: "@aussieslots",
    description: "Add us on Snap",
    href: "https://www.snapchat.com/add/aussieslots",
    color: "#fffc00",
    bgColor: "rgba(255,252,0,0.08)",
    borderColor: "rgba(255,252,0,0.15)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C7 2 4 5.5 4 9v.5c-.5.2-1.5.7-1.5 1.5 0 .7.5 1 1 1.2-.2.4-.5 1.3-1.5 1.8-.5.2-.5 1 0 1.2 1.5.5 2.5 1.5 3 2.3.5.8 1 1.5 4 1.5.5 0 1 .5 1.5 1H12h1c.5-.5 1-1 1.5-1 3 0 3.5-.7 4-1.5.5-.8 1.5-1.8 3-2.3.5-.2.5-1 0-1.2-1-.5-1.3-1.4-1.5-1.8.5-.2 1-.5 1-1.2 0-.8-1-1.3-1.5-1.5V9c0-3.5-3-7-8-7z" />
      </svg>
    ),
    badge: null,
  },
];

export default function SocialLinks() {
  return (
    <section className="py-12 sm:py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,255,135,0.03)_0%,transparent_70%)]" />
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff87]/10 border border-[#00ff87]/20 mb-4">
            <Users size={12} className="text-[#00ff87]" />
            <span className="text-[#00ff87] text-xs font-bold tracking-widest">
              FIND US ONLINE
            </span>
          </div>
          <BubbleText className="text-3xl sm:text-4xl tracking-tight text-[#00ff87]/60 mb-3">{"JOIN THE COMMUNITY"}</BubbleText>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Follow us across all platforms and never miss a stream, giveaway or announcement.
          </p>
        </motion.div>

        {/* Social cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: social.bgColor,
                borderColor: social.borderColor,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 25px ${social.color}20`;
                (e.currentTarget as HTMLElement).style.borderColor = `${social.color}40`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = social.borderColor;
              }}
            >
              {/* Badge */}
              {social.badge && (
                <span
                  className="absolute -top-2 -right-2 text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: social.color, color: "#000" }}
                >
                  {social.badge}
                </span>
              )}

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200"
                style={{
                  backgroundColor: `${social.color}15`,
                  color: social.color,
                }}
              >
                {social.icon}
              </div>

              {/* Text */}
              <div className="text-center">
                <div className="text-sm font-bold text-white group-hover:text-[#00ff87] transition-colors">
                  {social.name}
                </div>
                <div className="text-[11px] text-white/40 mt-0.5">{social.description}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

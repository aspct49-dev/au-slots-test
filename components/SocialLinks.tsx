"use client";

import { motion } from "framer-motion";
import { Youtube, Instagram, Users } from "lucide-react";
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
    name: "X / Twitter",
    handle: "@AuslotsOfficial",
    description: "Follow for updates",
    href: "https://x.com/AuslotsOfficial",
    color: "#e7e7e7",
    bgColor: "rgba(231,231,231,0.05)",
    borderColor: "rgba(231,231,231,0.12)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    badge: null,
  },
  {
    name: "YouTube",
    handle: "@auslots",
    description: "Subscribe for videos",
    href: "https://www.youtube.com/@auslots",
    color: "#ff0000",
    bgColor: "rgba(255,0,0,0.08)",
    borderColor: "rgba(255,0,0,0.15)",
    icon: <Youtube size={24} />,
    badge: null,
  },
  {
    name: "Instagram",
    handle: "@ausofficialhq",
    description: "Follow for updates",
    href: "https://www.instagram.com/ausofficialhq",
    color: "#e1306c",
    bgColor: "rgba(225,48,108,0.08)",
    borderColor: "rgba(225,48,108,0.15)",
    icon: <Instagram size={24} />,
    badge: null,
  },
  {
    name: "Snapchat",
    handle: "@theausofficial",
    description: "Add us on Snap",
    href: "https://www.snapchat.com/@theausofficial",
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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

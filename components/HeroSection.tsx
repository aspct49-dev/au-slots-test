"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Zap } from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";

interface Stat { value: string; label: string; }
const DEFAULT_STATS: Stat[] = [
  { value: "10K+",  label: "Community Members" },
  { value: "$50K+", label: "Rewards Given Away" },
  { value: "500+",  label: "Raffle Winners" },
  { value: "24/7",  label: "Active Community" },
];

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      life: number;
      maxLife: number;
    }[] = [];

    function createParticle() {
      if (!canvas) return;
      const size = Math.random() * 3 + 1;
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        size,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: -(Math.random() * 1.5 + 0.5),
        opacity: Math.random() * 0.6 + 0.2,
        life: 0,
        maxLife: Math.random() * 200 + 100,
      });
    }

    let animationId: number;
    let frameCount = 0;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      frameCount++;
      if (frameCount % 3 === 0) {
        createParticle();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        const currentOpacity = p.opacity * (1 - lifeRatio);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 135, ${currentOpacity})`;
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -10) {
          particles.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

export default function HeroSection() {
  const [stats, setStats] = useState<Stat[]>(DEFAULT_STATS);

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length) setStats(data); })
      .catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Animated gradient bg */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,255,135,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(0,230,118,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,rgba(0,255,135,0.04)_0%,transparent_50%)]" />
      </div>

      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,135,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,135,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-8 pt-24 sm:pt-32 pb-12 sm:pb-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#00ff87]/10 border border-[#00ff87]/20 mb-5 sm:mb-8 max-w-[90vw] text-center"
        >
          <div className="relative w-2 h-2 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#00ff87]" />
            <div className="absolute inset-0 rounded-full bg-[#00ff87] animate-ping opacity-75" />
          </div>
          <span className="text-[#00ff87] text-[10px] sm:text-sm font-bold tracking-wide sm:tracking-widest">
            AUSTRALIA&apos;S #1 STREAMING REWARDS COMMUNITY
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-5 sm:mb-6"
        >
          <BubbleText className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight leading-none text-[#00ff87]/60">{"EARN REWARDS"}</BubbleText>
        </motion.div>

        {/* Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="filter drop-shadow-[0_0_20px_rgba(0,255,135,0.5)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/auslots_gif.gif"
                alt="AUSlots Mascot"
                className="w-48 h-48 sm:w-64 sm:h-64 object-contain rounded-2xl"
              />
            </motion.div>
            <div className="absolute inset-0 blur-2xl bg-[#00ff87]/20 rounded-full scale-150 -z-10" />
          </div>
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base sm:text-xl text-white/60 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0"
        >
          A VIP experience through personalized rewards, bonus hunts, raffles &amp; more!
          <br className="hidden sm:block" />
          Earn rewards from just tuning into our stream.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/points-shop"
            className="group relative flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-4 rounded-xl bg-[#00ff87] text-black font-black text-sm tracking-widest hover:bg-[#00e676] transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,255,135,0.5)] active:scale-95"
          >
            <Zap size={16} />
            EXPLORE REWARDS
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/vault"
            className="group flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-4 rounded-xl bg-white/5 text-white font-black text-sm tracking-widest border border-white/10 hover:border-[#fbbf24]/40 hover:bg-[#fbbf24]/10 hover:text-[#fbbf24] transition-all duration-200 active:scale-95"
          >
            THE VAULT
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 sm:mt-20 grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#0a0a0a] px-4 sm:px-6 py-4 sm:py-6 text-center hover:bg-[#111111] transition-colors"
            >
              <div className="text-xl sm:text-3xl font-black text-[#00ff87] mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-white/40 tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}

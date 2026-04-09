"use client";

import { motion } from "framer-motion";
import { Target, Lock, Star, Zap, Clock, CheckCircle, Monitor, MessageCircle, Timer, Globe, Gamepad2, Crosshair, Calendar, CalendarDays, Coins } from "lucide-react";
import { BubbleText } from "@/components/ui/bubble-text";
import { useAuth } from "@/context/AuthContext";

const mockChallenges = [
  {
    id: "1",
    title: "First Watch",
    description: "Watch your first 30 minutes of stream",
    points: 100,
    type: "DAILY",
    difficulty: "EASY",
    completed: false,
    icon: <Monitor size={20} />,
    color: "#00ff87",
  },
  {
    id: "2",
    title: "Chatterbox",
    description: "Send 10 messages in chat during a live stream",
    points: 150,
    type: "DAILY",
    difficulty: "EASY",
    completed: false,
    icon: <MessageCircle size={20} />,
    color: "#60a5fa",
  },
  {
    id: "3",
    title: "Marathon Viewer",
    description: "Watch 2 hours of consecutive stream time",
    points: 500,
    type: "WEEKLY",
    difficulty: "MEDIUM",
    completed: false,
    icon: <Timer size={20} />,
    color: "#fbbf24",
  },
  {
    id: "4",
    title: "Social Butterfly",
    description: "Follow AUSlots on 3 different social platforms",
    points: 300,
    type: "ONE-TIME",
    difficulty: "EASY",
    completed: false,
    icon: <Globe size={20} />,
    color: "#a78bfa",
  },
  {
    id: "5",
    title: "Discord Member",
    description: "Join the official AUSlots Discord server",
    points: 250,
    type: "ONE-TIME",
    difficulty: "EASY",
    completed: false,
    icon: <Gamepad2 size={20} />,
    color: "#5865f2",
  },
  {
    id: "6",
    title: "Prediction Master",
    description: "Enter 5 bonus hunt predictions",
    points: 750,
    type: "WEEKLY",
    difficulty: "HARD",
    completed: false,
    icon: <Crosshair size={20} />,
    color: "#f87171",
  },
];

function getDifficultyStyle(difficulty: string) {
  switch (difficulty) {
    case "EASY":
      return "bg-[#00ff87]/10 text-[#00ff87] border-[#00ff87]/20";
    case "MEDIUM":
      return "bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20";
    case "HARD":
      return "bg-[#f87171]/10 text-[#f87171] border-[#f87171]/20";
    default:
      return "bg-white/10 text-white/50 border-white/10";
  }
}

function getTypeStyle(type: string) {
  switch (type) {
    case "DAILY":
      return "bg-[#60a5fa]/10 text-[#60a5fa]";
    case "WEEKLY":
      return "bg-[#a78bfa]/10 text-[#a78bfa]";
    case "ONE-TIME":
      return "bg-[#00ff87]/10 text-[#00ff87]";
    default:
      return "bg-white/5 text-white/40";
  }
}

function PageHeader() {
  return (
    <div className="relative py-12 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(248,113,113,0.1)_0%,transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(248,113,113,1) 1px, transparent 1px), linear-gradient(90deg, rgba(248,113,113,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f87171]/10 border border-[#f87171]/20 mb-4">
            <Target size={12} className="text-[#f87171]" />
            <span className="text-[#f87171] text-xs font-bold tracking-widest">
              EARN BONUS POINTS
            </span>
          </div>
          <BubbleText className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4 text-[#f87171]/60">{"CHALLENGES"}</BubbleText>
          <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto">
            Complete challenges to earn bonus points and exclusive rewards.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: typeof mockChallenges[0] }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-[#111111] border border-white/[0.08] rounded-2xl p-5 hover:border-white/15 hover:shadow-[0_0_20px_rgba(0,0,0,0.4)] transition-all duration-300 overflow-hidden"
    >
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-opacity"
        style={{ backgroundColor: challenge.color }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${challenge.color}15`,
                border: `1px solid ${challenge.color}20`,
                color: challenge.color,
              }}
            >
              {challenge.icon}
            </div>
            <div>
              <div
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest mb-1 ${getTypeStyle(challenge.type)}`}
              >
                {challenge.type}
              </div>
              <h3 className="text-white font-bold text-sm">{challenge.title}</h3>
            </div>
          </div>
          {challenge.completed && (
            <CheckCircle size={20} className="text-[#00ff87] flex-shrink-0" />
          )}
        </div>
        <p className="text-white/40 text-xs leading-relaxed mb-4">
          {challenge.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap size={12} style={{ color: challenge.color }} />
            <span
              className="font-black text-sm"
              style={{ color: challenge.color }}
            >
              +{challenge.points.toLocaleString()}
            </span>
            <span className="text-white/30 text-xs">pts</span>
          </div>
          <span
            className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full border ${getDifficultyStyle(challenge.difficulty)}`}
          >
            {challenge.difficulty}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ChallengeGrid() {
  const dailyChallenges = mockChallenges.filter((c) => c.type === "DAILY");
  const weeklyChallenges = mockChallenges.filter((c) => c.type === "WEEKLY");
  const oneTimeChallenges = mockChallenges.filter((c) => c.type === "ONE-TIME");

  return (
    <div className="space-y-10">
      {[
        {
          label: "DAILY CHALLENGES",
          icon: <Clock size={16} />,
          color: "#60a5fa",
          items: dailyChallenges,
          desc: "Resets every day at midnight AEST",
        },
        {
          label: "WEEKLY CHALLENGES",
          icon: <Star size={16} />,
          color: "#a78bfa",
          items: weeklyChallenges,
          desc: "Resets every Monday at midnight AEST",
        },
        {
          label: "ONE-TIME CHALLENGES",
          icon: <Target size={16} />,
          color: "#00ff87",
          items: oneTimeChallenges,
          desc: "Complete once for permanent rewards",
        },
      ].map((group) => (
        <div key={group.label}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ color: group.color }}>{group.icon}</span>
            <h3 className="font-black text-sm tracking-widest text-white">
              {group.label}
            </h3>
            <span className="hidden sm:inline text-white/30 text-xs ml-1">— {group.desc}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.items.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LoginGate({ onLogin }: { onLogin: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl overflow-hidden"
    >
      {/* Blurred preview */}
      <div className="blur-sm pointer-events-none select-none opacity-40">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-[#111111] border border-white/[0.08] rounded-2xl p-5 h-40"
            />
          ))}
        </div>
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          className="flex flex-col items-center text-center px-6"
        >
          <div className="w-20 h-20 rounded-full bg-[#00ff87]/10 border border-[#00ff87]/20 flex items-center justify-center mb-4">
            <Lock size={32} className="text-[#00ff87]" />
          </div>
          <h3 className="text-white font-black text-2xl tracking-tight mb-2">
            MEMBERS ONLY
          </h3>
          <p className="text-white/50 text-sm max-w-xs leading-relaxed mb-6">
            Log in or sign up to view and complete challenges, earn bonus points,
            and unlock exclusive rewards.
          </p>
          <button
            onClick={onLogin}
            className="px-8 py-3.5 rounded-xl bg-[#00ff87] text-black font-black text-sm tracking-widest hover:bg-[#00e676] transition-all duration-200 hover:shadow-[0_0_25px_rgba(0,255,135,0.4)]"
          >
            LOG IN / SIGN UP
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ChallengesPage() {
  const { isLoggedIn, openLoginModal } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <PageHeader />
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-20">
        {/* Stats row (always visible) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
        >
          {[
            { label: "Total Challenges", value: mockChallenges.length.toString(), icon: <Target size={22} className="text-[#f87171]" /> },
            { label: "Daily Challenges", value: "2", icon: <Calendar size={22} className="text-[#60a5fa]" /> },
            { label: "Weekly Challenges", value: "2", icon: <CalendarDays size={22} className="text-[#a78bfa]" /> },
            { label: "Max Points/Week", value: "2,050", icon: <Coins size={22} className="text-[#fbbf24]" /> },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-[#111111] border border-white/[0.08] text-center"
            >
              <div className="flex justify-center mb-1">{stat.icon}</div>
              <div className="text-white font-black text-lg">{stat.value}</div>
              <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Challenge content — gated if not logged in */}
        {isLoggedIn ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ChallengeGrid />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <LoginGate onLogin={openLoginModal} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

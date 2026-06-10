"use client";

import { motion } from "framer-motion";

interface OrbitingCircleProps {
  items: { icon: React.ReactNode; label: string; color: string }[];
  className?: string;
}

export default function OrbitingCircles({ items, className = "" }: OrbitingCircleProps) {
  return (
    <div className={`relative flex items-center justify-center w-full max-w-md mx-auto aspect-square ${className}`}>
      {/* Center logo */}
      <div className="absolute w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-600/30 z-10">
        <span className="text-white font-bold text-lg">AI</span>
      </div>

      {/* Orbiting items */}
      {items.map((item, i) => {
        const angle = (i / items.length) * 360;
        return (
          <motion.div
            key={item.label}
            className="absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors z-20"
            style={{
              transformOrigin: "center",
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
              delay: -(20 / items.length) * i,
            }}
          >
            <motion.div
              className="flex items-center gap-2"
              animate={{ rotate: [0, -360] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear", delay: -(20 / items.length) * i }}
              style={{ transformOrigin: "center" }}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-xs font-medium text-zinc-300 whitespace-nowrap">{item.label}</span>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Orbit rings */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
        <circle cx="150" cy="150" r="60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <circle cx="150" cy="150" r="110" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}

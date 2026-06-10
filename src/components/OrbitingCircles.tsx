"use client";

import { motion } from "framer-motion";

interface OrbitingCirclesProps {
  items: { icon: React.ReactNode; label: string }[];
  className?: string;
}

export default function OrbitingCircles({ items, className = "" }: OrbitingCirclesProps) {
  return (
    <div className={`relative flex items-center justify-center w-full max-w-sm mx-auto ${className}`} style={{ height: 320 }}>
      {/* Center */}
      <div className="absolute w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-600/30 z-10">
        <span className="text-white font-bold text-lg">AI</span>
      </div>

      {/* Orbit container */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        style={{ transformOrigin: "center center" }}
      >
        {items.map((item, i) => {
          const angle = (i / items.length) * 360;
          const rad = (angle * Math.PI) / 180;
          const r = 130;
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r;

          return (
            <motion.div
              key={item.label}
              className="absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors z-20 whitespace-nowrap"
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%, -50%)" }}
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              whileHover={{ y: -4 }}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs font-medium text-zinc-300">{item.label}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Orbit ring */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: "none" }}>
        <circle cx="50%" cy="50%" r={130} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}

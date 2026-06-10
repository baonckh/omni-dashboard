"use client";

import { motion } from "framer-motion";

interface OrbitingCircleProps {
  items: { icon: React.ReactNode; label: string }[];
  className?: string;
}

export default function OrbitingCircles({ items, className = "" }: OrbitingCircleProps) {
  const radius = 140;

  return (
    <div className={`relative flex items-center justify-center w-full max-w-sm mx-auto ${className}`} style={{ height: 320 }}>
      {/* Center */}
      <div className="absolute w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-600/30 z-10"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      >
        <span className="text-white font-bold text-lg">AI</span>
      </div>

      {/* Items */}
      {items.map((item, i) => {
        const angle = (i / items.length) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={item.label}
            className="absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors z-20"
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%, -50%)" }}
            whileHover={{ scale: 1.08 }}
          >
            <span className="text-sm">{item.icon}</span>
            <span className="text-xs font-medium text-zinc-300 whitespace-nowrap">{item.label}</span>
          </motion.div>
        );
      })}

      {/* Orbit ring */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <circle cx="50%" cy="50%" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}

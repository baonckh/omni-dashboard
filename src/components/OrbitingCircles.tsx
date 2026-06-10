"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

interface PlatformOrbitProps {
  items: { icon: React.ReactNode; label: string }[];
  className?: string;
}

export default function PlatformOrbit({ items, className = "" }: PlatformOrbitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const angles = [270, 342, 54, 126, 198]; // Evenly spaced around circle
  const radius = 140;

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center w-full max-w-sm mx-auto ${className}`} style={{ height: 350 }}>
      {/* Center icon */}
      <div className="absolute w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-600/40 z-20">
        <span className="text-white font-bold text-xs text-center leading-tight">Omni<br />AI</span>
      </div>

      {/* Orbit rings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <circle cx="50%" cy="50%" r={radius} fill="none" className="stroke-white/5 stroke-[0.5]" strokeDasharray="4 4" />
      </svg>

      {/* Items */}
      {items.map((item, i) => {
        const rad = (angles[i] * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;

        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="absolute flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-blue-600/10 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-600/10 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer z-20"
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%, -50%)" }}
          >
            <span className="text-sm">{item.icon}</span>
            <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{item.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
  items: { icon?: React.ReactNode; text: string }[];
  className?: string;
}

export default function Marquee({ items, className = "" }: MarqueeProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-sm font-bold text-zinc-600 whitespace-nowrap">
            {item.icon}{item.text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

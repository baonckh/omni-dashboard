"use client";

import { motion } from "framer-motion";

interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
  reverse?: boolean;
  borderWidth?: number;
}

export default function BorderBeam({
  size = 60,
  duration = 4,
  delay = 0,
  colorFrom = "#2563EB",
  colorTo = "#A855F7",
  className = "",
  reverse = false,
  borderWidth = 2,
}: BorderBeamProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-transparent"
      style={{
        mask: "linear-gradient(transparent,transparent),linear-gradient(#000,#000)",
        maskComposite: "intersect",
        maskClip: "padding-box,border-box",
        borderWidth: borderWidth,
        borderStyle: "solid",
        borderColor: "transparent",
        borderRadius: "inherit",
      }}
    >
      <motion.div
        className={`absolute aspect-square bg-gradient-to-l ${className}`}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
        }}
        initial={{ offsetDistance: "0%" }}
        animate={{
          offsetDistance: reverse ? ["100%", "0%"] : ["0%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
        }}
      />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface HighlighterProps {
  children: React.ReactNode;
  color?: string;
  action?: "highlight" | "underline" | "box" | "circle" | "strike-through";
  animationDuration?: number;
  className?: string;
}

const pathMap = {
  highlight: (w: number, h: number) => `M 0,${h - 4} Q ${w / 4},${h + 6} ${w / 2},${h - 2} Q ${(3 * w) / 4},${h - 10} ${w},${h - 4}`,
  underline: (w: number, h: number) => `M 0,${h - 2} Q ${w / 2},${h + 4} ${w},${h - 2}`,
  box: (w: number, h: number) => `M 2,2 L ${w - 2},2 L ${w - 2},${h - 2} L 2,${h - 2} Z`,
  circle: (w: number, h: number) => {
    const cx = w / 2, cy = h / 2, r = Math.max(w, h) / 2 + 4;
    return `M ${cx},${cy - r} A ${r},${r} 0 1,1 ${cx - 0.01},${cy - r}`;
  },
  "strike-through": (w: number, h: number) => `M 0,${h / 2} L ${w},${h / 2}`,
};

export default function Highlighter({
  children,
  color = "#2563EB",
  action = "highlight",
  animationDuration = 600,
  className = "",
}: HighlighterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute inset-0 pointer-events-none"
        width="100%"
        height="100%"
        viewBox={`0 0 100 30`}
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <motion.path
          d={pathMap[action](100, 28)}
          stroke={color}
          strokeWidth={action === "highlight" ? 8 : 2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={action === "highlight" ? 0.3 : 0.7}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isInView ? 1 : 0 }}
          transition={{ duration: animationDuration / 1000, delay: 0.15, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}

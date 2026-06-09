"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRef } from "react";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
}

export default function MagicCard({ children, className = "", gradientColor = "rgba(37,99,235,0.08)" }: MagicCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px * 100);
    y.set(py * 100);
  };

  const bg = useMotionTemplate`radial-gradient(circle at ${x}% ${y}%, ${gradientColor}, transparent 60%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-2xl border border-white/5 transition-all duration-200 ${className}`}
      style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
    >
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: bg }} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

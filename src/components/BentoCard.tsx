"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  className?: string;
  gradient?: string;
}

export default function BentoCard({ icon, title, desc, className = "", gradient = "from-blue-600/10 to-transparent" }: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/5 p-6 transition-all duration-300",
        "bg-gradient-to-br from-white/[0.02] to-transparent",
        "hover:border-white/10 hover:shadow-lg hover:shadow-blue-600/5",
        "group/card",
        className
      )}
    >
      {/* Card hover glow */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none",
        gradient
      )} />
      <div className="relative z-10">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-blue-600/10 border border-blue-500/15 mx-auto">
          {icon}
        </div>
        <h3 className="text-sm font-bold text-white mb-2 text-center leading-tight">{title}</h3>
        <p className="text-xs text-zinc-500 leading-relaxed text-center">{desc}</p>
      </div>
    </motion.div>
  );
}

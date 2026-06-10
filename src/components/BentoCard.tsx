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
      whileHover={{ y: -2 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/5 p-5 transition-all duration-300",
        "bg-gradient-to-br from-white/[0.02] to-transparent",
        "hover:border-white/10 hover:shadow-lg hover:shadow-blue-600/5",
        className
      )}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-3 bg-blue-600/10 border border-blue-500/15">
          {icon}
        </div>
        <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

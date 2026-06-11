"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import ChatDemo from "./ChatDemo";
import BotPipeline from "./BotPipeline";
import type { Stage } from "./BotPipeline";

type TickDef = { visible: number; stage: Stage };

const TICKS: TickDef[] = [
  { visible: 0, stage: "idle" },      // 0 — initial wait
  { visible: 1, stage: "ingest" },    // 1 — user msg, bot starts ingesting
  { visible: 2, stage: "vector" },    // 2 — analyzing intent = vectorizing
  { visible: 3, stage: "retrieve" },  // 3 — retrieving products
  { visible: 4, stage: "filter" },    // 4 — checking variant + stock
  { visible: 5, stage: "persona" },   // 5 — applying shop tone
  { visible: 6, stage: "respond" },   // 6 — bot generates response
  { visible: 6, stage: "respond" },   // 7 — extra reading time
  { visible: 6, stage: "idle" },      // 8 — pause before reset
];

const DURATIONS = [500, 2000, 2000, 2000, 2000, 2000, 3000, 2000, 5000];

export default function SyncedDemo() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const duration = DURATIONS[tick] ?? 2000;
    const timer = setTimeout(() => {
      setTick((prev) => (prev >= TICKS.length - 1 ? 0 : prev + 1));
    }, duration);
    return () => clearTimeout(timer);
  }, [tick]);

  const { visible, stage } = TICKS[tick] ?? TICKS[0];
  const isActive = stage !== "idle";

  return (
    <div className="relative">
      {/* Shared background glow behind both panels */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-1/2 h-3/4 bg-gradient-to-r from-blue-600/8 via-purple-600/8 to-transparent blur-[80px] rounded-full" />
      </div>

      {/* Desktop connector arrow */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex-col items-center gap-1">
        <motion.div
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/25 shadow-lg shadow-blue-500/10 backdrop-blur-sm"
          animate={
            isActive
              ? { scale: [1, 1.12, 1], borderColor: ["rgba(59,130,246,0.25)", "rgba(168,85,247,0.4)", "rgba(59,130,246,0.25)"] }
              : { scale: 1, borderColor: "rgba(59,130,246,0.15)" }
          }
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <ArrowRight className="h-4 w-4 text-blue-400" />
        </motion.div>
        <motion.span
          className="text-[9px] font-medium text-blue-500/60 tracking-wider"
          animate={isActive ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.3 }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          AI
        </motion.span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start relative z-0">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 h-[480px] shrink-0"
        >
          <ChatDemo controlledVisible={visible} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 h-[480px] overflow-y-auto"
        >
          <BotPipeline controlledStage={stage} />
        </motion.div>
      </div>
    </div>
  );
}

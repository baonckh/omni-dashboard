"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import ChatDemo from "./ChatDemo";
import BotPipeline from "./BotPipeline";
import { AnimatedBeam } from "./ui/animated-beam";
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

  // Refs for AnimatedBeam
  const containerRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative">
      {/* Shared background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-600/10 via-purple-600/8 to-transparent blur-[100px] rounded-full" />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3 relative z-0">
        {/* Chat panel */}
        <motion.div
          ref={chatRef}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:flex-1"
        >
          <ChatDemo controlledVisible={visible} />
        </motion.div>

        {/* AI node — glass pill */}
        <motion.div
          ref={aiRef}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 12 }}
          className="shrink-0 relative z-20"
        >
          <motion.div
            className="relative flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/[0.12] shadow-xl"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}
            animate={
              isActive
                ? {
                    boxShadow: [
                      "0 0 0px rgba(59,130,246,0)",
                      "0 0 25px rgba(59,130,246,0.25)",
                      "0 0 0px rgba(59,130,246,0)",
                    ],
                    borderColor: [
                      "rgba(255,255,255,0.12)",
                      "rgba(59,130,246,0.4)",
                      "rgba(255,255,255,0.12)",
                    ],
                  }
                : { boxShadow: "0 0 0px rgba(59,130,246,0)", borderColor: "rgba(255,255,255,0.08)" }
            }
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            {/* Pulse dot */}
            <motion.span
              className="w-2 h-2 rounded-full bg-blue-500 shrink-0"
              animate={isActive ? { scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 0.4 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            {/* AI text */}
            <span className="text-[11px] md:text-xs font-bold text-zinc-300 tracking-[0.15em]">AI</span>
            {/* Subtle separator */}
            <span className="w-px h-3 bg-white/10" />
            {/* Processing indicator */}
            <motion.span
              className="text-[9px] md:text-[10px] font-medium text-zinc-500"
              animate={isActive ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.3 }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {isActive ? "PROCESSING" : "STANDBY"}
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Pipeline panel */}
        <motion.div
          ref={pipelineRef}
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:flex-1"
        >
          <BotPipeline controlledStage={stage} />
        </motion.div>
      </div>

      {/* Animated beams — desktop only */}
      <div className="hidden md:block">
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={chatRef}
          toRef={aiRef}
          curvature={-20}
          pathColor="rgba(59,130,246,0.15)"
          pathWidth={2}
          pathOpacity={0.3}
          gradientStartColor="#3B82F6"
          gradientStopColor="#8B5CF6"
          duration={3}
          delay={0}
          repeatDelay={0.5}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={aiRef}
          toRef={pipelineRef}
          curvature={-20}
          pathColor="rgba(59,130,246,0.15)"
          pathWidth={2}
          pathOpacity={0.3}
          gradientStartColor="#8B5CF6"
          gradientStopColor="#3B82F6"
          duration={3}
          delay={0.3}
          repeatDelay={0.5}
        />
      </div>
    </div>
  );
}

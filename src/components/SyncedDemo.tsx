"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
      {/* Shared background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-600/10 via-purple-600/8 to-transparent blur-[100px] rounded-full" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start relative z-0">
        {/* Chat panel */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2"
        >
          <ChatDemo controlledVisible={visible} />
        </motion.div>

        {/* Connecting gradient beam (desktop) */}
        <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-6 items-center justify-center z-10">
          <div className="relative w-0.5 h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/25 via-purple-500/15 to-transparent" />
            <motion.div
              className="absolute w-0.5 h-16 rounded-full bg-gradient-to-b from-blue-400 to-purple-400"
              animate={
                isActive
                  ? { top: ["0%", "calc(100% - 4rem)", "0%"], opacity: [0.3, 0.9, 0.3] }
                  : { top: "0%", opacity: 0.15 }
              }
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Pipeline panel */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2"
        >
          <div className="h-full">
            <BotPipeline controlledStage={stage} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

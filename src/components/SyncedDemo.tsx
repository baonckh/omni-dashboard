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

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
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
  );
}

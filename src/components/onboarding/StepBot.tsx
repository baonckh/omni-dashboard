"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Bot, HeartHandshake, Smile, TrendingUp } from "lucide-react";
import type { OnboardingData, ToneType } from "@/types/onboarding";
import { TONES, DEFAULT_RULES } from "@/types/onboarding";

interface StepProps {
  data: OnboardingData;
  onUpdate: (partial: Partial<OnboardingData>) => void;
  onSkip: () => void;
}

const toneIcons: Record<ToneType, React.ReactNode> = {
  professional: <TrendingUp className="w-5 h-5" />,
  friendly: <HeartHandshake className="w-5 h-5" />,
  humorous: <Smile className="w-5 h-5" />,
  warm: <HeartHandshake className="w-5 h-5" />,
  luxury: <TrendingUp className="w-5 h-5" />,
};

export default function StepBot({ data, onUpdate }: StepProps) {
  const { t, lang } = useLang();
  const [customRule, setCustomRule] = useState("");

  const addRule = () => {
    const rule = customRule.trim();
    if (!rule) return;
    onUpdate({ botRules: [...data.botRules, rule] });
    setCustomRule("");
  };

  const removeRule = (index: number) => {
    const next = data.botRules.filter((_, i) => i !== index);
    onUpdate({ botRules: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          <Bot className="inline w-4 h-4 mr-1.5 text-blue-400" />
          {lang === "vi" ? "Tên Bot (không bắt buộc)" : "Bot Name (optional)"}
        </label>
        <input
          type="text"
          value={data.botName}
          onChange={(e) => onUpdate({ botName: e.target.value })}
          placeholder={lang === "vi" ? "VD: OmniBot, Mai, ..." : "e.g. OmniBot, Mai, ..."}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <label className="block text-sm font-medium text-zinc-300 mb-3">
          {lang === "vi" ? "Giọng điệu" : "Bot Tone"}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {TONES.map((tone) => {
            const selected = data.botTone === tone.id;
            return (
              <button
                key={tone.id}
                type="button"
                onClick={() => onUpdate({ botTone: tone.id })}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-sm transition-all",
                  selected
                    ? "border-blue-500 bg-blue-500/10 text-blue-300"
                    : "border-white/10 bg-white/[0.02] text-zinc-400 hover:bg-white/[0.06]"
                )}
              >
                {toneIcons[tone.id]}
                <span className="font-medium text-xs">{lang === "vi" ? tone.labelVI : tone.labelEN}</span>
                <span className="text-[10px] text-zinc-500 leading-tight text-center">
                  {lang === "vi" ? tone.descVI : tone.descEN}
                </span>
                {selected && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <label className="block text-sm font-medium text-zinc-300 mb-3">
          {lang === "vi" ? "Quy tắc xử lý" : "Bot Rules"}
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.botRules.map((rule, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs text-zinc-300"
            >
              {rule}
              <button
                type="button"
                onClick={() => removeRule(i)}
                className="text-zinc-500 hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customRule}
            onChange={(e) => setCustomRule(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRule(); } }}
            placeholder={lang === "vi" ? "Thêm quy tắc..." : "Add rule..."}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="button"
            onClick={addRule}
            disabled={!customRule.trim()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-xl text-sm font-bold transition-colors"
          >
            + {lang === "vi" ? "Thêm" : "Add"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

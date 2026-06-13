"use client";
import React from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { SkipForward, LogOut } from "lucide-react";
import { STEPS } from "@/types/onboarding";

interface OnboardingProgressProps {
  step: number;
  onSkip: () => void;
  onSkipAll: () => void;
}

export default function OnboardingProgress({ step, onSkip, onSkipAll }: OnboardingProgressProps) {
  const { lang } = useLang();

  return (
    <div className="w-full">
      {/* Progress dots */}
      <div className="flex items-center gap-1 mb-2">
        {STEPS.map((s, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <div key={s.id} className="flex-1 flex items-center gap-1">
              <div
                className={cn(
                  "h-1 rounded-full flex-1 transition-all duration-300",
                  done ? "bg-blue-600" : current ? "bg-blue-500/60" : "bg-zinc-800"
                )}
              />
              {i < STEPS.length - 1 && <div className="w-1" />}
            </div>
          );
        })}
      </div>

      {/* Step indicator + Skip buttons */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 font-medium">
          {lang === "vi" ? "Bước" : "Step"} {step + 1}/{STEPS.length}
          <span className="text-zinc-600 mx-1.5">·</span>
          {STEPS[step] ? (lang === "vi" ? STEPS[step].titleVI : STEPS[step].titleEN) : ""}
        </span>
        <div className="flex items-center gap-2">
          {step > 0 && step < STEPS.length - 1 && (
            <button
              type="button"
              onClick={onSkip}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
            >
              <SkipForward className="h-3 w-3" />
              {lang === "vi" ? "Bỏ qua" : "Skip"}
            </button>
          )}
          {step === 0 && (
            <button
              type="button"
              onClick={onSkipAll}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
            >
              <LogOut className="h-3 w-3" />
              {lang === "vi" ? "Bỏ qua tất cả" : "Skip All"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

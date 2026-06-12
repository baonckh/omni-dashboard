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
    <div className="w-full space-y-3">
      {/* Progress dots */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-all duration-300",
                  done ? "bg-blue-600" : active ? "bg-blue-500" : "bg-zinc-800"
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Step labels + Skip buttons */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          {STEPS[step] ? (lang === "vi" ? STEPS[step].titleVI : STEPS[step].titleEN) : ""}
        </span>
        <div className="flex items-center gap-3">
          {step < STEPS.length - 1 && (
            <button
              type="button"
              onClick={onSkip}
              className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <SkipForward className="h-3 w-3" />
              {lang === "vi" ? "Bỏ qua" : "Skip"}
            </button>
          )}
          {step === 0 && (
            <button
              type="button"
              onClick={onSkipAll}
              className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <LogOut className="h-3 w-3" />
              {lang === "vi" ? "Bỏ qua tất cả" : "Skip All"} ▸
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { STEPS } from "@/types/onboarding";

interface OnboardingProgressProps {
  step: number;
  onSkip: () => void;
  onSkipAll: () => void;
}

export default function OnboardingProgress({ step, onSkip, onSkipAll }: OnboardingProgressProps) {
  const { t, lang } = useLang();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all",
                      active && "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
                      done && "bg-blue-600",
                      !active && !done && "bg-zinc-700"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] whitespace-nowrap transition-colors",
                      active ? "text-blue-400 font-medium" : "text-zinc-500"
                    )}
                  >
                    {lang === "vi" ? s.titleVI : s.titleEN}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "w-8 sm:w-12 h-px mx-1 sm:mx-2 mb-5 transition-colors",
                      i < step ? "bg-blue-600" : "bg-zinc-700"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {lang === "vi" ? "Bỏ qua" : "Skip"}
          </button>
          {step === 0 && (
            <button
              type="button"
              onClick={onSkipAll}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Skip All ▸ Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

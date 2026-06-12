"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Zap, ChevronRight, ChevronLeft, SkipForward } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { getSession } from "next-auth/react";
import { STEPS, emptyOnboardingData, type OnboardingData } from "@/types/onboarding";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import StepShop from "@/components/onboarding/StepShop";
import StepProducts from "@/components/onboarding/StepProducts";
import StepBot from "@/components/onboarding/StepBot";
import StepChannels from "@/components/onboarding/StepChannels";
import StepPlayground from "@/components/onboarding/StepPlayground";
import StepDeploy from "@/components/onboarding/StepDeploy";
import { completeOnboarding } from "@/lib/use-onboarding";

export default function OnboardingPage() {
  const { lang } = useLang();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(emptyOnboardingData());
  const [saving, setSaving] = useState(false);

  const update = useCallback((partial: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...partial }));
  }, []);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

  const saveToBackend = async () => {
    setSaving(true);
    try {
      const session = await getSession();
      const token = session?.user?.backendToken;
      await fetch(`${API_BASE}/onboarding/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          shop_name: data.shopName,
          shop_desc: data.shopDesc,
          shop_category: data.shopCategory,
          products: data.products.map(p => ({ name: p.name, price: p.price })),
          bot_name: data.botName,
          bot_tone: data.botTone,
          bot_rules: data.botRules,
          channels: data.channels,
        }),
      });
    } catch (e) {
      console.error("Save error:", e);
    }
    setSaving(false);
  };

  const goToDashboard = useCallback(async () => {
    await saveToBackend();
    await completeOnboarding();
    router.push("/app/overview");
  }, [data, router]);

  const handleNext = useCallback(async () => {
    if (step >= STEPS.length - 1) {
      await goToDashboard();
      return;
    }
    setStep(s => s + 1);
  }, [step, goToDashboard]);

  const handleSkip = useCallback(() => {
    if (step >= STEPS.length - 1) {
      router.push("/app/overview");
      return;
    }
    setStep(s => s + 1);
  }, [step, router]);

  const handleSkipAll = useCallback(async () => {
    await completeOnboarding();
    router.push("/app/overview");
  }, [router]);

  const handleBack = useCallback(() => {
    setStep(s => Math.max(0, s - 1));
  }, []);

  const stepComponents = [
    StepShop, StepProducts, StepBot, StepChannels, StepPlayground, StepDeploy,
  ];
  const CurrentStep = stepComponents[step];
  const t = (key: string) => key; // placeholder; i18n handled per component

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Header + Progress */}
      <div className="relative z-10 pt-8 pb-2 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded p-1">
                <Zap className="h-4 w-4 text-black fill-black" />
              </div>
              <span className="text-sm font-bold">Omni<span className="text-neutral-500">AI</span></span>
            </div>
            <span className="text-xs text-neutral-600 font-medium">
              {lang === "vi" ? "Bước" : "Step"} {step + 1} / {STEPS.length}
            </span>
          </div>
          <OnboardingProgress
            step={step}
            onSkip={handleSkip}
            onSkipAll={handleSkipAll}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-start justify-center px-6 py-6 relative z-10">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <CurrentStep
                data={data}
                onUpdate={update}
                onSkip={handleSkip}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 border-t border-white/5 py-4 px-6">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div>
            {step > 0 && (
              <button onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors font-medium"
              >
                <ChevronLeft className="h-4 w-4" /> {lang === "vi" ? "Quay lại" : "Back"}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {step < STEPS.length - 1 && (
              <button onClick={handleSkip}
                className="flex items-center gap-1.5 px-4 py-2 text-xs text-neutral-600 hover:text-neutral-400 transition-colors font-medium"
              >
                <SkipForward className="h-3.5 w-3.5" /> {lang === "vi" ? "Bỏ qua" : "Skip"}
              </button>
            )}
            <button onClick={handleNext} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              {saving
                ? (lang === "vi" ? "Đang lưu..." : "Saving...")
                : step >= STEPS.length - 1
                  ? (lang === "vi" ? "🚀 Vào Dashboard" : "🚀 Go to Dashboard")
                  : (lang === "vi" ? "Tiếp tục" : "Continue")}
              {step < STEPS.length - 1 && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

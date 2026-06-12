"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Rocket, Store, Package, Bot, Globe, Check } from "lucide-react";
import type { OnboardingData } from "@/types/onboarding";
import { CHANNELS } from "@/types/onboarding";

interface StepProps {
  data: OnboardingData;
  onUpdate: (partial: Partial<OnboardingData>) => void;
  onSkip: () => void;
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
      <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-zinc-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-zinc-200 font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

export default function StepDeploy({ data, onUpdate }: StepProps) {
  const { t, lang } = useLang();

  const connected = Object.entries(data.channels)
    .filter(([, v]) => v)
    .map(([k]) => CHANNELS.find((c) => c.key === k))
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3">
          {lang === "vi" ? "Tổng quan" : "Summary"}
        </h3>
        <SummaryCard
          icon={<Store className="w-4 h-4" />}
          label={lang === "vi" ? "Tên Shop" : "Shop Name"}
          value={data.shopName || (lang === "vi" ? "Chưa đặt tên" : "Unnamed")}
        />
        <SummaryCard
          icon={<Package className="w-4 h-4" />}
          label={lang === "vi" ? "Sản phẩm" : "Products"}
          value={`${data.products.length} sản phẩm`}
        />
        <SummaryCard
          icon={<Bot className="w-4 h-4" />}
          label={lang === "vi" ? "Bot" : "Bot"}
          value={data.botName ? `${data.botName} — ${data.botTone}` : data.botTone}
        />
        <SummaryCard
          icon={<Globe className="w-4 h-4" />}
          label={lang === "vi" ? "Kênh đã kết nối" : "Connected Channels"}
          value={connected.length > 0
            ? connected.map((c) => lang === "vi" ? c!.labelVI : c!.labelEN).join(", ")
            : (lang === "vi" ? "Chưa kết nối" : "None")
          }
        />
      </div>

      <button
        type="button"
        onClick={() => {}}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-2xl text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all"
      >
        <Rocket className="w-4 h-4" />
        {lang === "vi" ? "🚀 Vào Dashboard" : "🚀 Go to Dashboard"}
      </button>
    </motion.div>
  );
}

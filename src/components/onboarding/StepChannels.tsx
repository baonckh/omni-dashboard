"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Globe, MessageCircle, ShoppingBag, ShoppingCart, MessageSquare } from "lucide-react";
import type { OnboardingData, ChannelKey } from "@/types/onboarding";
import { CHANNELS } from "@/types/onboarding";

interface StepProps {
  data: OnboardingData;
  onUpdate: (partial: Partial<OnboardingData>) => void;
  onSkip: () => void;
}

const channelIcons: Record<ChannelKey, React.ReactNode> = {
  facebook: <MessageCircle className="w-5 h-5" />,
  tiktok: <ShoppingBag className="w-5 h-5" />,
  shopee: <ShoppingCart className="w-5 h-5" />,
  zalo: <MessageSquare className="w-5 h-5" />,
  web: <Globe className="w-5 h-5" />,
};

export default function StepChannels({ data, onUpdate }: StepProps) {
  const { t, lang } = useLang();

  const toggle = (key: ChannelKey) => {
    onUpdate({ channels: { ...data.channels, [key]: !data.channels[key] } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {CHANNELS.map((ch) => {
        const enabled = data.channels[ch.key];
        const isWeb = ch.key === "web";
        return (
          <div key={ch.key}>
            <div
              className={cn(
                "flex items-center justify-between rounded-xl border p-4 transition-all",
                enabled
                  ? "border-blue-500/40 bg-blue-500/5"
                  : isWeb
                    ? "border-amber-500/30 bg-amber-500/[0.03]"
                    : "border-white/10 bg-white/[0.02]",
                isWeb && !enabled && "bg-gradient-to-r from-amber-500/[0.04] to-transparent"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-sm", enabled ? "bg-blue-500/20 text-blue-400" : "bg-white/[0.06] text-zinc-400")}>
                  {channelIcons[ch.key]}
                </span>
                <div>
                  <span className="text-sm font-medium text-zinc-200">
                    {lang === "vi" ? ch.labelVI : ch.labelEN}
                  </span>
                  {isWeb && (
                    <span className="ml-2 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">🆕</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle(ch.key)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  enabled
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-zinc-400 hover:bg-white/[0.15]"
                )}
              >
                {enabled
                  ? lang === "vi" ? "Đã kết nối" : "Connected"
                  : lang === "vi" ? "Kết nối" : "Connect"
                }
              </button>
            </div>
            {isWeb && enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 rounded-xl border border-white/10 bg-zinc-900 p-3 overflow-hidden"
              >
                <pre className="text-[11px] text-zinc-400 leading-relaxed font-mono whitespace-pre-wrap">
                  {`<script src="https://omni.ai/widget.js" data-shop-id="${data.shopName ? data.shopName.toLowerCase().replace(/\s+/g, "-") : "your-shop"}" defer></script>`}
                </pre>
              </motion.div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}

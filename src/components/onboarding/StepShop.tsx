"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Store, Package } from "lucide-react";
import type { OnboardingData } from "@/types/onboarding";
import { CATEGORIES } from "@/types/onboarding";

interface StepProps {
  data: OnboardingData;
  onUpdate: (partial: Partial<OnboardingData>) => void;
  onSkip: () => void;
}

export default function StepShop({ data, onUpdate }: StepProps) {
  const { t, lang } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            <Store className="inline w-4 h-4 mr-1.5 text-blue-400" />
            {lang === "vi" ? "Tên Shop" : "Shop Name"}
          </label>
          <input
            type="text"
            value={data.shopName}
            onChange={(e) => onUpdate({ shopName: e.target.value })}
            placeholder={lang === "vi" ? "VD: Omni Fashion store" : "e.g. Omni Fashion store"}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            {lang === "vi" ? "Mô tả Shop" : "Shop Description"}
          </label>
          <textarea
            value={data.shopDesc}
            onChange={(e) => onUpdate({ shopDesc: e.target.value })}
            placeholder={lang === "vi" ? "Shop chuyên bán thời trang nam nữ, áo quần, phụ kiện..." : "Shop selling fashion, clothes, accessories..."}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <label className="block text-sm font-medium text-zinc-300 mb-3">
          <Package className="inline w-4 h-4 mr-1.5 text-blue-400" />
          {lang === "vi" ? "Ngành hàng" : "Category"}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onUpdate({ shopCategory: cat })}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                data.shopCategory === cat
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

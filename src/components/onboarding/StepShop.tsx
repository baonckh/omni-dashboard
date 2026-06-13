"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Store, Package, Plus } from "lucide-react";
import type { OnboardingData } from "@/types/onboarding";
import { CATEGORIES } from "@/types/onboarding";

interface StepProps {
  data: OnboardingData;
  onUpdate: (partial: Partial<OnboardingData>) => void;
  onSkip: () => void;
}

const OTHER_KEY = "Khác";

export default function StepShop({ data, onUpdate }: StepProps) {
  const { lang } = useLang();
  const isCustom = data.shopCategory && !CATEGORIES.includes(data.shopCategory);

  const handleCategoryClick = (cat: string) => {
    if (cat === OTHER_KEY) {
      // Click "Khác" → show input, clear current selection
      onUpdate({ shopCategory: "" });
    } else {
      onUpdate({ shopCategory: cat });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Shop Info Card */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
            {lang === "vi" ? "TÊN SHOP" : "SHOP NAME"}
          </label>
          <input
            type="text"
            value={data.shopName}
            onChange={(e) => onUpdate({ shopName: e.target.value })}
            placeholder={lang === "vi" ? "VD: Omni Fashion Store" : "e.g. Omni Fashion Store"}
            className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
            {lang === "vi" ? "MÔ TẢ" : "DESCRIPTION"}
          </label>
          <textarea
            value={data.shopDesc}
            onChange={(e) => onUpdate({ shopDesc: e.target.value })}
            placeholder={lang === "vi" ? "Shop chuyên bán thời trang nam nữ, áo quần, phụ kiện..." : "Shop selling fashion, clothes, accessories..."}
            rows={3}
            className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors resize-none"
          />
        </div>
      </div>

      {/* Category Card */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <label className="block text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">
          {lang === "vi" ? "NGÀNH HÀNG" : "CATEGORY"}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={cn(
                "px-3 py-2.5 rounded-xl text-xs font-medium border transition-all",
                data.shopCategory === cat && !isCustom
                  ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                  : "bg-white/[0.03] border-white/[0.06] text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300"
              )}
            >
              {cat === OTHER_KEY ? (lang === "vi" ? "Khác..." : "Other...") : cat}
            </button>
          ))}
        </div>

        {/* Custom input — chỉ hiện khi bấm "Khác" */}
        {(isCustom || data.shopCategory === "") && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
          >
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Plus className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <input
                type="text"
                value={isCustom ? data.shopCategory : ""}
                onChange={(e) => onUpdate({ shopCategory: e.target.value })}
                placeholder={lang === "vi" ? "Nhập ngành hàng..." : "Enter category..."}
                className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

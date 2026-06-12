"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Upload, Package } from "lucide-react";
import type { OnboardingData, Product } from "@/types/onboarding";

interface StepProps {
  data: OnboardingData;
  onUpdate: (partial: Partial<OnboardingData>) => void;
  onSkip: () => void;
}

function parseCSV(text: string): Product[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const parts = line.split(",").map((s) => s.trim());
      const name = parts[0] || "";
      const price = parseFloat(parts[1]) || 0;
      return { name, price };
    })
    .filter((p) => p.name.length > 0);
}

export default function StepProducts({ data, onUpdate }: StepProps) {
  const { t, lang } = useLang();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      onUpdate({ products: [...data.products, ...parsed] });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const removeProduct = (index: number) => {
    const next = data.products.filter((_, i) => i !== index);
    onUpdate({ products: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <label className="block text-sm font-medium text-zinc-300">
          <Upload className="inline w-4 h-4 mr-1.5 text-blue-400" />
          {lang === "vi" ? "Nhập sản phẩm (CSV)" : "Import Products (CSV)"}
        </label>
        <textarea
          placeholder={lang === "vi" ? "Áo thun nam, 150000\nQuần jean nữ, 350000\nMỗi dòng: tên, giá" : "T-shirt, 15\nJeans, 35\nOne product per line: name, price"}
          rows={5}
          onChange={(e) => {
            const parsed = parseCSV(e.target.value);
            onUpdate({ products: parsed });
          }}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors resize-none"
        />

        <div
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/20 bg-white/[0.02] text-zinc-400 text-sm cursor-pointer hover:bg-white/[0.04] hover:text-zinc-300 transition-colors"
        >
          <Upload className="w-4 h-4" />
          {lang === "vi" ? "Hoặc tải file .csv" : "Or upload .csv file"}
        </div>
        <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFile} />
      </div>

      {data.products.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-zinc-300">
              {lang === "vi" ? `Sản phẩm (${data.products.length})` : `Products (${data.products.length})`}
            </span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {data.products.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] text-sm">
                <span className="text-zinc-200 truncate">{p.name}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-zinc-400">{p.price.toLocaleString()}đ</span>
                  <button
                    type="button"
                    onClick={() => removeProduct(i)}
                    className="text-zinc-500 hover:text-red-400 transition-colors text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

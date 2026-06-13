"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { MessageSquare, ArrowRight, Settings, Cpu } from "lucide-react";
import Link from "next/link";
import type { OnboardingData } from "@/types/onboarding";

interface StepProps {
  data: OnboardingData;
  onUpdate: (partial: Partial<OnboardingData>) => void;
  onSkip: () => void;
}

export default function StepPlayground({ data, onSkip }: StepProps) {
  const { lang } = useLang();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="text-center space-y-3 py-6">
        <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
          <Cpu className="h-8 w-8 text-purple-400" />
        </div>
        <h2 className="text-xl font-extrabold tracking-tight">
          {lang === "vi" ? "Cấu hình AI Provider" : "Configure AI Provider"}
        </h2>
        <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
          {lang === "vi"
            ? "Kết nối OpenAI, Gemini hoặc OpenRouter để bot có thể trả lời khách hàng thực tế. Bạn có thể cấu hình sau trong Settings."
            : "Connect OpenAI, Gemini or OpenRouter so your bot can reply to customers. You can set this up later in Settings."}
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center">
            <Cpu className="h-5 w-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">{lang === "vi" ? "AI API Management" : "AI API Management"}</p>
            <p className="text-xs text-zinc-500">{lang === "vi" ? "OpenAI, Gemini, OpenRouter, Voyage AI" : "OpenAI, Gemini, OpenRouter, Voyage AI"}</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-2">
          <p className="text-xs text-zinc-400 leading-relaxed">
            {lang === "vi"
              ? "Sau khi vào Dashboard, vào mục Settings → AI Providers để thêm API key. Bot sẽ tự động sử dụng key đó để trả lời khách hàng."
              : "After entering the Dashboard, go to Settings → AI Providers to add your API key. The bot will automatically use it to reply to customers."}
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
            {lang === "vi" ? "Có thể bỏ qua bước này, cấu hình sau" : "You can skip this, configure later"}
          </div>
        </div>

        <Link
          href="/app/settings"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all active:scale-[0.97]"
        >
          <Settings className="h-4 w-4" />
          {lang === "vi" ? "Đến Settings" : "Go to Settings"}
        </Link>

        <button
          type="button"
          onClick={onSkip}
          className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 py-2 transition-colors"
        >
          {lang === "vi" ? "Bỏ qua, để sau" : "Skip, do it later"}
        </button>
      </div>

      {/* Demo chat preview */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden opacity-60">
        <div className="p-3 border-b border-white/[0.06] flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-xs text-zinc-500 font-medium">{lang === "vi" ? "Xem trước Chat" : "Chat Preview"}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">{lang === "vi" ? "Demo" : "Demo"}</span>
        </div>
        <div className="p-3 space-y-2.5">
          <div className="flex justify-end">
            <div className="bg-blue-600/60 text-white text-xs px-3 py-2 rounded-2xl rounded-br-sm max-w-[80%]">
              {lang === "vi" ? "Cho tôi hỏi áo thun nam có màu đen không?" : "Do you have this T-shirt in black?"}
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-zinc-800/60 text-zinc-400 text-xs px-3 py-2 rounded-2xl rounded-bl-sm max-w-[80%] italic">
              {lang === "vi" ? "AI sẽ trả lời sau khi cấu hình API Key..." : "AI will reply after API Key is configured..."}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

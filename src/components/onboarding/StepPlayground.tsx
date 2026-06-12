"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { MessageSquare, ArrowRight, Bot, User } from "lucide-react";
import type { OnboardingData } from "@/types/onboarding";

interface StepProps {
  data: OnboardingData;
  onUpdate: (partial: Partial<OnboardingData>) => void;
  onSkip: () => void;
}

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

const botReplies = [
  "Dạ, em có thể giúp gì cho anh/chị ạ?",
  "Sản phẩm này hiện đang có sẵn hàng ạ!",
  "Dạ, giá chỉ từ 150,000đ thôi ạ.",
  "Em có thể tư vấn thêm cho mình nhé!",
  "Đơn hàng sẽ được giao trong 2-3 ngày ạ.",
  "Cảm ơn anh/chị đã quan tâm đến shop ạ!",
  "Mình muốn đặt màu nào ạ? Hiện có đỏ, xanh, đen ạ.",
  "Em sẽ chuyển thông tin cho bên giao hàng ngay ạ!",
];

const quickButtons = ["Xin chào", "Có sản phẩm mới không?", "Giao hàng thế nào?"];

export default function StepPlayground({ data, onUpdate }: StepProps) {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: lang === "vi" ? "Chào bạn! Em có thể giúp gì cho bạn hôm nay?" : "Hi there! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      setLoading(false);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col h-[420px]"
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-2.5", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "bot" && (
              <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-blue-400" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-white/[0.06] text-zinc-200 rounded-bl-md"
              )}
            >
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-zinc-600 flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-zinc-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="bg-white/[0.06] px-3.5 py-2 rounded-2xl rounded-bl-md">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-3 space-y-2">
        <div className="flex gap-2">
          {quickButtons.map((btn) => (
            <button
              key={btn}
              type="button"
              onClick={() => sendMessage(btn)}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.08] transition-colors disabled:opacity-40"
            >
              {btn}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder={lang === "vi" ? "Nhập tin nhắn..." : "Type a message..."}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="px-3 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-xl transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

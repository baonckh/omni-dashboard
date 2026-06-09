"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Search, Package, Heart, MessageSquare } from "lucide-react";
import { TypewriterText } from "@/components/TextAnimations";

type Message = { role: "user" | "bot" | "step"; text: string; sub?: string };

const steps: Message[] = [
  { role: "user", text: "Cho tôi hỏi áo thun nam có màu đen không?" },
  { role: "step", text: "🔍 Phân tích intent...", sub: "Intent: hỏi sản phẩm | Entity: áo thun nam, màu đen" },
  { role: "step", text: "📦 Truy xuất sản phẩm...", sub: "Tìm thấy: Áo thun nam cotton — 4 variants" },
  { role: "step", text: "🎨 Kiểm tra variant + tồn kho...", sub: "Màu đen: còn 28 | Size S-XL đầy đủ" },
  { role: "step", text: "💬 Áp dụng phong cách shop...", sub: "Tone: thân thiện | Xưng hô: shop mình" },
  { role: "bot", text: "Có bạn nhé! Áo thun nam đen còn size S đến XL đầy đủ ạ. Giá 150.000đ, chất liệu cotton 100%. Bạn muốn đặt size nào để mình gửi link đặt hàng? Tặng bạn mã giảm 10% cho đơn đầu tiên luôn!" },
];

const PER_STEP = 1800;
const PAUSE = 7000;

export default function ChatDemo() {
  const [visible, setVisible] = useState(0);

  const tick = useCallback(() => {
    setVisible(prev => (prev >= steps.length ? prev : prev + 1));
  }, []);

  useEffect(() => {
    if (visible >= steps.length) {
      const t = setTimeout(() => setVisible(0), PAUSE);
      return () => clearTimeout(t);
    }
    const t = setTimeout(tick, PER_STEP);
    return () => clearTimeout(t);
  }, [visible, tick]);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-600/5 bg-[#0A0A0F]">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-black/40">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-white">OmniAI Bot</p>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-500/20 text-green-400 border border-green-500/20">LIVE</span>
          </div>
          <p className="text-[10px] text-zinc-500">AI trả lời trong 1-3 giây — 24/7</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-500 font-medium">Online</span>
        </div>
      </div>

      <div className="p-4 h-[420px] flex flex-col justify-end overflow-hidden">
        <AnimatePresence mode="popLayout">
          {steps.slice(0, visible).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "step" ? (
                <div className="w-full max-w-[92%] mx-auto">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600/5 border border-blue-500/10">
                    <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-600/10 shrink-0">
                      {msg.text.startsWith("🔍") ? <Search className="h-3 w-3 text-blue-400" /> :
                       msg.text.startsWith("📦") ? <Package className="h-3 w-3 text-blue-400" /> :
                       msg.text.startsWith("🎨") ? <Heart className="h-3 w-3 text-blue-400" /> :
                       <MessageSquare className="h-3 w-3 text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-300 font-medium truncate">{msg.text}</p>
                      {msg.sub && <p className="text-[10px] text-blue-400/60 truncate">{msg.sub}</p>}
                    </div>
                    <div className="h-2 w-2 rounded-full bg-green-500/60 shrink-0" />
                  </div>
                </div>
              ) : msg.role === "bot" ? (
                <div className="flex items-start gap-2 max-w-[88%]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-blue-600/20">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed bg-gradient-to-br from-blue-600/15 to-purple-600/10 text-zinc-200 border border-blue-500/5">
                    <TypewriterText text={msg.text} speed={18} />
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-green-500 font-medium">✅ AI</span>
                      <span className="text-[9px] text-zinc-600">• 1.2 giây</span>
                      <span className="text-[9px] text-zinc-600">• 24/7</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 max-w-[80%] flex-row-reverse">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-white">K</span>
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed bg-zinc-800/80 text-zinc-200 border border-white/5">
                    {msg.text}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {visible > 0 && visible < steps.length && steps[visible]?.role !== "user" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 px-2 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0.15s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0.3s" }} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Search, Package, Heart, MessageSquare, Zap } from "lucide-react";

type Message = {
  role: "user" | "bot" | "step";
  text: string;
  sub?: string;
};

const steps: Message[] = [
  { role: "user", text: "Cho tôi hỏi áo thun nam có màu đen không?" },
  { role: "step", text: "🔍 Đang phân tích intent...", sub: "Intent: hỏi về sản phẩm | Entity: áo thun nam, màu đen" },
  { role: "step", text: "📦 Truy xuất sản phẩm...", sub: "Tìm thấy: Áo thun nam cotton — 4 variants (đen, trắng, xám, xanh navy)" },
  { role: "step", text: "🎨 Kiểm tra tồn kho & variant...", sub: "Màu đen: còn 28 sản phẩm | Size S-XL đầy đủ" },
  { role: "step", text: "💬 Áp dụng phong cách shop...", sub: "Tone: thân thiện, chuyên nghiệp | Style: xưng hô 'shop mình'" },
  { role: "bot", text: "Có bạn nhé! Áo thun nam đen còn size S đến XL đầy đủ ạ. Giá 150.000đ, chất liệu cotton 100%. Bạn muốn đặt size nào để mình gửi link đặt hàng? Tặng bạn mã giảm 10% cho đơn đầu tiên luôn!" },
];

const stepIcons: Record<string, React.ReactNode> = {
  "🔍": <Search className="h-3.5 w-3.5" />,
  "📦": <Package className="h-3.5 w-3.5" />,
  "🎨": <Heart className="h-3.5 w-3.5" />,
  "💬": <MessageSquare className="h-3.5 w-3.5" />,
};

export default function ChatDemo() {
  const [visible, setVisible] = useState(0);
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    if (visible >= steps.length) return;

    const msg = steps[visible];
    let delay = 1200;

    if (msg.role === "user") delay = 800;
    else if (msg.role === "step") delay = 900;
    else if (msg.role === "bot") delay = 600;

    const timer = setTimeout(() => {
      setThinking(false);
      setVisible((v) => v + 1);
    }, delay);

    if (visible > 0 && steps[visible - 1]?.role !== "user") {
      setThinking(false);
    }
    if (msg.role !== "user") {
      setThinking(true);
    }

    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-600/5 bg-[#0A0A0F]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-black/40">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-white">OmniAI Bot</p>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-500/20 text-green-400 border border-green-500/20">LIVE</span>
          </div>
          <p className="text-[10px] text-zinc-500">Nhân viên CSKH AI — phản hồi trong 1-3s</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-500 font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 min-h-[400px] flex flex-col justify-end space-y-3">
        <AnimatePresence mode="popLayout">
          {steps.slice(0, visible).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "step" ? (
                /* Internal Bot Step */
                <div className="w-full max-w-[90%] mx-auto">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600/5 border border-blue-500/10">
                    <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-600/10 shrink-0">
                      {stepIcons[msg.text.slice(0, 2)] || <Zap className="h-3 w-3 text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-300 font-medium truncate">{msg.text}</p>
                      {msg.sub && <p className="text-[10px] text-blue-400/60 truncate">{msg.sub}</p>}
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: 12 }}
                      className="h-2 w-3 rounded-full bg-green-500/50 shrink-0"
                    />
                  </div>
                </div>
              ) : msg.role === "bot" ? (
                /* Bot Reply */
                <div className="flex items-start gap-2 max-w-[88%]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-blue-600/20">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed bg-gradient-to-br from-blue-600/15 to-purple-600/10 text-zinc-200 border border-blue-500/5 shadow-lg shadow-blue-600/5">
                    {msg.text}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-green-500 font-medium">✅ Trả lời từ AI</span>
                      <span className="text-[9px] text-zinc-600">• 1.2s</span>
                      <span className="text-[9px] text-zinc-600">• 24/7</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* User Message */
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

        {/* Thinking Indicator */}
        {thinking && visible < steps.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 px-4 py-3"
          >
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-600/5 border border-blue-500/10">
              <div className="flex gap-1">
                <motion.span className="w-1.5 h-1.5 rounded-full bg-blue-500" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-blue-500" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-blue-500" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} />
              </div>
              <span className="text-xs text-blue-300 font-medium">AI đang suy nghĩ...</span>
            </div>
          </motion.div>
        )}

        {/* Steps Legend */}
        {visible >= steps.length && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 pt-2 text-[9px] text-zinc-600"
          >
            <span>🔍 Intent Detection</span>
            <span>📦 Product Match</span>
            <span>🎨 Variant Check</span>
            <span>💬 Shop Tone</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

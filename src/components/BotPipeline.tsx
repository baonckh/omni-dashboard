"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Database, Search, Heart, MessageSquare, Zap, FileText, CheckCircle2 } from "lucide-react";
import { useLang } from "@/lib/i18n";

export type Stage = "idle" | "ingest" | "vector" | "retrieve" | "filter" | "persona" | "respond";

const VI = {
  stages: ["Nhập dữ liệu", "Vector hóa", "Truy xuất", "Chọn lọc", "Cá tính shop", "Phản hồi"],
  s1: "Đang nhập dữ liệu vào hệ thống...",
  docs: ["Áo thun nam - 150.000đ - Cotton 100%", "Quần jean nữ - 350.000đ - Size S-M-L", "Chính sách đổi trả 7 ngày", "Giảm 10% cho đơn đầu tiên"],
  imported: "✓ Đã nhập",
  s2: "Vector hóa và lưu vào knowledge base...",
  s3: "Truy xuất thông tin liên quan...",
  s3_q: "Query: \"áo thun nam màu đen\"",
  s3_results: ["Áo thun nam cotton trắng - 150.000đ", "Áo thun nam cotton đen - 150.000đ", "Áo thun nam cotton xám - 150.000đ"],
  s4: "Chọn lọc màu sắc & tồn kho...",
  s4_variants: ["Màu đen", "Màu trắng", "Màu xám", "Màu xanh navy"],
  s4_stock: ["còn", "Hết"],
  s4_selected: "Đã chọn: Áo thun nam cotton màu đen — Size S-XL — 150.000đ",
  s5: "Áp dụng tính cách & chính sách shop...",
  s5_items: [
    { label: "Giọng văn", value: "Thân thiện, ấm áp, xưng hô 'shop mình'" },
    { label: "Chính sách", value: "Đổi trả 7 ngày, miễn phí vận chuyển đơn >300k" },
    { label: "Ưu đãi", value: "Giảm 10% cho đơn đầu tiên, mã: WELCOME10" },
  ],
  s6: "Bot đang tạo phản hồi...",
  s6_reply: "Có bạn nhé! Áo thun nam đen còn size S đến XL đầy đủ ạ. Giá 150.000đ, chất liệu cotton 100%. Bạn muốn đặt size nào để mình gửi link đặt hàng? Tặng bạn mã giảm 10% cho đơn đầu tiên luôn!",
  idle_text: "Bot đang chờ yêu cầu...",
  idle_sub: "Pipeline sẽ tự động chạy để demo",
};

const EN = {
  stages: ["Ingest", "Vectorize", "Retrieve", "Filter", "Persona", "Respond"],
  s1: "Ingesting data into system...",
  docs: ["T-shirt - $6 - 100% Cotton", "Jeans - $14 - Size S-M-L", "7-day return policy", "10% off first order"],
  imported: "✓ Imported",
  s2: "Vectorizing and storing to knowledge base...",
  s3: "Retrieving relevant information...",
  s3_q: "Query: \"black T-shirt\"",
  s3_results: ["White cotton T-shirt - $6", "Black cotton T-shirt - $6", "Gray cotton T-shirt - $6"],
  s4: "Filtering variant & stock...",
  s4_variants: ["Black", "White", "Gray", "Navy"],
  s4_stock: ["in stock", "Out"],
  s4_selected: "Selected: Black cotton T-shirt — Size S-XL — $6",
  s5: "Applying shop tone & policies...",
  s5_items: [
    { label: "Tone", value: "Friendly, warm, casual style" },
    { label: "Policy", value: "7-day returns, free shipping over $12" },
    { label: "Promo", value: "10% first order, code: WELCOME10" },
  ],
  s6: "Bot is generating response...",
  s6_reply: "Yes we do! Black cotton T-shirt is available in sizes S to XL. Price: $6, 100% cotton. Which size would you like? I'll send you the order link. Here's a 10% discount code for your first order!",
  idle_text: "Bot waiting for request...",
  idle_sub: "Pipeline will auto-run for demo",
};

const STAGE_ORDER: Stage[] = ["idle", "ingest", "vector", "retrieve", "filter", "persona", "respond"];

export default function BotPipeline({ controlledStage }: { controlledStage?: Stage }) {
  const { lang } = useLang();
  const t = lang === "vi" ? VI : EN;
  const isControlled = controlledStage !== undefined;
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);

  const effectiveStage = isControlled ? controlledStage : stage;
  const effectiveProgress = isControlled
    ? Math.max(0, STAGE_ORDER.indexOf(controlledStage) / (STAGE_ORDER.length - 1))
    : progress;

  const STAGES: { key: Stage; label: string; icon: typeof FileText }[] = [
    { key: "ingest", label: t.stages[0], icon: FileText },
    { key: "vector", label: t.stages[1], icon: Database },
    { key: "retrieve", label: t.stages[2], icon: Search },
    { key: "filter", label: t.stages[3], icon: Heart },
    { key: "persona", label: t.stages[4], icon: Heart },
    { key: "respond", label: t.stages[5], icon: MessageSquare },
  ];

  useEffect(() => {
    if (isControlled) return;
    const sequence: Stage[] = ["ingest", "vector", "retrieve", "filter", "persona", "respond"];
    let timer: ReturnType<typeof setTimeout>;
    const run = (idx: number) => {
      if (idx >= sequence.length) {
        timer = setTimeout(() => { setStage("idle"); setProgress(0); timer = setTimeout(() => run(0), 900); }, 4000);
        return;
      }
      setStage(sequence[idx]);
      setProgress((idx + 1) / sequence.length);
      timer = setTimeout(() => run(idx + 1), 2300);
    };
    timer = setTimeout(() => run(0), 500);
    return () => clearTimeout(timer);
  }, [isControlled]);

  const currentIdx = STAGES.findIndex((s) => s.key === effectiveStage);
  const isActive = (idx: number) => idx <= currentIdx;
  const isCurrent = (idx: number) => idx === currentIdx;

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0A0A0F] overflow-hidden shadow-2xl shadow-blue-600/5">
      <div className="px-5 py-3 border-b border-white/10 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-bold text-white">{lang === "vi" ? "Quy trình AI" : "Bot Intelligence Pipeline"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-500 font-medium">
            {effectiveStage === "idle" ? (lang === "vi" ? "Sẵn sàng" : "Ready") : `${lang === "vi" ? "Bước" : "Step"} ${currentIdx + 1}/${STAGES.length}`}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-green-600"
            initial={{ width: "0%" }} animate={{ width: `${effectiveProgress * 100}%` }} transition={{ duration: 0.6 }} />
        </div>

        <div className="grid grid-cols-6 gap-2">
          {STAGES.map((s, idx) => (
            <div key={s.key} className="flex flex-col items-center gap-1.5">
              <motion.div animate={{ scale: isCurrent(idx) ? [1, 1.15, 1] : 1, backgroundColor: isActive(idx) ? "rgba(37,99,235,0.15)" : "rgba(255,255,255,0.03)", borderColor: isActive(idx) ? "rgba(37,99,235,0.3)" : "rgba(255,255,255,0.06)" }}
                className="w-9 h-9 rounded-xl border flex items-center justify-center">
                <s.icon className={`h-4 w-4 ${isActive(idx) ? "text-blue-500" : "text-zinc-600"}`} />
              </motion.div>
              <span className={`text-[8px] font-medium text-center leading-tight ${isActive(idx) ? "text-zinc-300" : "text-zinc-700"}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="min-h-[260px] rounded-xl border border-white/5 bg-black/40 p-4 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {effectiveStage === "ingest" && (
              <motion.div key="ingest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                <p className="text-xs text-blue-400 font-medium mb-3 flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> {t.s1}</p>
                {t.docs.map((doc, i) => (
                  <motion.div key={doc} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/5 border border-blue-500/10 text-xs text-zinc-300">
                    <FileText className="h-3 w-3 text-blue-400 shrink-0" />
                    <span className="truncate">{doc}</span>
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto text-[10px] text-green-500 shrink-0">{t.imported}</motion.span>
                  </motion.div>
                ))}
              </motion.div>
            )}
            {effectiveStage === "vector" && (
              <motion.div key="vector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <p className="text-xs text-cyan-400 font-medium flex items-center gap-2"><Database className="h-3.5 w-3.5" /> {t.s2}</p>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-600/5 border border-cyan-500/10">
                  <Database className="h-8 w-8 text-cyan-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white">Vector Database</p>
                    <p className="text-[10px] text-zinc-500">{lang === "vi" ? "Embeddings: 1.248 vectors • Dimension: 1536" : "Embeddings: 1,248 vectors • Dimension: 1536"}</p>
                  </div>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}><Database className="h-4 w-4 text-cyan-500" /></motion.div>
                </div>
                <div className="flex gap-1.5 justify-center py-2">
                  {[...Array(8)].map((_, i) => (
                    <motion.div key={i} animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }} className="w-2 h-2 rounded-full bg-cyan-500/60" />
                  ))}
                </div>
              </motion.div>
            )}
            {effectiveStage === "retrieve" && (
              <motion.div key="retrieve" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <p className="text-xs text-purple-400 font-medium flex items-center gap-2"><Search className="h-3.5 w-3.5" /> {t.s3}</p>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-600/5 border border-purple-500/10">
                  <Search className="h-5 w-5 text-purple-500" /><div className="flex-1"><p className="text-xs font-bold text-white">{t.s3_q}</p><p className="text-[10px] text-zinc-500">{lang === "vi" ? "Score: 0.94 • Top matches: 3" : "Score: 0.94 • Top matches: 3"}</p></div>
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="px-2 py-0.5 rounded text-[9px] bg-purple-600/20 text-purple-400 border border-purple-500/20">{lang === "vi" ? "Đang so khớp" : "Matching"}</motion.div>
                </div>
                <div className="space-y-1.5">
                  {t.s3_results.map((r, i) => (
                    <motion.div key={r} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600/5 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span className="flex-1 text-zinc-300 truncate">{r}</span>
                      <span className="text-[10px] text-purple-400 shrink-0">{i === 0 ? "0.94" : i === 1 ? "0.92" : "0.88"}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {effectiveStage === "filter" && (
              <motion.div key="filter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <p className="text-xs text-pink-400 font-medium flex items-center gap-2"><Heart className="h-3.5 w-3.5" /> {t.s4}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { variant: t.s4_variants[0], stock: 28, selected: true },
                    { variant: t.s4_variants[1], stock: 15, selected: false },
                    { variant: t.s4_variants[2], stock: 22, selected: false },
                    { variant: t.s4_variants[3], stock: 0, selected: false },
                  ].map((v, i) => (
                    <motion.div key={v.variant} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                      className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-between ${v.selected ? "bg-pink-600/10 border-pink-500/30" : "bg-white/5 border-white/5 opacity-50"}`}>
                      <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${v.selected ? "bg-pink-500" : "bg-zinc-600"}`} /><span className="text-zinc-300">{v.variant}</span></div>
                      <span className={`text-[10px] ${v.stock > 0 ? "text-green-500" : "text-red-500"}`}>{v.stock > 0 ? `${v.stock} ${t.s4_stock[0]}` : t.s4_stock[1]}</span>
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600/10 border border-green-500/20 text-xs text-green-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />{t.s4_selected}
                </motion.div>
              </motion.div>
            )}
            {effectiveStage === "persona" && (
              <motion.div key="persona" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <p className="text-xs text-orange-400 font-medium flex items-center gap-2"><Heart className="h-3.5 w-3.5" /> {t.s5}</p>
                <div className="space-y-2">
                  {t.s5_items.map((item, i) => (
                    <motion.div key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-600/5 border border-orange-500/10 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-orange-500 shrink-0" />
                      <span className="text-orange-300 font-medium min-w-[80px]">{item.label}:</span>
                      <span className="text-zinc-300">{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {effectiveStage === "respond" && (
              <motion.div key="respond" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <p className="text-xs text-green-400 font-medium flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" /> {t.s6}</p>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-green-600/10 to-green-600/5 border border-green-500/15">
                  <div className="flex items-start gap-2">
                    <Bot className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-zinc-200 leading-relaxed">{t.s6_reply}</p>
                      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/5">
                        <span className="text-[10px] text-green-500 font-medium">✅ AI</span>
                        <span className="text-[9px] text-zinc-600">• 4 {lang === "vi" ? "bước xử lý" : "steps"}</span>
                        <span className="text-[9px] text-zinc-600">• 1.2s</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
            {effectiveStage === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full py-8 text-zinc-600">
                <Bot className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-xs font-medium">{t.idle_text}</p>
                <p className="text-[10px] mt-1">{t.idle_sub}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

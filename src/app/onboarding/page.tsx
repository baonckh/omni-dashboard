"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Package,
  Bot,
  Facebook,
  MessageSquare,
  Rocket,
  ChevronRight,
  ChevronLeft,
  SkipForward,
  Upload,
  Check,
  Sparkles,
  Zap,
  Globe,
  Smile,
  TrendingUp,
  HeartHandshake,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type OnboardingData = {
  shopName: string;
  shopDesc: string;
  shopCategory: string;
  products: { name: string; price: string }[];
  botName: string;
  botTone: string;
  facebookConnected: boolean;
};

const STEPS = [
  { id: "shop", title: "Thiết lập Shop", icon: Store },
  { id: "products", title: "Sản phẩm", icon: Package },
  { id: "persona", title: "Tính cách Bot", icon: Bot },
  { id: "facebook", title: "Kết nối Facebook", icon: Facebook },
  { id: "test", title: "Dùng thử", icon: MessageSquare },
  { id: "deploy", title: "Hoàn tất", icon: Rocket },
];

const tones = [
  { id: "chuyen-nghiep", label: "Chuyên nghiệp", desc: "Lịch sự, trang trọng", icon: TrendingUp, color: "text-blue-500", border: "border-blue-500/30" },
  { id: "than-thien", label: "Thân thiện", desc: "Ấm áp, gần gũi", icon: HeartHandshake, color: "text-pink-500", border: "border-pink-500/30" },
  { id: "hai-huoc", label: "Hài hước", desc: "Vui vẻ, trẻ trung", icon: Smile, color: "text-orange-500", border: "border-orange-500/30" },
];

const categories = [
  "Thời trang", "Điện tử", "Nhà cửa & Đời sống", "Mỹ phẩm",
  "Thực phẩm", "Mẹ & Bé", "Thể thao", "Khác",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    shopName: "",
    shopDesc: "",
    shopCategory: "",
    products: [],
    botName: "",
    botTone: "",
    facebookConnected: false,
  });
  const [productInput, setProductInput] = useState("");
  const [testMessage, setTestMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ role: string; text: string }[]>([]);
  const [saving, setSaving] = useState(false);

  const update = (partial: Partial<OnboardingData>) => setData({ ...data, ...partial });

  const canNext = () => {
    if (step === 0) return true;
    if (step === 3) return true;
    return true; // All steps skippable
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

  const handleNext = async () => {
    if (step === 5) {
      // Save ALL onboarding data to backend API
      setSaving(true);
      try {
        const session = await import("next-auth/react").then(m => m.getSession());
        const token = session?.user?.backendToken;
        const res = await fetch(`${API_BASE}/onboarding/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            shop_name: data.shopName,
            shop_desc: data.shopDesc,
            shop_category: data.shopCategory,
            bot_name: data.botName,
            bot_tone: data.botTone,
            products: data.products.map(p => ({ name: p.name, price: parseFloat(p.price) || 0 })),
          }),
        });
        if (!res.ok) console.error("Save onboarding failed");
      } catch (err) {
        console.error("Save onboarding error:", err);
      }
      setSaving(false);
      router.push("/app/overview");
      return;
    }
    setStep(Math.min(step + 1, STEPS.length - 1));
  };

  const handleSkip = () => {
    if (step === 5) {
      router.push("/app/overview");
      return;
    }
    setStep(Math.min(step + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep(Math.max(step - 1, 0));

  const parseProducts = (text: string) => {
    const lines = text.trim().split("\n").filter(Boolean);
    const parsed = lines.map((line) => {
      const parts = line.split(",");
      return { name: parts[0]?.trim() || "", price: parts[1]?.trim() || "0" };
    }).filter((p) => p.name);
    update({ products: parsed });
  };

  const sendTestMessage = async () => {
    if (!testMessage.trim()) return;
    setChatLog((prev) => [...prev, { role: "user", text: testMessage }]);
    setTestMessage("");

    // Simulate AI response
    setTimeout(() => {
      const replies = [
        "Cảm ơn bạn đã quan tâm! Sản phẩm này hiện đang có sẵn với giá ưu đãi.",
        "Dạ, shop mình hỗ trợ đổi trả trong vòng 7 ngày ạ.",
        "Sản phẩm này đang được giảm giá 20% khi mua online ạ!",
        "Bạn muốn đặt hàng ngay không ạ? Mình sẽ gửi mã giảm giá riêng cho bạn.",
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setChatLog((prev) => [...prev, { role: "bot", text: reply }]);
    }, 800);
  };

  const currentStep = STEPS[step];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent blur-[120px] pointer-events-none" />

      {/* ── Progress Header ── */}
      <div className="relative z-10 pt-8 pb-4 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded p-1">
                <Zap className="h-4 w-4 text-black fill-black" />
              </div>
              <span className="text-sm font-bold">Omni<span className="text-neutral-500">AI</span></span>
            </div>
            <span className="text-xs text-neutral-600 font-medium">Bước {step + 1} / {STEPS.length}</span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex-1 flex items-center gap-1.5">
                <div className={cn(
                  "h-2 rounded-full transition-all duration-500 flex-1",
                  i <= step ? "bg-blue-600" : "bg-white/10"
                )} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((s, i) => (
              <span key={s.id} className={cn(
                "text-[10px] font-medium transition-colors",
                i <= step ? "text-blue-500" : "text-neutral-700"
              )}>
                {s.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex items-start justify-center px-6 py-8 relative z-10">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* ════ Step 0: Shop ════ */}
              {step === 0 && (
                <div className="space-y-6">
                  <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10">
                    <Store className="h-6 w-6 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Thiết lập Shop</h2>
                  <p className="text-sm text-neutral-400">Thông tin shop để AI hiểu business của bạn.</p>

                  <div className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1.5">Tên Shop *</label>
                      <input
                        type="text" value={data.shopName}
                        onChange={(e) => update({ shopName: e.target.value })}
                        placeholder="VD: Shop Thời trang ABC"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-neutral-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1.5">Mô tả Shop</label>
                      <textarea
                        value={data.shopDesc}
                        onChange={(e) => update({ shopDesc: e.target.value })}
                        placeholder="Shop chuyên bán hàng thời trang cao cấp..."
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-neutral-700 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1.5">Ngành hàng</label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat} onClick={() => update({ shopCategory: cat })}
                            className={cn(
                              "px-3 py-2 rounded-xl text-sm border transition-all text-left",
                              data.shopCategory === cat
                                ? "bg-blue-600/20 border-blue-500/50 text-blue-400 font-medium"
                                : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/20"
                            )}
                          >{cat}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ════ Step 1: Products ════ */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10">
                    <Package className="h-6 w-6 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Nhập Sản phẩm</h2>
                  <p className="text-sm text-neutral-400">Dán danh sách sản phẩm hoặc upload CSV. Mỗi dòng: tên, giá</p>

                  <div className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                    <div
                      className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-blue-500/30 transition-colors cursor-pointer"
                      onClick={() => document.getElementById("file-input")?.click()}
                    >
                      <Upload className="h-8 w-8 text-neutral-600 mx-auto mb-3" />
                      <p className="text-sm text-neutral-500">Kéo thả file CSV hoặc click để upload</p>
                      <p className="text-xs text-neutral-700 mt-1">Hoặc nhập text bên dưới</p>
                      <input id="file-input" type="file" accept=".csv,.txt" className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => parseProducts(reader.result as string);
                            reader.readAsText(file);
                          }
                        }}
                      />
                    </div>

                    <textarea
                      value={productInput}
                      onChange={(e) => { setProductInput(e.target.value); parseProducts(e.target.value); }}
                      placeholder="Áo thun nam, 150000&#10;Quần jean nữ, 350000&#10;Váy hoa, 280000"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-neutral-700 resize-none"
                    />

                    {data.products.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-green-500 font-medium">✅ {data.products.length} sản phẩm đã nhập</p>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {data.products.slice(0, 10).map((p, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-white/5 rounded-lg text-xs">
                              <span className="text-neutral-300">{p.name}</span>
                              <span className="text-neutral-500">{parseInt(p.price).toLocaleString()}đ</span>
                            </div>
                          ))}
                          {data.products.length > 10 && (
                            <p className="text-xs text-neutral-600 text-center">...và {data.products.length - 10} sản phẩm khác</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ════ Step 2: Bot Persona ════ */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10">
                    <Bot className="h-6 w-6 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Tính cách AI</h2>
                  <p className="text-sm text-neutral-400">Chọn phong cách bot trả lời khách hàng.</p>

                  <div className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1.5">Tên Bot (tùy chọn)</label>
                      <input
                        type="text" value={data.botName}
                        onChange={(e) => update({ botName: e.target.value })}
                        placeholder="VD: Bảo An"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-neutral-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-2">Giọng điệu</label>
                      <div className="grid gap-3">
                        {tones.map((t) => (
                          <button
                            key={t.id} onClick={() => update({ botTone: t.id })}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                              data.botTone === t.id
                                ? `${t.border} bg-white/5`
                                : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                            )}
                          >
                            <div className={cn("p-2 rounded-lg border", data.botTone === t.id ? t.border : "border-white/10")}>
                              <t.icon className={cn("h-5 w-5", t.color)} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold">{t.label}</p>
                              <p className="text-xs text-neutral-500">{t.desc}</p>
                            </div>
                            {data.botTone === t.id && (
                              <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ════ Step 3: Facebook Connect ════ */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10">
                    <Facebook className="h-6 w-6 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Kết nối Facebook</h2>
                  <p className="text-sm text-neutral-400">Bot sẽ trả lời tin nhắn từ Facebook Page của bạn.</p>

                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 text-center space-y-4">
                    {data.facebookConnected ? (
                      <div className="space-y-3">
                        <div className="inline-flex p-3 rounded-full bg-green-500/10 border border-green-500/20">
                          <Check className="h-8 w-8 text-green-500" />
                        </div>
                        <p className="text-green-500 font-bold">Đã kết nối Facebook thành công!</p>
                      </div>
                    ) : (
                      <>
                        <div className="inline-flex p-4 rounded-full bg-blue-500/10 border border-blue-500/20">
                          <Facebook className="h-8 w-8 text-blue-500" />
                        </div>
                        <p className="text-sm text-neutral-400">Nhấn nút bên dưới để kết nối Facebook Page</p>
                        <button
                          onClick={() => update({ facebookConnected: true })}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all active:scale-95"
                        >
                          <Facebook className="h-5 w-5" />
                          Kết nối Facebook
                        </button>
                        <p className="text-[10px] text-neutral-700">
                          (Demo — kết nối thật sẽ được tích hợp sau)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ════ Step 4: Test Playground ════ */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Dùng thử Bot</h2>
                  <p className="text-sm text-neutral-400">Chat thử với AI trước khi đi live.</p>

                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="h-64 overflow-y-auto p-4 space-y-3">
                      {chatLog.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-neutral-600">
                          <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                          <p className="text-xs">Nhập tin nhắn để chat với bot</p>
                        </div>
                      )}
                      {chatLog.map((msg, i) => (
                        <div key={i} className={cn(
                          "flex", msg.role === "user" ? "justify-end" : "justify-start"
                        )}>
                          <div className={cn(
                            "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm",
                            msg.role === "user"
                              ? "bg-blue-600 text-white rounded-br-md"
                              : "bg-white/10 text-neutral-200 rounded-bl-md"
                          )}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 p-3 flex gap-2">
                      <input
                        type="text" value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendTestMessage()}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-neutral-700"
                      />
                      <button onClick={sendTestMessage}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all active:scale-95"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick test buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {["Xin chào", "Có sản phẩm mới không?", "Giao hàng thế nào?"].map((q) => (
                      <button key={q} onClick={() => { setTestMessage(q); setTimeout(() => { setTestMessage(""); sendTestMessage(); }, 100); }}
                        className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-neutral-400"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ════ Step 5: Deploy ════ */}
              {step === 5 && (
                <div className="space-y-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
                    <Rocket className="h-10 w-10 text-blue-500" />
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    Bot đã sẵn sàng! 🚀
                  </h2>
                  <p className="text-neutral-400">AI của bạn sẽ bắt đầu trực chiến ngay bây giờ.</p>

                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4 text-left">
                    {[
                      { icon: Store, label: "Shop", value: data.shopName || "Mặc định" },
                      { icon: Package, label: "Sản phẩm", value: `${data.products.length} sản phẩm` },
                      { icon: Bot, label: "Tính cách", value: tones.find((t) => t.id === data.botTone)?.label || "Mặc định" },
                      { icon: Facebook, label: "Facebook", value: data.facebookConnected ? "Đã kết nối" : "Bỏ qua" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white/5">
                          <item.icon className="h-4 w-4 text-neutral-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-neutral-500 font-medium">{item.label}</p>
                          <p className="text-sm font-bold">{item.value}</p>
                        </div>
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="relative z-10 border-t border-white/5 py-4 px-6">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div>
            {step > 0 && (
              <button onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors font-medium"
              >
                <ChevronLeft className="h-4 w-4" /> Quay lại
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSkip}
              className="flex items-center gap-1.5 px-4 py-2 text-xs text-neutral-600 hover:text-neutral-400 transition-colors font-medium"
            >
              <SkipForward className="h-3.5 w-3.5" /> Bỏ qua
            </button>
            <button onClick={handleNext} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              {saving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...</>
              ) : step === 5 ? "Vào Dashboard" : "Tiếp tục"}
              {step < 5 && !saving && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

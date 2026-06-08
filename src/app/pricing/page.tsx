"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Check, Mail, Store, Zap, BarChart3, MessageSquareCode, Smartphone, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "vĩnh viễn",
    badge: "Beta",
    desc: "Dành cho chủ shop SME muốn trải nghiệm AI CSKH",
    features: [
      "2 shop quản lý",
      "Tất cả kênh: Facebook, Zalo, TikTok, Shopee, IG",
      "AI tự động trả lời 500 lượt/tháng",
      "Bot persona cơ bản",
      "Import sản phẩm từ CSV/text",
      "Dashboard analytics 7 ngày",
      "Hỗ trợ cộng đồng",
    ],
    cta: "Đang dùng thử",
    ctaLink: "/register",
    highlight: false,
    disabled: false,
    color: "border-zinc-700",
    bg: "bg-zinc-900/50",
  },
  {
    name: "Starter",
    price: "199k",
    period: "/tháng",
    badge: "Phổ biến",
    desc: "Cho shop nhỏ đang phát triển, cần AI ổn định",
    features: [
      "3 shop quản lý",
      "Tất cả kênh + ưu tiên",
      "AI tự động trả lời 3.000 lượt/tháng",
      "Custom persona + kịch bản",
      "Auto-learn catalog thông minh",
      "Dashboard analytics 90 ngày",
      "Hỗ trợ email 24h",
      "Thêm shop: +99k/tháng",
    ],
    cta: "Liên hệ",
    ctaLink: "mailto:giabao991199@gmail.com",
    highlight: true,
    disabled: true,
    color: "border-blue-500",
    bg: "bg-blue-600/5",
  },
  {
    name: "Pro",
    price: "499k",
    period: "/tháng",
    badge: "Sắp ra mắt",
    desc: "Cho doanh nghiệp cần AI mạnh mẽ, không giới hạn",
    features: [
      "10 shop quản lý",
      "Tất cả kênh + API tích hợp",
      "AI không giới hạn lượt trả lời",
      "Advanced AI persona + dual-model",
      "Smart catalog + chính sách",
      "Dashboard analytics không giới hạn",
      "Hỗ trợ priority chat 4h",
      "Thêm shop: +149k/tháng",
    ],
    cta: "Liên hệ",
    ctaLink: "mailto:giabao991199@gmail.com",
    highlight: false,
    disabled: true,
    color: "border-purple-500",
    bg: "bg-purple-600/5",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto rounded-2xl border border-white/5 bg-black/70 backdrop-blur-2xl shadow-2xl">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">Omni<span className="text-zinc-500">AI</span></span>
          </Link>
          <Link href="/login" className="text-xs text-zinc-400 hover:text-white transition-colors">Đăng nhập</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-5 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] rounded-full bg-gradient-to-b from-blue-600/10 to-transparent blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 bg-blue-600/10 border border-blue-500/20 text-blue-300">
            <Bot className="h-3 w-3" /> Beta — Hoàn toàn miễn phí trong giai đoạn MVP
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            Bảng giá đơn giản, minh bạch
          </h1>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Dùng thử miễn phí 2 shop. Khi cần mở rộng — chỉ với 199k/tháng.
            {""}
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-5 pb-24">
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className={cn(
                "relative rounded-2xl border p-6 flex flex-col transition-all duration-300",
                plan.highlight ? "border-blue-500 shadow-lg shadow-blue-600/10 scale-[1.02]" : "border-white/5",
                plan.bg,
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-lg">
                  {plan.badge}
                </div>
              )}

              {!plan.highlight && plan.badge && (
                <div className="inline-flex self-start px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-zinc-400 mb-2">
                  {plan.badge}
                </div>
              )}

              <h3 className="text-lg font-extrabold text-white mt-2">{plan.name}</h3>
              <div className="mt-3 mb-2">
                <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                <span className="text-sm text-zinc-500 ml-1">{plan.period}</span>
              </div>
              <p className="text-xs text-zinc-500 mb-6">{plan.desc}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.disabled ? (
                <a
                  href={plan.ctaLink}
                  className="block w-full text-center py-3 rounded-xl text-sm font-bold border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
                >
                  {plan.cta} →
                </a>
              ) : (
                <Link
                  href={plan.ctaLink}
                  className="block w-full text-center py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all active:scale-[0.98]"
                >
                  {plan.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-8 rounded-2xl border border-white/5 bg-white/[0.02] text-center"
        >
          <h3 className="text-lg font-extrabold text-white mb-2">Cần nhiều hơn?</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Nếu bạn cần nhiều shop hơn hoặc tính năng đặc thù cho doanh nghiệp — hãy liên hệ chúng tôi.
          </p>
          <a
            href="mailto:giabao991199@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Liên hệ qua email
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-5">
        <div className="max-w-5xl mx-auto text-center text-xs text-zinc-600">
          © 2026 OmniAI. Tất cả quyền được bảo lưu.
        </div>
      </footer>
    </div>
  );
}

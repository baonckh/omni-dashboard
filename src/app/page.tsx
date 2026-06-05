"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Zap,
  ShoppingBag,
  MessageSquareCode,
  Package,
  BarChart3,
  ArrowRight,
  LogIn,
  Sparkles,
  Facebook,
  ShieldCheck,
  Rocket,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Package,
    title: "Import Sản phẩm",
    desc: "Tải lên CSV hoặc nhập text — AI tự động học catalog của bạn trong 5 giây.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Bot,
    title: "AI Bot tự động",
    desc: "Hiểu sản phẩm, chính sách, tồn kho — trả lời khách hàng như một nhân viên thực thụ.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: MessageSquareCode,
    title: "Kết nối đa sàn",
    desc: "Facebook Messenger, TikTok Shop, Shopee, Zalo OA — một dashboard quản trị tất cả.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  {
    icon: BarChart3,
    title: "Phân tích real-time",
    desc: "Theo dõi lead, doanh thu, hiệu suất bot và insight khách hàng tức thì.",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

const stats = [
  { value: "24/7", label: "Tự động trả lời" },
  { value: "< 1s", label: "Thời gian phản hồi" },
  { value: "5+", label: "Nền tảng kết nối" },
  { value: "Zero", label: "Phí setup ban đầu" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#050505]/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-lg p-1.5">
              <Zap className="h-5 w-5 text-black fill-black" />
            </div>
            <span className="font-bold text-lg">
              Omni<span className="text-neutral-500">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors font-medium"
            >
              <LogIn className="h-4 w-4" />
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/25"
            >
              Bắt đầu miễn phí
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[700px] bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-60 -right-40 w-80 h-80 bg-purple-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-400 mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            MVP Beta — Hoàn toàn miễn phí
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
              AI Omnichannel
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              không cần code
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Kết nối Facebook, TikTok, Shopee, Zalo — AI tự động trả lời khách hàng 24/7
            dựa trên catalog và chính sách shop của bạn.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-base flex items-center gap-2 transition-all active:scale-[0.97] shadow-2xl shadow-blue-600/30"
            >
              Bắt đầu miễn phí
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border border-white/10 hover:bg-white/5 rounded-2xl font-bold text-base flex items-center gap-2 transition-all"
            >
              <LogIn className="h-5 w-5" />
              Đăng nhập
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5"
            >
              <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-1">
                {s.value}
              </div>
              <div className="text-xs text-neutral-500 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Mọi thứ bạn cần để{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              vận hành omnichannel
            </span>
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto">
            Từ import sản phẩm đến AI trả lời khách hàng — tất cả trong một nền tảng.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-6 rounded-2xl border backdrop-blur-sm transition-all hover:scale-[1.02] duration-300",
                f.border,
                f.bg,
              )}
            >
              <div className={cn("inline-flex p-3 rounded-xl border mb-4", f.border, f.bg)}>
                <f.icon className={cn("h-6 w-6", f.color)} />
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Facebook Integration Highlight ── */}
      <section className="max-w-5xl mx-auto px-6 mb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative p-10 md:p-16 rounded-3xl bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 border border-blue-500/10 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium mb-4">
                <Facebook className="h-3.5 w-3.5" />
                Facebook Messenger
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
                Kết nối Facebook Messenger{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  trong 1 click
                </span>
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                AI tự động trả lời tin nhắn Facebook, tư vấn sản phẩm, chốt đơn —
                hoạt động 24/7 không cần nhân viên túc trực.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-all active:scale-95"
              >
                Dùng thử ngay
                <Rocket className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Facebook className="h-16 w-16 text-blue-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CTA Final ── */}
      <section className="max-w-3xl mx-auto px-6 mb-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <div className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 mb-6">
            <Bot className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Sẵn sàng để AI{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              làm việc cho bạn?
            </span>
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto mb-8">
            Tạo tài khoản miễn phí — không cần thẻ tín dụng. 5 phút để bắt đầu.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-base transition-all active:scale-[0.97] shadow-2xl shadow-blue-600/30"
          >
            <Star className="h-5 w-5" />
            Tạo tài khoản miễn phí
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded p-1">
              <Zap className="h-4 w-4 text-black fill-black" />
            </div>
            <span className="text-sm font-bold">
              Omni<span className="text-neutral-500">AI</span>
            </span>
          </div>
          <p className="text-xs text-neutral-700 font-medium">
            © 2026 OmniAI. Bản quyền thuộc về Omni Customer Service.
          </p>
        </div>
      </footer>
    </div>
  );
}

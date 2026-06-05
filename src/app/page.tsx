"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot, Zap, ShoppingBag, MessageSquareCode, Package, BarChart3,
  ArrowRight, LogIn, Sparkles, Facebook, Rocket, Star,
  Mail, Phone, MapPin, ChevronRight, Users, HeartHandshake,
  TrendingUp, Clock, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";

const features = [
  {
    icon: Package, key: "import",
    color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20",
  },
  {
    icon: Bot, key: "bot",
    color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20",
  },
  {
    icon: MessageSquareCode, key: "connect",
    color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20",
  },
  {
    icon: BarChart3, key: "analytics",
    color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20",
  },
];

export default function LandingPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#050505]/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-white rounded-lg p-1.5">
              <Zap className="h-5 w-5 text-black fill-black" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Omni<span className="text-neutral-500">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">{t("footer.features")}</a>
            <Link href="/pricing" className="hover:text-white transition-colors">{t("footer.pricing")}</Link>
            <a href="#contact" className="hover:text-white transition-colors">{t("footer.contact")}</a>
          </div>

          <div className="flex items-center gap-3">
            <LangToggle />
            <Link href="/login"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors font-medium"
            >
              <LogIn className="h-4 w-4" />
              {t("hero.login")}
            </Link>
            <Link href="/register"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/25"
            >
              {t("nav.getstarted")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[700px] bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-60 -right-40 w-80 h-80 bg-purple-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-400 mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            {t("badge.mvp")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
              {t("hero.title1")}
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              {t("hero.title2")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            {t("hero.sub")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link href="/register"
              className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-base flex items-center gap-2 transition-all active:scale-[0.97] shadow-2xl shadow-blue-600/30"
            >
              {t("hero.cta")}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login"
              className="px-8 py-4 border border-white/10 hover:bg-white/5 rounded-2xl font-bold text-base flex items-center gap-2 transition-all"
            >
              <LogIn className="h-5 w-5" />
              {t("hero.login")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Pain Points / Social Proof ── */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Users, stat: "Bỏ lỡ leads", desc: "Khách hỏi không được trả lời kịp → mất đơn", color: "text-red-500" },
            { icon: Clock, stat: "Nhân viên nghỉ việc", desc: "Tuyển & đào tạo lại nhân sự CSKH tốn thời gian", color: "text-orange-500" },
            { icon: HeartHandshake, stat: "Mất cá tính shop", desc: "Bot generic không giữ được phong cách tư vấn riêng", color: "text-yellow-500" },
          ].map((item, i) => (
            <motion.div
              key={item.stat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center"
            >
              <item.icon className={cn("h-8 w-8 mx-auto mb-3", item.color)} />
              <h3 className="text-lg font-extrabold mb-1">{item.stat}</h3>
              <p className="text-sm text-neutral-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "24/7", key: "stat.247" },
            { value: "< 1s", key: "stat.response" },
            { value: "5+", key: "stat.platforms" },
            { value: "Zero", key: "stat.setup" },
          ].map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5"
            >
              <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-1">
                {s.value}
              </div>
              <div className="text-xs text-neutral-500 font-medium">{t(s.key)}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 mb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            {t("features.title")}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              {t("features.title2")}
            </span>
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto">{t("features.sub")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn("p-6 rounded-2xl border backdrop-blur-sm transition-all hover:scale-[1.02] duration-300", f.border, f.bg)}
            >
              <div className={cn("inline-flex p-3 rounded-xl border mb-4", f.border, f.bg)}>
                <f.icon className={cn("h-6 w-6", f.color)} />
              </div>
              <h3 className="text-lg font-bold mb-2">{t(`feat.${f.key}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{t(`feat.${f.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Facebook Highlight ── */}
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
                {t("fb.badge")}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
                {t("fb.title")}{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  {t("fb.title2")}
                </span>
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-6">{t("fb.desc")}</p>
              <Link href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-all active:scale-95"
              >
                {t("fb.cta")}
                <Rocket className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <MessageCircle className="h-16 w-16 text-blue-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 mb-32 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}>
          <div className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 mb-6">
            <Bot className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            {t("cta.title")}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              {t("cta.title2")}
            </span>
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto mb-8">{t("cta.sub")}</p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-base transition-all active:scale-[0.97] shadow-2xl shadow-blue-600/30"
          >
            <Star className="h-5 w-5" />
            {t("cta.btn")}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="border-t border-white/5 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white rounded p-1.5">
                  <Zap className="h-5 w-5 text-black fill-black" />
                </div>
                <span className="font-bold text-lg tracking-tight">
                  Omni<span className="text-neutral-500">AI</span>
                </span>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                Nền tảng AI Omnichannel giúp chủ shop SME tự động hóa chăm sóc khách hàng đa sàn,
                không bỏ lỡ leads, giảm nhân viên CSKH, vẫn giữ cá tính riêng.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <LangToggle />
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">{t("footer.product")}</h4>
              <ul className="space-y-3">
                {[["footer.features", "#features"], ["footer.pricing", "/pricing"], ["footer.docs", "/docs"]].map(([key, href]) => (
                  <li key={key as string}>
                    <Link href={href as string} className="text-sm text-neutral-500 hover:text-white transition-colors">
                      {t(key as string)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">{t("footer.company")}</h4>
              <ul className="space-y-3">
                {[["footer.about", "/about"], ["footer.blog", "/blog"], ["footer.contact", "#contact"]].map(([key, href]) => (
                  <li key={key as string}>
                    <Link href={href as string} className="text-sm text-neutral-500 hover:text-white transition-colors">
                      {t(key as string)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-3">
                {[["footer.privacy", "/privacy"], ["footer.terms", "/terms"]].map(([key, href]) => (
                  <li key={key as string}>
                    <Link href={href as string} className="text-sm text-neutral-500 hover:text-white transition-colors">
                      {t(key as string)}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2">
                <a href="mailto:hello@omni-ai.com" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-400 transition-colors">
                  <Mail className="h-3.5 w-3.5" /> hello@omni-ai.com
                </a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-700 font-medium">
              © 2026 OmniAI. {t("footer.tag")}
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-700">
              <Link href="/privacy" className="hover:text-neutral-500 transition-colors">{t("footer.privacy")}</Link>
              <Link href="/terms" className="hover:text-neutral-500 transition-colors">{t("footer.terms")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

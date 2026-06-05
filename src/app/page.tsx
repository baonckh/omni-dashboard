"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot, Zap, ShoppingBag, MessageSquareCode, Package, BarChart3,
  ArrowRight, LogIn, Sparkles, Facebook, Rocket, Star,
  Mail, ChevronRight, Users, HeartHandshake,
  Clock, MessageCircle, Smartphone, Search, ShoppingCart,
  Instagram, MonitorCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";

const features = [
  { icon: MessageSquareCode, key: "inbox", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { icon: Bot, key: "ai", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { icon: Smartphone, key: "channels", color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  { icon: BarChart3, key: "insight", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
];

const platforms = [
  { icon: MessageCircle, nameKey: "platform.facebook", color: "text-blue-400" },
  { icon: MessageCircle, nameKey: "platform.zalo", color: "text-sky-400" },
  { icon: ShoppingBag, nameKey: "platform.tiktok", color: "text-pink-400" },
  { icon: ShoppingCart, nameKey: "platform.shopee", color: "text-orange-400" },
  { icon: Instagram, nameKey: "platform.instagram", color: "text-purple-400" },
];

const useCases = [
  { icon: MessageCircle, key: "1", color: "bg-blue-500/10 border-blue-500/20" },
  { icon: Bot, key: "2", color: "bg-purple-500/10 border-purple-500/20" },
  { icon: ShoppingCart, key: "3", color: "bg-green-500/10 border-green-500/20" },
  { icon: MonitorCheck, key: "4", color: "bg-orange-500/10 border-orange-500/20" },
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
            <a href="#contact" className="hover:text-white transition-colors">{t("footer.contact")}</a>
          </div>

          <div className="flex items-center gap-3">
            <LangToggle />
            <Link href="/login"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors font-medium"
            >
              {t("nav.login")}
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

      {/* ══════ HERO ══════ */}
      <section className="relative pt-36 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[800px] bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-400 mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            {t("badge.mvp")}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] mb-8"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-neutral-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            {t("hero.sub")}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
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

      {/* ══════ PAIN POINTS ══════ */}
      <section className="max-w-6xl mx-auto px-6 mb-28">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          className="text-2xl md:text-3xl font-extrabold text-center mb-12"
        >
          {t("pain.title")}
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: Clock, key: "1", color: "text-red-500", bg: "bg-red-500/5", border: "border-red-500/10" },
            { icon: Users, key: "2", color: "text-orange-500", bg: "bg-orange-500/5", border: "border-orange-500/10" },
            { icon: MessageSquareCode, key: "3", color: "text-yellow-500", bg: "bg-yellow-500/5", border: "border-yellow-500/10" },
            { icon: HeartHandshake, key: "4", color: "text-pink-500", bg: "bg-pink-500/5", border: "border-pink-500/10" },
          ].map((item, i) => (
            <motion.div key={item.key} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={cn("flex items-start gap-4 p-5 rounded-2xl border", item.bg, item.border)}
            >
              <div className={cn("p-2.5 rounded-xl border shrink-0", item.bg, item.border)}>
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              <div>
                <h3 className="text-sm font-bold mb-1">{t(`pain.${item.key}.title`)}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{t(`pain.${item.key}.desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section className="max-w-5xl mx-auto px-6 mb-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "24/7", key: "stat.reply" },
            { value: "< 3s", key: "stat.response" },
            { value: "5", key: "stat.channels" },
            { value: "≥ 3", key: "stat.staff" },
          ].map((s, i) => (
            <motion.div key={s.key} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
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

      {/* ══════ FEATURES ══════ */}
      <section id="features" className="max-w-6xl mx-auto px-6 mb-28">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
            {t("features.title")}
          </h2>
          <p className="text-neutral-500 max-w-xl mx-auto text-sm">{t("features.sub")}</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.key} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={cn("p-6 rounded-2xl border backdrop-blur-sm transition-all hover:scale-[1.02] duration-300", f.border, f.bg)}
            >
              <div className={cn("inline-flex p-3 rounded-xl border mb-4", f.border, f.bg)}>
                <f.icon className={cn("h-6 w-6", f.color)} />
              </div>
              <h3 className="text-base font-bold mb-2">{t(`feat.${f.key}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{t(`feat.${f.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ PLATFORMS ══════ */}
      <section className="max-w-5xl mx-auto px-6 mb-28 text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">{t("platform.title")}</h2>
          <p className="text-neutral-500 text-sm mb-10">{t("platform.sub")}</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-4">
          {platforms.map((p, i) => (
            <motion.div key={p.nameKey} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/10"
            >
              <p.icon className={cn("h-5 w-5", p.color)} />
              <span className="text-sm font-medium">{t(p.nameKey)}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ WHY AI ══════ */}
      <section className="max-w-6xl mx-auto px-6 mb-28">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          className="text-2xl md:text-3xl font-extrabold text-center mb-4"
        >
          {t("usecase.title")}
        </motion.h2>
        <p className="text-center text-sm text-neutral-500 mb-10 max-w-lg mx-auto">Chạy 24/7, trả lời đúng chất shop, giá chỉ bằng 1 tháng lương nhân viên.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: MessageCircle, key: "1", accent: "border-l-blue-600 bg-gradient-to-r from-blue-600/5 to-transparent" },
            { icon: Search, key: "2", accent: "border-l-purple-600 bg-gradient-to-r from-purple-600/5 to-transparent" },
            { icon: HeartHandshake, key: "3", accent: "border-l-pink-600 bg-gradient-to-r from-pink-600/5 to-transparent" },
            { icon: Star, key: "4", accent: "border-l-green-600 bg-gradient-to-r from-green-600/5 to-transparent" },
          ].map((item, i) => (
            <motion.div key={item.key} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className={cn("flex items-start gap-5 p-6 rounded-2xl border border-white/5 border-l-4", item.accent)}
            >
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold mb-1.5">{t(`usecase.${item.key}.title`)}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{t(`usecase.${item.key}.desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="max-w-3xl mx-auto px-6 mb-28 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}>
          <div className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 mb-6">
            <Bot className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">{t("cta.title")}</h2>
          <p className="text-neutral-500 max-w-md mx-auto mb-8 text-sm">
            {t("badge.mvp")}{t("cta.sub")}
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-base transition-all active:scale-[0.97] shadow-2xl shadow-blue-600/30"
          >
            <Star className="h-5 w-5" />
            {t("cta.btn")}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer id="contact" className="border-t border-white/5 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="bg-white rounded p-1.5">
                  <Zap className="h-5 w-5 text-black fill-black" />
                </div>
                <span className="font-bold text-lg tracking-tight">
                  Omni<span className="text-neutral-500">AI</span>
                </span>
              </Link>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">{t("footer.desc")}</p>
              <LangToggle />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">{t("footer.product")}</h4>
              <ul className="space-y-3">
                {[["footer.features", "#features"], ["footer.pricing", "/pricing"], ["footer.docs", "/docs"]].map(([key, href]) => (
                  <li key={key}><Link href={href} className="text-sm text-neutral-500 hover:text-white transition-colors">{t(key)}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">{t("footer.company")}</h4>
              <ul className="space-y-3">
                {[["footer.about", "/about"], ["footer.blog", "/blog"], ["footer.contact", "#contact"]].map(([key, href]) => (
                  <li key={key}><Link href={href} className="text-sm text-neutral-500 hover:text-white transition-colors">{t(key)}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-3">
                {[["footer.privacy", "/privacy"], ["footer.terms", "/terms"]].map(([key, href]) => (
                  <li key={key}><Link href={href} className="text-sm text-neutral-500 hover:text-white transition-colors">{t(key)}</Link></li>
                ))}
              </ul>
              <div className="mt-6">
                <a href="mailto:hello@omni-ai.com"
                  className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-400 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" /> hello@omni-ai.com
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-700 font-medium">
              © 2026 OmniAI. {t("footer.rights")}
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

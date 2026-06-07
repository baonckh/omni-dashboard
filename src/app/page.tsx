"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot, Zap, MessageSquareCode, BarChart3,
  ArrowRight, LogIn, Sparkles, Rocket, Star,
  Mail, ChevronRight, Users, HeartHandshake,
  Clock, MessageCircle, Smartphone, ShoppingCart,
  Instagram, MonitorCheck, ArrowUpRight, BellRing,
  Search, ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";

const painPoints = [
  { icon: Clock, key: "1" },
  { icon: Users, key: "2" },
  { icon: MessageSquareCode, key: "3" },
  { icon: HeartHandshake, key: "4" },
];

const features = [
  { icon: MessageSquareCode, key: "inbox" },
  { icon: Bot, key: "ai" },
  { icon: Smartphone, key: "channels" },
  { icon: BarChart3, key: "insight" },
];

const platforms = [
  { icon: MessageCircle, nameKey: "platform.facebook" },
  { icon: MessageCircle, nameKey: "platform.zalo" },
  { icon: ShoppingBag, nameKey: "platform.tiktok" },
  { icon: ShoppingCart, nameKey: "platform.shopee" },
  { icon: Instagram, nameKey: "platform.instagram" },
];

const useCases = [
  { icon: BellRing, key: "1" },
  { icon: Search, key: "2" },
  { icon: HeartHandshake, key: "3" },
  { icon: Star, key: "4" },
];

export default function LandingPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(10,10,10,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: "#2563EB" }}>
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Omni<span style={{ color: "#A1A1AA" }}>AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "#A1A1AA" }}>
            <a href="#features" className="hover:text-white transition-colors duration-200">{t("footer.features")}</a>
            <a href="#contact" className="hover:text-white transition-colors duration-200">{t("footer.contact")}</a>
          </div>

          <div className="flex items-center gap-3">
            <LangToggle />
            <Link href="/login"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors duration-200"
              style={{ color: "#A1A1AA" }}
              onMouseOver={e => (e.currentTarget.style.color = "#FFFFFF")}
              onMouseOut={e => (e.currentTarget.style.color = "#A1A1AA")}
            >
              {t("hero.login")}
            </Link>
            <Link href="/register"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.97]"
              style={{ backgroundColor: "#2563EB", color: "#FFFFFF", boxShadow: "0 4px 24px rgba(37,99,235,0.3)" }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = "#3B82F6"}
              onMouseOut={e => e.currentTarget.style.backgroundColor = "#2563EB"}
            >
              {t("nav.getstarted")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full" style={{ background: "radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, transparent 70%)" }} />
          <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-10"
            style={{ backgroundColor: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", color: "#93C5FD" }}
          >
            <Sparkles className="h-3 w-3" />
            {t("badge.mvp")}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[clamp(1.75rem,5vw,3.5rem)] font-extrabold tracking-tight leading-[1.15] mb-6"
          >
            <span className="text-white">{t("hero.title")}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-10" style={{ color: "#A1A1AA" }}
          >
            {t("hero.sub")}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link href="/register"
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold transition-all duration-200 active:scale-[0.97]"
              style={{ backgroundColor: "#2563EB", color: "#FFFFFF", boxShadow: "0 8px 32px rgba(37,99,235,0.35)" }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = "#3B82F6"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(37,99,235,0.45)"; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = "#2563EB"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.35)"; }}
            >
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold transition-all duration-200 hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#A1A1AA" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#A1A1AA"; }}
            >
              <LogIn className="h-4 w-4" />
              {t("hero.login")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════ PAIN POINTS ══════ */}
      <section className="max-w-5xl mx-auto px-6 mb-28">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          className="text-xl md:text-2xl font-extrabold text-center mb-10 text-white"
        >
          {t("pain.title")}
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-3">
          {painPoints.map((item, i) => (
            <motion.div key={item.key} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="group flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 cursor-default"
              style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <item.icon className="h-5 w-5" style={{ color: "#EF4444" }} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5">{t(`pain.${item.key}.title`)}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#A1A1AA" }}>{t(`pain.${item.key}.desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section className="max-w-4xl mx-auto px-6 mb-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { value: "24/7", key: "stat.reply" },
            { value: "< 3s", key: "stat.response" },
            { value: "5", key: "stat.channels" },
            { value: "≥ 3", key: "stat.staff" },
          ].map((s, i) => (
            <motion.div key={s.key} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
              className="text-center p-6" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              <div className="text-2xl md:text-3xl font-extrabold mb-0.5 text-white">{s.value}</div>
              <div className="text-xs font-medium" style={{ color: "#A1A1AA" }}>{t(s.key)}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section id="features" className="max-w-5xl mx-auto px-6 mb-28">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
          <h2 className="text-xl md:text-2xl font-extrabold text-white mb-3">{t("features.title")}</h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#A1A1AA" }}>{t("features.sub")}</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div key={f.key} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="group p-6 rounded-2xl transition-all duration-200 cursor-default"
              style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(37,99,235,0.2)"; e.currentTarget.style.transform = "translateY(-2px)" }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)" }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-4" style={{ backgroundColor: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.15)" }}>
                <f.icon className="h-5 w-5" style={{ color: "#60A5FA" }} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{t(`feat.${f.key}.title`)}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{t(`feat.${f.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ PLATFORMS ══════ */}
      <section className="max-w-4xl mx-auto px-6 mb-28 text-center">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          className="text-xl md:text-2xl font-extrabold text-white mb-3"
        >
          {t("platform.title")}
        </motion.h2>
        <p className="text-sm mb-8" style={{ color: "#A1A1AA" }}>{t("platform.sub")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {platforms.map((p, i) => (
            <motion.div key={p.nameKey} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-default"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <p.icon className="h-4 w-4" style={{ color: "#A1A1AA" }} />
              <span className="text-sm font-medium text-white">{t(p.nameKey)}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ WHY AI ══════ */}
      <section className="max-w-5xl mx-auto px-6 mb-28">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          className="text-xl md:text-2xl font-extrabold text-center text-white mb-2"
        >
          {t("usecase.title")}
        </motion.h2>
        <p className="text-center text-sm mb-10" style={{ color: "#A1A1AA" }}>{t("usecase.sub")}</p>
        <div className="grid md:grid-cols-2 gap-3">
          {useCases.map((item, i) => (
            <motion.div key={item.key} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-start gap-4 p-6 rounded-2xl transition-all duration-200 cursor-default"
              style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: "3px solid #2563EB" }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = "rgba(37,99,235,0.04)"; e.currentTarget.style.borderColor = "rgba(37,99,235,0.15)"; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0" style={{ backgroundColor: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.15)" }}>
                <item.icon className="h-5 w-5" style={{ color: "#60A5FA" }} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{t(`usecase.${item.key}.title`)}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{t(`usecase.${item.key}.desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="max-w-2xl mx-auto px-6 mb-28 text-center">
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
          className="p-10 md:p-14 rounded-3xl" style={{ backgroundColor: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.12)" }}
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-5" style={{ backgroundColor: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.15)" }}>
            <Bot className="h-7 w-7" style={{ color: "#60A5FA" }} />
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white mb-3">{t("cta.title")}</h2>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: "#A1A1AA" }}>
            Dùng thử miễn phí — không cần thẻ tín dụng. 5 phút bắt đầu.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold transition-all duration-200 active:scale-[0.97]"
            style={{ backgroundColor: "#2563EB", color: "#FFFFFF", boxShadow: "0 8px 32px rgba(37,99,235,0.35)" }}
            onMouseOver={e => { e.currentTarget.style.backgroundColor = "#3B82F6"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(37,99,235,0.45)"; }}
            onMouseOut={e => { e.currentTarget.style.backgroundColor = "#2563EB"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.35)"; }}
          >
            <Star className="h-4 w-4" />
            {t("cta.btn")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer id="contact" className="border-t pt-16 pb-8 px-6" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: "#2563EB" }}>
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight text-white">
                  Omni<span style={{ color: "#A1A1AA" }}>AI</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#A1A1AA" }}>{t("footer.desc")}</p>
              <LangToggle />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#A1A1AA" }}>{t("footer.product")}</h4>
              <ul className="space-y-2.5">
                {[["footer.features", "#features"], ["footer.docs", "/docs"]].map(([key, href]) => (
                  <li key={key}><Link href={href} className="text-sm transition-colors duration-200" style={{ color: "#52525B" }} onMouseOver={e => e.currentTarget.style.color = "#FFFFFF"} onMouseOut={e => e.currentTarget.style.color = "#52525B"}>{t(key)}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#A1A1AA" }}>{t("footer.company")}</h4>
              <ul className="space-y-2.5">
                {[["footer.about", "/about"], ["footer.contact", "#contact"]].map(([key, href]) => (
                  <li key={key}><Link href={href} className="text-sm transition-colors duration-200" style={{ color: "#52525B" }} onMouseOver={e => e.currentTarget.style.color = "#FFFFFF"} onMouseOut={e => e.currentTarget.style.color = "#52525B"}>{t(key)}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#A1A1AA" }}>{t("footer.legal")}</h4>
              <ul className="space-y-2.5">
                {[["footer.privacy", "/privacy"], ["footer.terms", "/terms"]].map(([key, href]) => (
                  <li key={key}><Link href={href} className="text-sm transition-colors duration-200" style={{ color: "#52525B" }} onMouseOver={e => e.currentTarget.style.color = "#FFFFFF"} onMouseOut={e => e.currentTarget.style.color = "#52525B"}>{t(key)}</Link></li>
                ))}
              </ul>
              <div className="mt-6">
                <a href="mailto:hello@omni-ai.com" className="flex items-center gap-2 text-sm transition-colors duration-200" style={{ color: "#52525B" }} onMouseOver={e => e.currentTarget.style.color = "#FFFFFF"} onMouseOut={e => e.currentTarget.style.color = "#52525B"}>
                  <Mail className="h-3.5 w-3.5" /> hello@omni-ai.com
                </a>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-xs" style={{ color: "#52525B" }}>© 2026 OmniAI. {t("footer.rights")}</p>
            <div className="flex items-center gap-4 text-xs" style={{ color: "#52525B" }}>
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">{t("footer.privacy")}</Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">{t("footer.terms")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


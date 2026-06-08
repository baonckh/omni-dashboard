"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot, Zap, MessageSquareCode, BarChart3,
  ArrowRight, LogIn, Sparkles, Rocket, Star,
  Mail, Users, HeartHandshake,
  Clock, MessageCircle, Smartphone, ShoppingCart,
  Instagram, BellRing, Search, ShoppingBag, Quote,
  CheckCircle2, ChevronRight, Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";
import ChatDemo from "@/components/ChatDemo";
import BotPipeline from "@/components/BotPipeline";
import { GradientText, TextReveal, AuroraText, WordRotate, TextHighlighter, UnderlineText, EmText } from "@/components/TextAnimations";

// ── Count-up hook ──
function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

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
const stats = [
  { value: 247, suffix: "", key: "stat.reply", display: "24/7" },
  { value: 3, suffix: "s", key: "stat.response", display: "< 3s" },
  { value: 5, suffix: "", key: "stat.channels", display: "5" },
  { value: 3, suffix: "", key: "stat.staff", display: "≥ 3" },
];

export default function LandingPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ══════ FLOATING NAVBAR ══════ */}
      <nav className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto rounded-2xl border border-white/[0.06] bg-black/70 backdrop-blur-2xl shadow-2xl shadow-black/50">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              Omni<span className="text-zinc-500">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LangToggle />
            <Link href="/login"
              className="hidden md:inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >{t("hero.login")}</Link>
            <Link href="/register"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/25"
            >{t("nav.getstarted")}</Link>
          </div>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <section className="relative pt-28 pb-16 px-5">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] rounded-full bg-gradient-to-b from-blue-600/15 via-blue-500/5 to-transparent blur-[100px]" />
          <div className="absolute top-20 left-[15%] w-72 h-72 rounded-full bg-blue-500/5 blur-[80px]" />
          <div className="absolute top-40 right-[15%] w-80 h-80 rounded-full bg-purple-500/5 blur-[80px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 bg-blue-600/10 border border-blue-500/20 text-blue-300"
          >
            <Sparkles className="h-3 w-3" />
            {t("badge.mvp")}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-extrabold tracking-tight leading-[1.15] mb-5"
          >
            <AuroraText>
              <TextReveal text={t("hero.title")} />
            </AuroraText>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-8 text-zinc-400"
          >
            <TextReveal text={t("hero.sub")} />
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <Link href="/register"
              className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold overflow-hidden transition-all active:scale-[0.97]"
              style={{ boxShadow: "0 0 30px rgba(37,99,235,0.3)" }}
            >
              <motion.span
                className="absolute inset-0 rounded-xl"
                style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED, #2563EB)", backgroundSize: "200% 200%" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />
              <span className="relative z-10 flex items-center gap-2 text-white">
                {t("hero.cta")}<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
            <Link href="/login"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
            ><LogIn className="h-4 w-4" />{t("hero.login")}</Link>
          </motion.div>
        </div>
      </section>

      {/* ══════ TRUSTED BY / LOGOS ══════ */}
      <section className="max-w-4xl mx-auto px-5 mb-20">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-xs font-medium text-zinc-600 mb-5 uppercase tracking-widest animate-shimmer"
        >{t("trusted.title")}</motion.p>
        <div className="flex flex-wrap justify-center gap-6 opacity-40">
          {["Shop Thời trang ABC", "Mỹ phẩm MJ", "TechStore VN", "Foody Saigon", "Fashion Hub"].map((name) => (
            <span key={name} className="text-sm font-bold text-zinc-600">{name}</span>
          ))}
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section className="max-w-4xl mx-auto px-5 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[0.06]">
          {stats.map((s, i) => (
            <motion.div key={s.key} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="text-center py-7 px-4" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 100 }}
                className="text-2xl md:text-3xl font-extrabold text-white mb-0.5"
              >{s.display}</motion.div>
              <div className="text-xs font-medium text-zinc-500">{t(s.key)}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ CHAT DEMO ══════ */}
      <section className="max-w-5xl mx-auto px-5 mb-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-xl md:text-2xl font-extrabold text-white mb-3">Xem AI trả lời khách hàng như thế nào</h2>
          <p className="text-sm text-zinc-500 max-w-lg mx-auto">Bot hiểu sản phẩm, chính sách, tồn kho — trả lời tự nhiên như nhân viên thật.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full md:w-1/2">
            <ChatDemo />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full md:w-1/2 space-y-3">
            {[
              { title: "Hiểu sản phẩm & tồn kho", desc: "AI biết chính xác giá, màu sắc, size có sẵn — không trả lời chung chung." },
              { title: "Tư vấn & chốt đơn", desc: "Tự động gửi link sản phẩm, mã giảm giá, hỗ trợ đặt hàng — không cần nhân viên." },
              { title: "Giữ đúng chất riêng", desc: "AI nói chuyện theo phong cách, giọng văn, cách xưng hô của shop bạn." },
              { title: "Phản hồi trong 1-3 giây", desc: "Khách không phải chờ đợi. Không bỏ lỡ cơ hội bán hàng." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl transition-all" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: "rgba(37,99,235,0.1)" }}>
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">{item.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ BOT INTELLIGENCE PIPELINE ══════ */}
      <section className="max-w-5xl mx-auto px-5 mb-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-xl md:text-2xl font-extrabold text-white mb-3 leading-relaxed">
            AI hiểu <TextHighlighter color="rgba(59,130,246,0.2)">sản phẩm</TextHighlighter>, <TextHighlighter color="rgba(168,85,247,0.2)">tồn kho</TextHighlighter>, <TextHighlighter color="rgba(236,72,153,0.2)">chính sách</TextHighlighter> —<br className="hidden md:block" />không chỉ là <UnderlineText>chat template</UnderlineText>
          </h2>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto">
            OmniAI <EmText>học catalog</EmText> thật của bạn, truy xuất <WordRotate words={["đúng size", "đúng màu", "đúng variant", "đúng giá"]} />, giữ nguyên <TextHighlighter>context</TextHighlighter> xuyên suốt.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <BotPipeline />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-4"
        >
          <div className="p-5 rounded-2xl border border-red-500/10 bg-red-500/5">
            <p className="text-xs font-bold text-red-400 mb-3 uppercase tracking-wider">Bot thông thường</p>
            <ul className="space-y-2">
              {["Trả lời theo kịch bản cố định", "Không hiểu sản phẩm thật", "Mất context sau 2-3 tin nhắn", "Trả lời chung chung", "Training thủ công từng kịch bản"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-zinc-400"><span className="text-red-500 mt-0.5">✕</span> {item}</li>
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-2xl border border-green-500/10 bg-green-500/5">
            <p className="text-xs font-bold text-green-400 mb-3 uppercase tracking-wider">OmniAI</p>
            <ul className="space-y-2">
              {["Hiểu catalog thật: giá, size, màu, tồn kho", "Truy xuất đúng variant", "Giữ context xuyên suốt", "Trả lời cá nhân hóa", "Tự động học, không cần training"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-zinc-300"><span className="text-green-500 mt-0.5 font-bold">✓</span> {item}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section id="features" className="max-w-5xl mx-auto px-5 mb-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-xl md:text-2xl font-extrabold text-white mb-3">
            <TextReveal text={t("features.title")} />
          </h2>
          <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-600 mb-6">
            <UnderlineText><span className="text-xs">Inbox</span></UnderlineText>
            <span className="text-zinc-700">·</span>
            <UnderlineText><span className="text-xs">AI</span></UnderlineText>
            <span className="text-zinc-700">·</span>
            <UnderlineText><span className="text-xs">Đa kênh</span></UnderlineText>
            <span className="text-zinc-700">·</span>
            <UnderlineText><span className="text-xs">Analytics</span></UnderlineText>
          </div>
          <p className="text-sm max-w-xl mx-auto text-zinc-500"><TextReveal text={t("features.sub")} /></p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div key={f.key} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="group p-6 rounded-2xl cursor-default transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/5"
              style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-4" style={{ backgroundColor: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.15)" }}>
                <f.icon className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{t(`feat.${f.key}.title`)}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{t(`feat.${f.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ PLATFORMS ══════ */}
      <section className="max-w-4xl mx-auto px-5 mb-24 text-center">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-xl md:text-2xl font-extrabold text-white mb-3">{t("platform.title")}</motion.h2>
        <p className="text-sm mb-8 text-zinc-500">{t("platform.sub")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {platforms.map((p, i) => (
            <motion.div key={p.nameKey} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p.icon className="h-4 w-4 text-zinc-400" />
              <span className="text-sm font-medium text-white">{t(p.nameKey)}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ PAIN POINTS ══════ */}
      <section className="max-w-5xl mx-auto px-5 mb-24">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-xl md:text-2xl font-extrabold text-center mb-10 text-white"
        ><TextReveal text={t("pain.title")} /> <EmText>?</EmText></motion.h2>
        <div className="grid md:grid-cols-2 gap-3">
          {painPoints.map((item, i) => (
            <motion.div key={item.key} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="group flex items-start gap-4 p-5 rounded-2xl cursor-default transition-all duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <item.icon className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5">{t(`pain.${item.key}.title`)}</h3>
                <p className="text-xs leading-relaxed text-zinc-500">{t(`pain.${item.key}.desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ TESTIMONIAL ══════ */}
      <section className="max-w-3xl mx-auto px-5 mb-24 text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Quote className="h-8 w-8 text-blue-500/30 mx-auto mb-4" />
          <blockquote className="text-lg md:text-xl font-medium leading-relaxed text-zinc-300 mb-6">
            {t("testimonial.text")}
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">MT</div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">{t("testimonial.name")}</p>
              <p className="text-xs text-zinc-500">{t("testimonial.role")}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="max-w-2xl mx-auto px-5 mb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-10 md:p-14 rounded-3xl" style={{ backgroundColor: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.12)" }}
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-5" style={{ backgroundColor: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.15)" }}>
            <Bot className="h-7 w-7 text-blue-400" />
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white mb-3">
            <AuroraText>{t("cta.title")}</AuroraText>
          </h2>
          <p className="text-sm mb-8 max-w-sm mx-auto text-zinc-500">{t("badge.mvp")} {t("cta.sub")}</p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-[0.97]"
          ><Star className="h-4 w-4" />{t("cta.btn")}<ArrowRight className="h-4 w-4" /></Link>
        </motion.div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer id="contact" className="border-t border-white/[0.06] pt-14 pb-8 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600"><Zap className="h-3.5 w-3.5 text-white" /></div>
                <span className="font-bold text-base tracking-tight text-white">Omni<span className="text-zinc-500">AI</span></span>
              </Link>
              <p className="text-sm leading-relaxed mb-4 text-zinc-500">{t("footer.desc")}</p>
              <LangToggle />
            </div>
            {[
              { title: "footer.product", links: [["footer.features", "#features"], ["footer.docs", "/docs"]] },
              { title: "footer.company", links: [["footer.about", "/about"], ["footer.contact", "#contact"]] },
              { title: "footer.legal", links: [["footer.privacy", "/privacy"], ["footer.terms", "/terms"]], extra: true },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">{t(col.title)}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(([key, href]) => (
                    <li key={key}><Link href={href} className="text-sm text-zinc-600 hover:text-white transition-colors">{t(key)}</Link></li>
                  ))}
                </ul>
                {col.extra && (
                  <a href="mailto:hello@omni-ai.com" className="flex items-center gap-2 text-sm text-zinc-600 hover:text-white transition-colors mt-6">
                    <Mail className="h-3.5 w-3.5" /> hello@omni-ai.com</a>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600">© 2026 OmniAI. {t("footer.rights")}</p>
            <div className="flex items-center gap-4 text-xs text-zinc-600">
              <Link href="/privacy" className="hover:text-white transition-colors">{t("footer.privacy")}</Link>
              <Link href="/terms" className="hover:text-white transition-colors">{t("footer.terms")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

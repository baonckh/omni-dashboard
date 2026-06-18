"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Target, Heart, Lightbulb, Rocket, Mail, Quote } from "lucide-react";
import { useLang } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";

const values = [
  {
    icon: Heart,
    vi: { title: "Tận tâm", desc: "Chúng tôi đặt khách hàng lên hàng đầu. Mọi tính năng đều được xây dựng để giải quyết vấn đề thực tế của chủ shop SME." },
    en: { title: "Devotion", desc: "We put customers first. Every feature is built to solve real problems for SME shop owners." },
  },
  {
    icon: Lightbulb,
    vi: { title: "Đổi mới", desc: "AI không ngừng học hỏi và cải thiện. Chúng tôi luôn tìm cách tốt hơn để tự động hóa CSKH." },
    en: { title: "Innovation", desc: "AI that continuously learns and improves. We constantly seek better ways to automate customer care." },
  },
  {
    icon: Target,
    vi: { title: "Tập trung", desc: "Chúng tôi tập trung vào thị trường SME Việt Nam — hiểu sâu văn hóa, thói quen và nhu cầu của chủ shop." },
    en: { title: "Focus", desc: "We focus on the Vietnamese SME market — deeply understanding the culture, habits, and needs of shop owners." },
  },
  {
    icon: Rocket,
    vi: { title: "Tốc độ", desc: "Phản hồi trong 3 giây. Cập nhật tính năng mỗi tuần. Không chậm trễ, không quan liêu." },
    en: { title: "Speed", desc: "Reply in 3 seconds. New features every week. No delays, no bureaucracy." },
  },
];

const teamPlaceholders = [
  { initials: "B", name: "Bao", role: "Founder & Developer" },
  { initials: "?", name: "You?", role: "Join our team" },
  { initials: "?", name: "You?", role: "Join our team" },
];

const milestones = [
  {
    vi: { date: "2025 Q3", title: "Ý tưởng", desc: "Founder nhận thấy vấn đề của chủ shop SME với CSKH đa sàn" },
    en: { date: "2025 Q3", title: "Idea", desc: "Founder identified the multi-channel CS challenge for SME shop owners" },
  },
  {
    vi: { date: "2026 Q1", title: "MVP", desc: "Ra mắt phiên bản MVP với Facebook, Zalo và AI trả lời tự động" },
    en: { date: "2026 Q1", title: "MVP", desc: "Launched MVP with Facebook, Zalo, and AI auto-reply" },
  },
  {
    vi: { date: "2026 Q2", title: "Mở rộng", desc: "Thêm TikTok Shop, Shopee, Instagram. Đạt 50+ shop sử dụng" },
    en: { date: "2026 Q2", title: "Growth", desc: "Added TikTok Shop, Shopee, Instagram. Reached 50+ active shops" },
  },
  {
    vi: { date: "2026+", title: "Tương lai", desc: "Mở rộng tính năng, tích hợp thêm nền tảng, phục vụ hàng ngàn shop" },
    en: { date: "2026+", title: "Future", desc: "Expand features, integrate more platforms, serve thousands of shops" },
  },
];

export default function AboutPage() {
  const { t, lang } = useLang();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto rounded-2xl border border-white/5 bg-black/70 backdrop-blur-2xl shadow-2xl">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600"><Zap className="h-3.5 w-3.5 text-white" /></div>
            <span className="font-bold text-base tracking-tight text-white">Omni<span className="text-zinc-500">AI</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-500">
            <Link href="/pricing" className="hover:text-white transition-colors">{t("footer.pricing")}</Link>
            <Link href="/docs" className="hover:text-white transition-colors">{t("footer.docs")}</Link>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle />
            <Link href="/login" className="text-xs text-zinc-400 hover:text-white transition-colors">{t("hero.login")}</Link>
          </div>
        </div>
      </nav>

      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] rounded-full bg-gradient-to-b from-blue-600/10 to-transparent blur-[100px] pointer-events-none" />

      {/* Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-5 py-24">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            {lang === "vi" ? "Về OmniAI" : "About OmniAI"}
          </h1>
          <p className="text-base text-zinc-400 leading-relaxed max-w-xl mx-auto">
            {lang === "vi"
              ? "Chúng tôi xây dựng OmniAI để giúp các chủ shop SME Việt Nam tự động hóa chăm sóc khách hàng — đơn giản, thông minh và hiệu quả."
              : "We built OmniAI to help Vietnamese SME shop owners automate customer care — simple, smart, and effective."}
          </p>
        </motion.div>

        {/* Story */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 p-6 rounded-xl border border-white/[0.06] bg-white/[0.015]"
        >
          <h2 className="text-lg font-extrabold text-white mb-4">
            {lang === "vi" ? "Câu chuyện của chúng tôi" : "Our Story"}
          </h2>
          {lang === "vi" ? (
            <>
              <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                Mọi chuyện bắt đầu khi founder của chúng tôi xây chatbot cho các chủ shop. Anh thấy họ vật lộn với tin nhắn đêm khuya không ai trả lời, trả 15-30 triệu/tháng cho nhân viên CSKH, và các bot trả lời như robot làm mất chất riêng của shop.
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                Câu hỏi đặt ra là: tại sao không xây một AI thực sự hiểu sản phẩm, chính sách và nói chuyện như chủ shop? Thế là OmniAI ra đời.
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Sau khi thử với vài shop, kết quả tốt hơn mong đợi — họ cắt giảm chi phí CSKH, không bỏ lỡ đơn hàng nào, khách hàng còn khen tư vấn nhiệt tình. Đó là lúc chúng tôi quyết định biến nó thành nền tảng cho tất cả chủ shop SME ở Việt Nam.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                It all started when our founder built chatbots for shop owners. He saw them struggling — late night messages with no one to reply, paying $600-1500/month for CS staff, bots that sounded robotic and killed their brand voice.
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                The question was: why not build an AI that actually understands products, policies, and talks like the shop owner? That's how OmniAI was born.
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                After testing with a few shops, the results exceeded expectations — they cut CS costs, never missed an order, customers even complimented the helpful advice. That's when we decided to turn it into a platform for every SME shop owner in Vietnam.
              </p>
            </>
          )}
        </motion.section>

        {/* Mission */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 p-6 rounded-xl border border-blue-500/10 bg-blue-600/[0.03]"
        >
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 shrink-0">
              <Quote className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white mb-2">
                {lang === "vi" ? "Sứ mệnh" : "Our Mission"}
              </h2>
              <p className="text-base text-zinc-300 leading-relaxed italic">
                {lang === "vi"
                  ? "\"Cho phép mọi chủ shop SME ở Việt Nam có một nhân viên CSKH AI làm việc 24/7 — với chi phí bằng 0 đồng khi bắt đầu.\""
                  : "\"Empower every Vietnamese SME shop owner with an AI customer care agent that works 24/7 — at zero cost to start.\""}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-lg font-extrabold text-white mb-6 text-center">
            {lang === "vi" ? "Giá trị cốt lõi" : "Core Values"}
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {values.map((v, i) => (
              <motion.div
                key={v.vi.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.015] hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20">
                    <v.icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {lang === "vi" ? v.vi.title : v.en.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {lang === "vi" ? v.vi.desc : v.en.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-lg font-extrabold text-white mb-6 text-center">
            {lang === "vi" ? "Hành trình" : "Our Journey"}
          </h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-600/40 via-purple-600/20 to-transparent" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.vi.date}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative pl-10"
                >
                  <div className="absolute left-2 top-1.5 w-[5px] h-[5px] rounded-full bg-blue-500 ring-2 ring-blue-500/30" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                    {lang === "vi" ? m.vi.date : m.en.date}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {lang === "vi" ? m.vi.title : m.en.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-1">
                    {lang === "vi" ? m.vi.desc : m.en.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-lg font-extrabold text-white mb-6 text-center">
            {lang === "vi" ? "Đội ngũ" : "Team"}
          </h2>
          <div className="grid md:grid-cols-3 gap-3">
            {teamPlaceholders.map((member, i) => (
              <motion.div
                key={member.initials}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.015] text-center hover:border-white/10 transition-colors"
              >
                <div className={`flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-3 ${member.name === "You?" ? "border-2 border-dashed border-zinc-600" : "bg-gradient-to-br from-blue-600 to-purple-600"}`}>
                  <span className={`text-lg font-extrabold ${member.name === "You?" ? "text-zinc-500" : "text-white"}`}>
                    {member.initials}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{member.name}</h3>
                <p className="text-xs text-zinc-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] pt-14 pb-8 px-5">
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
              { title: "footer.product", links: [["footer.features", "/#features"], ["footer.docs", "/docs"]] },
              { title: "footer.company", links: [["footer.about", "/about"], ["footer.contact", "mailto:hello@omni-ai.com"]] },
              { title: "footer.legal", links: [["footer.privacy", "/privacy"], ["footer.terms", "/terms"]] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">{t(col.title)}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(([key, href]) => (
                    <li key={key}><Link href={href} className="text-sm text-zinc-600 hover:text-white transition-colors">{t(key)}</Link></li>
                  ))}
                </ul>
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

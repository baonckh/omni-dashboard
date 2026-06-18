"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";

const socialLinks = [
  { label: "Facebook", href: "#" },
  { label: "Zalo", href: "#" },
  { label: "Email", href: "mailto:hello@omni-ai.com" },
];

export default function ContactPage() {
  const { t, lang } = useLang();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
              {lang === "vi" ? "Liên hệ" : "Contact Us"}
            </h1>
            <p className="text-base text-zinc-400 max-w-lg mx-auto">
              {lang === "vi"
                ? "Có câu hỏi hoặc cần hỗ trợ? Hãy gửi tin nhắn cho chúng tôi."
                : "Have a question or need support? Send us a message."}
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-3"
            >
              {submitted ? (
                <div className="p-8 rounded-xl border border-green-500/20 bg-green-600/[0.05] text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mx-auto mb-4">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-2">
                    {lang === "vi" ? "Đã gửi!" : "Sent!"}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {lang === "vi"
                      ? "Cảm ơn bạn. Chúng tôi sẽ phản hồi trong vòng 24 giờ."
                      : "Thank you. We'll get back to you within 24 hours."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                      {lang === "vi" ? "Họ và tên" : "Full Name"}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                      placeholder={lang === "vi" ? "Tên của bạn" : "Your name"}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                      placeholder="hello@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                      {lang === "vi" ? "Tin nhắn" : "Message"}
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                      placeholder={lang === "vi" ? "Nội dung tin nhắn..." : "Your message..."}
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all active:scale-[0.97] shadow-lg shadow-blue-600/25"
                  >
                    <Send className="h-4 w-4" />
                    {lang === "vi" ? "Gửi tin nhắn" : "Send Message"}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 space-y-4"
            >
              {/* Email */}
              <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.015]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20">
                    <Mail className="h-4 w-4 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Email</h3>
                </div>
                <a
                  href="mailto:hello@omni-ai.com"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  hello@omni-ai.com
                </a>
              </div>

              {/* Social */}
              <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.015]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20">
                    <MessageSquare className="h-4 w-4 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {lang === "vi" ? "Mạng xã hội" : "Social"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="px-3 py-1.5 text-xs font-medium text-zinc-400 bg-white/[0.03] border border-white/10 rounded-lg hover:text-white hover:border-white/20 transition-all"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.015]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20">
                    <Zap className="h-4 w-4 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {lang === "vi" ? "Vị trí" : "Location"}
                  </h3>
                </div>
                <p className="text-xs text-zinc-500">
                  {lang === "vi"
                    ? "Việt Nam — hỗ trợ toàn quốc qua online"
                    : "Vietnam — nationwide online support"}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
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

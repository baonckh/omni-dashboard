"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Zap, Mail, Check } from "lucide-react";
import { useLang } from "@/lib/i18n";
import BorderBeam from "@/components/BorderBeam";
import LangToggle from "@/components/LangToggle";

const freeFeats = ["pricing.free_feat1", "pricing.free_feat2", "pricing.free_feat3", "pricing.free_feat4", "pricing.free_feat5", "pricing.free_feat6", "pricing.free_feat7"];
const starterFeats = ["pricing.starter_feat1", "pricing.starter_feat2", "pricing.starter_feat3", "pricing.starter_feat4", "pricing.starter_feat5", "pricing.starter_feat6", "pricing.starter_feat7", "pricing.starter_feat8"];
const proFeats = ["pricing.pro_feat1", "pricing.pro_feat2", "pricing.pro_feat3", "pricing.pro_feat4", "pricing.pro_feat5", "pricing.pro_feat6", "pricing.pro_feat7", "pricing.pro_feat8"];

export default function PricingPage() {
  const { t, lang } = useLang();

  const plans = [
    { nameKey: "pricing.free_name", price: "0", periodKey: "pricing.free_period", badgeKey: "pricing.free_badge", descKey: "pricing.free_desc", featKeys: freeFeats, ctaKey: "pricing.free_cta", ctaLink: "/register", highlight: false, disabled: false, color: "border-zinc-700" },
    { nameKey: "pricing.starter_name", price: lang === "vi" ? "199k" : "$8", period: lang === "vi" ? "/tháng" : "/mo", badgeKey: "pricing.starter_badge", descKey: "pricing.starter_desc", featKeys: starterFeats, ctaKey: "pricing.starter_cta", ctaLink: "mailto:giabao991199@gmail.com", highlight: true, disabled: true, color: "border-blue-500" },
    { nameKey: "pricing.pro_name", price: lang === "vi" ? "499k" : "$20", period: lang === "vi" ? "/tháng" : "/mo", badgeKey: "pricing.pro_badge", descKey: "pricing.pro_desc", featKeys: proFeats, ctaKey: "pricing.pro_cta", ctaLink: "mailto:giabao991199@gmail.com", highlight: false, disabled: true, color: "border-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto rounded-2xl border border-white/5 bg-black/70 backdrop-blur-2xl shadow-2xl">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600"><Zap className="h-3.5 w-3.5 text-white" /></div>
            <span className="font-bold text-base tracking-tight text-white">Omni<span className="text-zinc-500">AI</span></span>
          </Link>
          <Link href="/login" className="text-xs text-zinc-400 hover:text-white transition-colors">{t("hero.login")}</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-5 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] rounded-full bg-gradient-to-b from-blue-600/10 to-transparent blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 bg-blue-600/10 border border-blue-500/20 text-blue-300">
            <Bot className="h-3 w-3" /> {t("pricing.badge")}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">{t("pricing.title")}</h1>
          <p className="text-zinc-400 max-w-lg mx-auto">{t("pricing.sub")}</p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-5 pb-24">
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.nameKey}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className={`group relative rounded-2xl border p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${plan.highlight ? "border-blue-500 shadow-lg shadow-blue-600/10 scale-[1.02]" : "border-white/5"} ${plan.disabled ? "opacity-80 hover:opacity-100" : ""}`}
              style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-lg z-10">
                  {t(plan.badgeKey)}
                </div>
              )}
              {!plan.highlight && <div className="inline-flex self-start px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-zinc-400 mb-2">{t(plan.badgeKey)}</div>}

              {plan.highlight && <BorderBeam size={60} duration={4} colorFrom="#60A5FA" colorTo="#A855F7" borderWidth={1} />}

              <h3 className="text-lg font-extrabold text-white mt-2">{t(plan.nameKey)}</h3>
              <div className="mt-3 mb-2">
                <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                <span className="text-sm text-zinc-500 ml-1">{plan.period || (plan.periodKey ? t(plan.periodKey) : "")}</span>
              </div>
              <p className="text-xs text-zinc-500 mb-6">{t(plan.descKey)}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.featKeys.map((fk) => (
                  <li key={fk} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">{t(fk)}</span>
                  </li>
                ))}
              </ul>

              {plan.disabled ? (
                <a href={plan.ctaLink} className="block w-full text-center py-3 rounded-xl text-sm font-bold border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer">
                  {t(plan.ctaKey)} →
                </a>
              ) : (
                <Link href={plan.ctaLink} className="block w-full text-center py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all active:scale-[0.98]">
                  {t(plan.ctaKey)}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-12 p-8 rounded-2xl border border-white/5 bg-white/[0.02] text-center"
        >
          <h3 className="text-lg font-extrabold text-white mb-2">{t("pricing.contact_title")}</h3>
          <p className="text-sm text-zinc-500 mb-4">{t("pricing.contact_desc")}</p>
          <a href="mailto:giabao991199@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-all hover:-translate-y-0.5"
          >
            <Mail className="h-4 w-4" />
            {t("pricing.contact_btn")}
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] pt-14 pb-8 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600"><Zap className="h-3.5 w-3.5 text-white" /></div>
                <span className="font-bold text-base tracking-tight text-white">Omni<span className="text-zinc-500">AI</span></span>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs text-zinc-500">{t("footer.desc")}</p>
            </div>
            <div className="flex gap-8">
              {[
                { title: "footer.product", links: [["footer.features", "/#features"], ["footer.docs", "/docs"]] },
                { title: "footer.company", links: [["footer.about", "/about"], ["footer.contact", "mailto:giabao991199@gmail.com"]] },
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
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600">© 2026 OmniAI. {t("footer.rights")}</p>
            <LangToggle />
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

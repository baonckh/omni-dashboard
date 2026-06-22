"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Zap, Mail, Check, Crown, Building2, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useSession } from "next-auth/react";
import BorderBeam from "@/components/BorderBeam";
import LangToggle from "@/components/LangToggle";

const freeFeatKeys = ["pricing.free_feat1", "pricing.free_feat2", "pricing.free_feat3", "pricing.free_feat4", "pricing.free_feat5", "pricing.free_feat6", "pricing.free_feat7"];
const starterFeatKeys = ["pricing.starter_feat1", "pricing.starter_feat2", "pricing.starter_feat3", "pricing.starter_feat4", "pricing.starter_feat5", "pricing.starter_feat6", "pricing.starter_feat7", "pricing.starter_feat8"];
const proFeatKeys = ["pricing.pro_feat1", "pricing.pro_feat2", "pricing.pro_feat3", "pricing.pro_feat4", "pricing.pro_feat5", "pricing.pro_feat6", "pricing.pro_feat7", "pricing.pro_feat8"];

const enterpriseFeats = [
  "enterprise_feat1", "enterprise_feat2", "enterprise_feat3",
  "enterprise_feat4", "enterprise_feat5", "enterprise_feat6",
];

export default function PricingPage() {
  const { t, lang } = useLang();
  const { data: session } = useSession();
  // ponytail: Beta MVP = everything except "starter" → Pro. Remove after Beta.
  const raw = session?.user?.plan;
  const currentPlanId = (raw === "pro" || raw === "free" || raw === "beta" || !raw) ? "pro" : raw === "starter" ? "starter" : null;

  const plans = [
    {
      id: "free", nameKey: "pricing.free_name", price: "0", periodKey: "pricing.free_period",
      badgeKey: "pricing.free_badge", descKey: "pricing.free_desc",
      featKeys: freeFeatKeys, ctaKey: "pricing.free_cta", ctaLink: "/register",
      highlight: false, disabled: false,
    },
    {
      id: "starter", nameKey: "pricing.starter_name",
      price: lang === "vi" ? "199k" : "$8", period: lang === "vi" ? "/tháng" : "/mo",
      badgeKey: "pricing.starter_badge", descKey: "pricing.starter_desc",
      featKeys: starterFeatKeys, ctaKey: "pricing.starter_cta", ctaLink: "mailto:giabao991199@gmail.com",
      highlight: false, disabled: true,
    },
    {
      id: "pro", nameKey: "pricing.pro_name",
      price: "0", periodKey: "pricing.pro_period",
      originalPrice: lang === "vi" ? "499k" : "$20", originalPeriod: lang === "vi" ? "/tháng" : "/mo",
      badgeKey: "pricing.pro_badge", descKey: "pricing.pro_desc",
      featKeys: proFeatKeys, ctaKey: "pricing.pro_cta", ctaLink: "/register",
      highlight: true, disabled: false,
    },
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
          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/app/overview"
                className="flex items-center gap-2 text-xs text-zinc-300 hover:text-white transition-colors">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                  {(session.user?.name || "?").charAt(0)}
                </div>
                <span className="hidden sm:inline">{session.user?.name || session.user?.email}</span>
              </Link>
            ) : (
              <Link href="/login" className="text-xs text-zinc-400 hover:text-white transition-colors">{t("hero.login")}</Link>
            )}
            <LangToggle />
          </div>
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
      <section className="max-w-7xl mx-auto px-5 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, i) => {
            const isCurrent = plan.id === currentPlanId && !!session;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className={`group relative rounded-2xl border p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${plan.highlight ? "shadow-lg scale-[1.02]" : "border-white/5"} ${plan.disabled ? "opacity-80 hover:opacity-100" : ""}`}
                style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: plan.highlight ? "rgba(168,85,247,0.4)" : undefined }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-[9px] md:text-[10px] font-bold text-white shadow-lg z-10 whitespace-nowrap">
                    {t(plan.badgeKey)}
                  </div>
                )}
                {!plan.highlight && (
                  <div className="inline-flex self-start px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-medium text-zinc-400 mb-2">{t(plan.badgeKey)}</div>
                )}

                {plan.highlight && <BorderBeam size={80} duration={4} colorFrom="#A855F7" colorTo="#3B82F6" borderWidth={1.5} />}

                {isCurrent && (
                  <div className="absolute top-10 md:top-12 right-2 md:right-4 flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[8px] md:text-[9px] font-bold uppercase tracking-wider z-20">
                    <Crown className="h-2.5 w-2.5 md:h-3 md:w-3" /> {t("pricing.current_badge") || "Current Plan"}
                  </div>
                )}

                <h3 className="text-base md:text-lg font-extrabold text-white mt-2">{t(plan.nameKey)}</h3>
                <div className="mt-2 md:mt-3 mb-2">
                  {plan.originalPrice && (
                    <span className="text-sm md:text-lg font-bold text-zinc-600 line-through mr-1 md:mr-2">{plan.originalPrice}<span className="text-xs md:text-sm">{plan.originalPeriod}</span></span>
                  )}
                  <span className="text-2xl md:text-3xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-xs md:text-sm text-zinc-500 ml-1">{plan.period || (plan.periodKey ? t(plan.periodKey) : "")}</span>
                </div>
                <p className="text-[11px] md:text-xs text-zinc-500 mb-4 md:mb-6">{t(plan.descKey)}</p>

                <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8 flex-1">
                  {plan.featKeys.map((fk) => (
                    <li key={fk} className="flex items-start gap-2 text-sm">
                      <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-xs md:text-sm text-zinc-300">{t(fk)}</span>
                    </li>
                  ))}
                </ul>

                {plan.disabled ? (
                  <a href={plan.ctaLink} className="block w-full text-center py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all">
                    {t(plan.ctaKey)} →
                  </a>
                ) : plan.highlight ? (
                  <Link href={plan.ctaLink} className="block w-full text-center py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-600/25 active:scale-[0.98]">
                    {t(plan.ctaKey)}
                  </Link>
                ) : (
                  <Link href={plan.ctaLink} className="block w-full text-center py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all active:scale-[0.98]">
                    {t(plan.ctaKey)}
                  </Link>
                )}

              </motion.div>
            );
          })}

          {/* Enterprise Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            viewport={{ once: true }}
            className="group relative rounded-2xl border border-white/10 p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white/[0.02]"
          >
            {session?.user?.plan === "enterprise" && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase tracking-wider z-20">
                <Crown className="h-3 w-3" /> {lang === "vi" ? "Gói hiện tại" : "Current Plan"}
              </div>
            )}
            <div className="self-start px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-zinc-400 mb-2">
              {lang === "vi" ? "Doanh nghiệp" : "Enterprise"}
            </div>
            <div className="mt-3 mb-4">
              <div className="p-2.5 bg-zinc-700/30 rounded-xl w-fit">
                <Building2 className="h-6 w-6 text-zinc-300" />
              </div>
            </div>
            <h3 className="text-lg font-extrabold text-white">{lang === "vi" ? "Doanh nghiệp" : "Enterprise"}</h3>
            <div className="text-3xl font-extrabold text-white mt-3 mb-2">{lang === "vi" ? "Liên hệ" : "Custom"}</div>
            <p className="text-xs text-zinc-500 mb-6">
              {lang === "vi"
                ? "Giải pháp tùy chỉnh riêng cho doanh nghiệp của bạn. SLA cam kết, support dedicated, deal giá linh hoạt."
                : "Custom solution for your enterprise. Dedicated support, SLA, flexible pricing."}
            </p>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                [lang === "vi" ? "Không giới hạn mọi thứ" : "Everything unlimited"],
                [lang === "vi" ? "SLA 99.9%" : "99.9% SLA"],
                [lang === "vi" ? "Hỗ trợ riêng 24/7" : "Dedicated 24/7 support"],
                [lang === "vi" ? "Tích hợp API riêng" : "Custom API integration"],
                [lang === "vi" ? "Triển khai on-premise" : "On-premise deployment"],
                [lang === "vi" ? "Đào tạo nhân viên" : "Staff training"],
              ].map((feat, fi) => (
                <li key={fi} className="flex items-start gap-2.5 text-sm">
                  <Check className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-zinc-300">{feat[0]}</span>
                </li>
              ))}
            </ul>

            <a href="mailto:giabao991199@gmail.com?subject=Enterprise%20Plan"
              className="block w-full text-center py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {lang === "vi" ? "Liên hệ tư vấn" : "Contact Sales"} <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
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

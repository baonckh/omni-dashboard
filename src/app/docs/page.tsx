"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, BookOpen, Bot, Grid3X3, Code2, HelpCircle, Mail, ArrowRight, Rocket } from "lucide-react";
import { useLang } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";

const docSections = [
  {
    icon: Rocket,
    key: "getting-started",
    vi: { title: "Bắt đầu", desc: "Tạo tài khoản, kết nối kênh đầu tiên, cấu hình AI trả lời tự động trong 5 phút.", items: ["Đăng ký tài khoản", "Kết nối Facebook Messenger", "Kết nối Zalo OA", "Cấu hình AI cơ bản"] },
    en: { title: "Getting Started", desc: "Create your account, connect your first channel, configure AI auto-reply in 5 minutes.", items: ["Sign up for an account", "Connect Facebook Messenger", "Connect Zalo OA", "Configure basic AI settings"] },
  },
  {
    icon: Bot,
    key: "bot-setup",
    vi: { title: "Cài đặt Bot", desc: "Tạo persona AI, tải lên danh mục sản phẩm, thiết lập quy tắc trả lời và kịch bản.", items: ["Tạo AI Persona", "Tải lên danh mục sản phẩm", "Thiết lập quy tắc trả lời", "Kiểm thử bot"] },
    en: { title: "Bot Setup", desc: "Create AI persona, upload product catalog, set up reply rules and scenarios.", items: ["Create AI Persona", "Upload product catalog", "Set reply rules", "Test your bot"] },
  },
  {
    icon: Grid3X3,
    key: "channel-integration",
    vi: { title: "Tích hợp kênh", desc: "Kết nối tất cả nền tảng bán hàng của bạn vào một hộp thư tập trung.", items: ["Facebook Messenger", "Zalo OA", "TikTok Shop", "Shopee", "Instagram"] },
    en: { title: "Channel Integration", desc: "Connect all your sales platforms into one unified inbox.", items: ["Facebook Messenger", "Zalo OA", "TikTok Shop", "Shopee", "Instagram"] },
  },
  {
    icon: Code2,
    key: "api-reference",
    vi: { title: "API Reference", desc: "Tích hợp OmniAI vào ứng dụng của bạn với REST API và webhooks.", items: ["Xác thực API", "Webhook Events", "Quản lý hội thoại", "Quản lý sản phẩm"] },
    en: { title: "API Reference", desc: "Integrate OmniAI into your application with REST API and webhooks.", items: ["API Authentication", "Webhook Events", "Conversation Management", "Product Management"] },
  },
  {
    icon: HelpCircle,
    key: "faq",
    vi: { title: "FAQ", desc: "Các câu hỏi thường gặp về OmniAI, AI và thanh toán.", items: ["AI có hiểu tiếng Việt không?", "Dữ liệu của tôi có an toàn không?", "Tôi có thể dùng thử miễn phí không?", "Làm thế nào để hủy tài khoản?"] },
    en: { title: "FAQ", desc: "Frequently asked questions about OmniAI, AI capabilities, and billing.", items: ["Does AI understand Vietnamese?", "Is my data secure?", "Can I try for free?", "How do I cancel my account?"] },
  },
];

export default function DocsPage() {
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
              {lang === "vi" ? "Tài liệu" : "Documentation"}
            </h1>
            <p className="text-base text-zinc-400 max-w-lg mx-auto">
              {lang === "vi"
                ? "Hướng dẫn chi tiết để bắt đầu với OmniAI và tối ưu hóa CSKH tự động."
                : "Detailed guides to get started with OmniAI and optimize your automated customer care."}
            </p>
          </div>

          {/* Card Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {docSections.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group p-6 rounded-xl border border-white/[0.06] bg-white/[0.015] hover:border-blue-500/20 hover:bg-blue-600/[0.03] transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <h2 className="text-base font-extrabold text-white group-hover:text-blue-300 transition-colors">
                      {lang === "vi" ? section.vi.title : section.en.title}
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                    {lang === "vi" ? section.vi.desc : section.en.desc}
                  </p>
                  <ul className="space-y-2">
                    {(lang === "vi" ? section.vi.items : section.en.items).map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-xs text-zinc-400">
                        <div className="w-1 h-1 rounded-full bg-zinc-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {lang === "vi" ? "Xem chi tiết" : "View details"}
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 p-6 rounded-xl border border-white/[0.06] bg-white/[0.015] text-center"
          >
            <h3 className="text-sm font-extrabold text-white mb-2">
              {lang === "vi" ? "Cần hỗ trợ thêm?" : "Need more help?"}
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              {lang === "vi"
                ? "Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp bạn."
                : "Our support team is ready to help you."}
            </p>
            <a
              href="mailto:hello@omni-ai.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all"
            >
              <Mail className="h-4 w-4" />
              hello@omni-ai.com
            </a>
          </motion.div>
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

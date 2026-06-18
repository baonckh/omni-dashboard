"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import {
  Zap, BookOpen, Bot, Globe, Code2, HelpCircle, ArrowRight,
  Facebook, MessageSquare, ShoppingBag, MessageCircle, Smartphone,
  CheckCircle2, ExternalLink, Mail
} from "lucide-react";
import LangToggle from "@/components/LangToggle";

const DOCS_SECTIONS = [
  {
    id: "getting-started",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    articles: [
      { key: "register", href: "/register" },
      { key: "connect-fb", href: "/app/channels" },
      { key: "connect-zalo", href: "/app/channels" },
      { key: "basic-ai", href: "/app/settings" },
    ],
  },
  {
    id: "bot-setup",
    icon: Bot,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    articles: [
      { key: "create-persona", href: "/app/bots" },
      { key: "upload-products", href: "/app/products" },
      { key: "set-rules", href: "/app/bots" },
      { key: "test-bot", href: "/app/bots" },
    ],
  },
  {
    id: "channels",
    icon: Globe,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    articles: [
      { key: "fb-messenger", href: "/app/channels" },
      { key: "zalo-oa", href: "/app/channels" },
      { key: "tiktok-shop", href: "/app/channels" },
      { key: "shopee", href: "/app/channels" },
      { key: "web-widget", href: "/app/settings" },
    ],
  },
  {
    id: "api",
    icon: Code2,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    articles: [
      { key: "auth", href: "#" },
      { key: "webhooks", href: "#" },
      { key: "conversations", href: "#" },
      { key: "products-api", href: "#" },
    ],
  },
  {
    id: "faq",
    icon: HelpCircle,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    articles: [
      { key: "ai-vietnamese", href: "#" },
      { key: "data-security", href: "/privacy" },
      { key: "free-trial", href: "/pricing" },
      { key: "cancel", href: "#" },
    ],
  },
];

const ARTICLE_CONTENT: Record<string, { vi: { title: string; desc: string }; en: { title: string; desc: string } }> = {
  "register": {
    vi: { title: "Đăng ký tài khoản", desc: "Tạo tài khoản OmniAI miễn phí, không cần thẻ tín dụng. Đăng ký bằng email hoặc Google trong 30 giây." },
    en: { title: "Create Account", desc: "Create a free OmniAI account, no credit card needed. Sign up with email or Google in 30 seconds." },
  },
  "connect-fb": {
    vi: { title: "Kết nối Facebook Messenger", desc: "Kết nối Facebook Page để bot tự động trả lời tin nhắn. Cần quyền quản trị Page." },
    en: { title: "Connect Facebook Messenger", desc: "Connect your Facebook Page for automatic message replies. Page admin access required." },
  },
  "connect-zalo": {
    vi: { title: "Kết nối Zalo OA", desc: "Kết nối Zalo Official Account để tiếp cận khách hàng trên Zalo." },
    en: { title: "Connect Zalo OA", desc: "Connect Zalo Official Account to reach customers on Zalo." },
  },
  "basic-ai": {
    vi: { title: "Cấu hình AI cơ bản", desc: "Thiết lập AI Provider (OpenAI, Gemini) trong Settings → AI Providers. Bot sẽ dùng key này để trả lời." },
    en: { title: "Basic AI Setup", desc: "Configure AI Provider (OpenAI, Gemini) in Settings → AI Providers. The bot uses this key to reply." },
  },
  "create-persona": {
    vi: { title: "Tạo AI Persona", desc: "Tạo bot với tính cách riêng: chọn giọng điệu (chuyên nghiệp/thân thiện), thiết lập rules, greeting." },
    en: { title: "Create AI Persona", desc: "Create a bot with custom personality: choose tone (professional/friendly), set rules, greeting." },
  },
  "upload-products": {
    vi: { title: "Tải lên danh mục sản phẩm", desc: "Import sản phẩm từ CSV/text hoặc nhập thủ công. AI tự động học catalog để tư vấn chính xác." },
    en: { title: "Upload Product Catalog", desc: "Import products from CSV/text or add manually. AI automatically learns the catalog for accurate recommendations." },
  },
  "set-rules": {
    vi: { title: "Thiết lập quy tắc trả lời", desc: "Tạo rules cho bot: thu thập SĐT, không tự giảm giá, chuyển hội thoại khi cần thiết." },
    en: { title: "Set Reply Rules", desc: "Create bot rules: collect phone numbers, no unauthorized discounts, escalate conversations when needed." },
  },
  "test-bot": {
    vi: { title: "Kiểm thử bot", desc: "Dùng Playground trong Bot Config để chat thử với bot trước khi đi live." },
    en: { title: "Test Your Bot", desc: "Use the Playground in Bot Config to chat with your bot before going live." },
  },
  "fb-messenger": {
    vi: { title: "Facebook Messenger", desc: "Tích hợp Messenger: tự động trả lời, gửi link sản phẩm, chốt đơn ngay trên Facebook." },
    en: { title: "Facebook Messenger", desc: "Messenger integration: auto-reply, send product links, close sales directly on Facebook." },
  },
  "zalo-oa": {
    vi: { title: "Zalo OA", desc: "Kết nối Zalo Official Account, quản lý hội thoại Zalo trong cùng inbox với các kênh khác." },
    en: { title: "Zalo OA", desc: "Connect Zalo OA, manage Zalo conversations in the same inbox as other channels." },
  },
  "tiktok-shop": {
    vi: { title: "TikTok Shop", desc: "Tích hợp TikTok Shop: tự động trả lời tin nhắn khách hàng trên TikTok." },
    en: { title: "TikTok Shop", desc: "TikTok Shop integration: automatically reply to customer messages on TikTok." },
  },
  "shopee": {
    vi: { title: "Shopee", desc: "Kết nối Shopee, quản lý chat Shopee cùng một inbox với Facebook, Zalo." },
    en: { title: "Shopee", desc: "Connect Shopee, manage Shopee chats in the same inbox with Facebook, Zalo." },
  },
  "web-widget": {
    vi: { title: "Web Widget", desc: "Nhúng chat widget vào website. Copy đoạn script trong Settings → Integrations." },
    en: { title: "Web Widget", desc: "Embed chat widget on your website. Copy the script from Settings → Integrations." },
  },
  "auth": {
    vi: { title: "Xác thực API", desc: "Sử dụng JWT token từ backend để xác thực requests. Token có hạn 24h." },
    en: { title: "API Authentication", desc: "Use JWT tokens from the backend to authenticate requests. Tokens expire in 24h." },
  },
  "webhooks": {
    vi: { title: "Webhook Events", desc: "Nhận sự kiện realtime qua webhook: tin nhắn mới, đơn hàng, hội thoại cần can thiệp." },
    en: { title: "Webhook Events", desc: "Receive realtime events via webhook: new messages, orders, conversations needing intervention." },
  },
  "conversations": {
    vi: { title: "Quản lý hội thoại", desc: "API CRUD cho hội thoại: lấy lịch sử, gửi tin nhắn, chuyển trạng thái bot/manual." },
    en: { title: "Conversation Management", desc: "Conversation CRUD API: get history, send messages, toggle bot/manual status." },
  },
  "products-api": {
    vi: { title: "Quản lý sản phẩm", desc: "API cho sản phẩm: CRUD, import CSV, đồng bộ lên vector DB." },
    en: { title: "Product Management", desc: "Product API: CRUD, CSV import, vector DB sync." },
  },
  "ai-vietnamese": {
    vi: { title: "AI có hiểu tiếng Việt không?", desc: "Có. AI sử dụng GPT-4o/Gemini hỗ trợ tiếng Việt tốt, kèm knowledge base sản phẩm riêng." },
    en: { title: "Does AI understand Vietnamese?", desc: "Yes. The AI uses GPT-4o/Gemini with strong Vietnamese support, plus your own product knowledge base." },
  },
  "data-security": {
    vi: { title: "Dữ liệu của tôi có an toàn không?", desc: "Dữ liệu được mã hoá, lưu trữ trên MongoDB Atlas + Qdrant Cloud. Xem Privacy Policy." },
    en: { title: "Is my data secure?", desc: "Data is encrypted, stored on MongoDB Atlas + Qdrant Cloud. See Privacy Policy." },
  },
  "free-trial": {
    vi: { title: "Tôi có thể dùng thử miễn phí không?", desc: "Có. Gói Pro miễn phí trong thời gian Beta. Không cần thẻ tín dụng." },
    en: { title: "Can I try for free?", desc: "Yes. Pro plan is free during Beta. No credit card needed." },
  },
  "cancel": {
    vi: { title: "Làm thế nào để hủy tài khoản?", desc: "Liên hệ hello@omni-ai.com để hủy. Chúng tôi sẽ xoá dữ liệu trong vòng 30 ngày." },
    en: { title: "How to cancel?", desc: "Contact hello@omni-ai.com to cancel. Data will be deleted within 30 days." },
  },
};

export default function DocsPage() {
  const { lang } = useLang();
  const isVI = lang === "vi";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto rounded-2xl border border-white/[0.06] bg-black/70 backdrop-blur-2xl shadow-2xl">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600"><Zap className="h-3.5 w-3.5 text-white" /></div>
            <span className="font-bold text-base tracking-tight text-white">Omni<span className="text-zinc-500">AI</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-500">
            <Link href="/" className="hover:text-white transition-colors">{isVI ? "Trang chủ" : "Home"}</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">{isVI ? "Bảng giá" : "Pricing"}</Link>
          </div>
          <LangToggle />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-5 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 bg-blue-600/10 border border-blue-500/20 text-blue-300">
            <BookOpen className="h-3 w-3" /> {isVI ? "Tài liệu" : "Documentation"}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            {isVI ? "Tài liệu hướng dẫn OmniAI" : "OmniAI Documentation"}
          </h1>
          <p className="text-zinc-400 max-w-lg mx-auto">
            {isVI
              ? "Hướng dẫn chi tiết để bắt đầu với OmniAI và tối ưu hóa CSKH tự động."
              : "Detailed guides to get started with OmniAI and optimize automated customer service."}
          </p>
        </div>
      </section>

      {/* Doc Cards */}
      <section className="max-w-5xl mx-auto px-5 pb-24 space-y-16">
        {DOCS_SECTIONS.map((section, si) => (
          <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: si * 0.05 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2.5 rounded-xl ${section.bg} ${section.border} border`}>
                <section.icon className={`h-5 w-5 ${section.color}`} />
              </div>
              <h2 className="text-xl font-bold text-white">
                {isVI ? ({
                  "getting-started": "Bắt đầu",
                  "bot-setup": "Cài đặt Bot",
                  "channels": "Tích hợp kênh",
                  "api": "API Reference",
                  "faq": "FAQ",
                })[section.id] : ({
                  "getting-started": "Getting Started",
                  "bot-setup": "Bot Setup",
                  "channels": "Channel Integration",
                  "api": "API Reference",
                  "faq": "FAQ",
                })[section.id]}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {section.articles.map((article, ai) => (
                <Link key={article.key} href={article.href}
                  className="group relative p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all active:scale-[0.98]"
                >
                  <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-blue-300 transition-colors">
                    {isVI ? ARTICLE_CONTENT[article.key]?.vi.title : ARTICLE_CONTENT[article.key]?.en.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    {isVI ? ARTICLE_CONTENT[article.key]?.vi.desc : ARTICLE_CONTENT[article.key]?.en.desc}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-[10px] font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isVI ? "Xem chi tiết" : "View details"} <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] pt-14 pb-8 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600"><Zap className="h-3.5 w-3.5 text-white" /></div>
                <span className="font-bold text-base tracking-tight text-white">Omni<span className="text-zinc-500">AI</span></span>
              </Link>
              <p className="text-sm leading-relaxed mb-4 text-zinc-500">
                {isVI
                  ? "Nền tảng Omnichannel AI giúp tự động hóa CSKH."
                  : "AI Omnichannel platform for automated customer service."}
              </p>
              <LangToggle />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">{isVI ? "Sản phẩm" : "Product"}</h4>
              <ul className="space-y-2.5">
                <li><Link href="/#features" className="text-sm text-zinc-600 hover:text-white transition-colors">{isVI ? "Tính năng" : "Features"}</Link></li>
                <li><Link href="/pricing" className="text-sm text-zinc-600 hover:text-white transition-colors">{isVI ? "Bảng giá" : "Pricing"}</Link></li>
                <li><Link href="/docs" className="text-sm text-zinc-600 hover:text-white transition-colors">{isVI ? "Tài liệu" : "Docs"}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">{isVI ? "Công ty" : "Company"}</h4>
              <ul className="space-y-2.5">
                <li><Link href="/about" className="text-sm text-zinc-600 hover:text-white transition-colors">{isVI ? "Giới thiệu" : "About"}</Link></li>
                <li><a href="mailto:hello@omni-ai.com" className="text-sm text-zinc-600 hover:text-white transition-colors">{isVI ? "Liên hệ" : "Contact"}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">{isVI ? "Pháp lý" : "Legal"}</h4>
              <ul className="space-y-2.5">
                <li><Link href="/privacy" className="text-sm text-zinc-600 hover:text-white transition-colors">{isVI ? "Chính sách bảo mật" : "Privacy Policy"}</Link></li>
                <li><Link href="/terms" className="text-sm text-zinc-600 hover:text-white transition-colors">{isVI ? "Điều khoản dịch vụ" : "Terms of Service"}</Link></li>
              </ul>
              <a href="mailto:hello@omni-ai.com" className="flex items-center gap-2 text-sm text-zinc-600 hover:text-white transition-colors mt-6">
                <Mail className="h-3.5 w-3.5" /> hello@omni-ai.com
              </a>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600">© 2026 OmniAI. {isVI ? "Mọi quyền được bảo lưu." : "All rights reserved."}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

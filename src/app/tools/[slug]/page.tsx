"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Check, Sigma, RefreshCw, ArrowLeftRight } from "lucide-react";

const TOOLS: Record<string, { vi: { name: string; desc: string; icon: JSX.Element }; en: { name: string; desc: string; icon: JSX.Element } }> = {
  "spell-check": {
    vi: { name: "AI Soát lỗi chính tả", desc: "Phát hiện và sửa lỗi chính tả, ngữ pháp tiếng Việt. Dán văn bản → nhận kết quả ngay.", icon: <Check className="h-5 w-5" /> },
    en: { name: "AI Spell Check", desc: "Detect and fix Vietnamese spelling and grammar. Paste text → get result instantly.", icon: <Check className="h-5 w-5" /> },
  },
  summarize: {
    vi: { name: "AI Tóm tắt văn bản", desc: "Rút gọn bài viết, email, tài liệu thành 3-5 câu ngắn gọn. Giữ nguyên ý chính.", icon: <Sigma className="h-5 w-5" /> },
    en: { name: "AI Text Summarizer", desc: "Condense articles, emails, documents into 3-5 short sentences.", icon: <Sigma className="h-5 w-5" /> },
  },
  rewrite: {
    vi: { name: "AI Viết lại nội dung", desc: "Viết lại đoạn văn theo giọng điệu mong muốn: chuyên nghiệp, thân thiện, ngắn gọn.", icon: <RefreshCw className="h-5 w-5" /> },
    en: { name: "AI Rewriter", desc: "Rewrite paragraphs in your desired tone: professional, friendly, concise.", icon: <RefreshCw className="h-5 w-5" /> },
  },
  "tone-changer": {
    vi: { name: "AI Chuyển giọng văn", desc: "Chuyển đổi giữa các phong cách viết: báo chí, marketing, kỹ thuật, chat.", icon: <ArrowLeftRight className="h-5 w-5" /> },
    en: { name: "AI Tone Changer", desc: "Switch between writing styles: journalistic, marketing, technical, chat.", icon: <ArrowLeftRight className="h-5 w-5" /> },
  },
};

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  const { lang } = useLang();
  const t = TOOLS[params.slug];
  if (!t) return <main className="min-h-screen bg-black text-white flex items-center justify-center"><p className="text-zinc-500">Tool not found</p></main>;

  const info = lang === "en" ? t.en : t.vi;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 pt-28 pb-16">
        <Link href="/tools" className="text-sm text-zinc-500 hover:text-white mb-6 inline-block">← {lang === "en" ? "All tools" : "Tất cả công cụ"}</Link>
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mb-4">{info.icon}</div>
        <h1 className="text-3xl font-extrabold mb-3">{info.name}</h1>
        <p className="text-zinc-400 mb-8">{info.desc}</p>

        <div className="rounded-2xl border border-white/10 p-6 text-center bg-gradient-to-br from-amber-600/5 to-transparent">
          <p className="text-sm text-zinc-400 mb-4">{lang === "en" ? "Need AI for your shop? OmniAI answers customers 24/7 on Facebook, Zalo, TikTok, Shopee." : "Cần AI mạnh hơn cho shop? OmniAI trả lời khách 24/7 trên Facebook, Zalo, TikTok, Shopee."}</p>
          <Link href="/register?redirect=/tools" className="inline-flex px-6 py-3 rounded-xl bg-amber-600 font-bold text-sm hover:bg-amber-500 transition-colors">{lang === "en" ? "Try OmniAI for free" : "Dùng thử OmniAI miễn phí"}</Link>
        </div>
      </div>
    </main>
  );
}

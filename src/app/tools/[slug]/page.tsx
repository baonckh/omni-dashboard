"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLang } from "@/lib/i18n";

const ICONS: Record<string, string> = {
  "spell-check": "✓",
  summarize: "Σ",
  rewrite: "↻",
  "tone-changer": "⇄",
};

const DAILY_LIMIT = 1;
const DAILY_KEY_PREFIX = "omni_tool_ai_";
function todayKey(slug: string) { return DAILY_KEY_PREFIX + slug + "_" + new Date().toISOString().slice(0, 10); }

const PROMPTS: Record<string, string> = {
  "spell-check": "Kiểm tra và sửa lỗi chính tả, ngữ pháp tiếng Việt. Chỉ trả về văn bản đã sửa:\n\n",
  summarize: "Tóm tắt văn bản sau thành 3-5 câu ngắn gọn bằng tiếng Việt:\n\n",
  rewrite: "Viết lại đoạn văn sau theo giọng điệu chuyên nghiệp, dễ đọc:\n\n",
  "tone-changer": "Chuyển đoạn văn sau sang giọng văn marketing, hấp dẫn:\n\n",
};

const TOOLS: Record<string, { vi: { name: string; desc: string }; en: { name: string; desc: string } }> = {
  "spell-check": {
    vi: { name: "AI Soát lỗi chính tả", desc: "Phát hiện và sửa lỗi chính tả, ngữ pháp tiếng Việt. Dán văn bản → nhận kết quả ngay." },
    en: { name: "AI Spell Check", desc: "Detect and fix Vietnamese spelling and grammar. Paste text → get result instantly." },
  },
  summarize: {
    vi: { name: "AI Tóm tắt văn bản", desc: "Rút gọn bài viết, email, tài liệu thành 3-5 câu ngắn gọn. Giữ nguyên ý chính." },
    en: { name: "AI Text Summarizer", desc: "Condense articles, emails, documents into 3-5 short sentences." },
  },
  rewrite: {
    vi: { name: "AI Viết lại nội dung", desc: "Viết lại đoạn văn theo giọng điệu mong muốn: chuyên nghiệp, thân thiện, ngắn gọn." },
    en: { name: "AI Rewriter", desc: "Rewrite paragraphs in your desired tone: professional, friendly, concise." },
  },
  "tone-changer": {
    vi: { name: "AI Chuyển giọng văn", desc: "Chuyển đổi giữa các phong cách viết: báo chí, marketing, kỹ thuật, chat." },
    en: { name: "AI Tone Changer", desc: "Switch between writing styles: journalistic, marketing, technical, chat." },
  },
};

export default function ToolDetailPage() {
  const params = useParams();
  const { lang } = useLang();
  const slug = params.slug as string;
  const t = TOOLS[slug];
  if (!t) return <main className="min-h-screen bg-black text-white flex items-center justify-center"><p className="text-zinc-500">Tool not found</p></main>;

  const info = lang === "en" ? t.en : t.vi;
  const promptTpl = PROMPTS[slug];
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(() => {
    const used = parseInt(localStorage.getItem(todayKey(slug)) || "0", 10);
    return Math.max(0, DAILY_LIMIT - used);
  });
  const locked = remaining <= 0;

  const handleAI = async () => {
    if (!input.trim() || locked) return;
    setLoading(true); setResult("");
    try {
      const r = await fetch("/api/tools/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptTpl + input }),
      });
      const d = await r.json();
      if (d.error) { setResult("Error: " + d.error); return; }
      setResult(d.result || "");
      const used = parseInt(localStorage.getItem(todayKey(slug)) || "0", 10) + 1;
      localStorage.setItem(todayKey(slug), String(used));
      setRemaining(0);
    } catch (e: any) { setResult("Error: " + e.message); }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 pt-28 pb-16">
        <Link href="/tools" className="text-sm text-zinc-500 hover:text-white mb-6 inline-block">← {lang === "en" ? "All tools" : "Tất cả công cụ"}</Link>
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-lg mb-4">{ICONS[slug]}</div>
        <h1 className="text-3xl font-extrabold mb-3">{info.name}</h1>
        <p className="text-zinc-400 mb-8">{info.desc}</p>

        {remaining > 0 && <p className="text-xs text-zinc-500 mb-3">{lang === "en" ? `${remaining} of ${DAILY_LIMIT} free use${remaining > 1 ? "s" : ""} remaining` : `Còn ${remaining} lần dùng thử hôm nay`}</p>}

        <div className="rounded-2xl border border-white/10 p-6 mb-6">
          {locked ? (
            <div className="text-center py-4">
              <p className="text-sm text-zinc-500 mb-3">{lang === "en" ? "You've used your free try for today" : "Bạn đã dùng hết lượt miễn phí hôm nay"}</p>
              <Link href={"/register?redirect=" + encodeURIComponent(slug)} className="inline-flex px-5 py-2 rounded-xl bg-amber-600 font-bold text-sm hover:bg-amber-500 transition-colors">{lang === "en" ? "Sign up for unlimited" : "Đăng ký để dùng không giới hạn"}</Link>
            </div>
          ) : (
            <>
              <textarea value={input} onChange={e => setInput(e.target.value)} rows={5} placeholder={lang === "en" ? `Enter text to ${info.name.toLowerCase()}...` : `Nhập văn bản cần ${info.name.toLowerCase()}...`}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 mb-4 focus:outline-none focus:border-blue-500/50" />
              <button onClick={handleAI} disabled={loading || !input.trim()}
                className="px-6 py-2.5 rounded-xl bg-blue-600 font-bold text-sm hover:bg-blue-500 disabled:opacity-50 transition-colors">
                {loading ? <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {lang === "en" ? "Processing..." : "Đang xử lý..."}</span> : (lang === "en" ? "Run" : "Chạy")}
              </button>
            </>
          )}
        </div>

        {result && (
          <div className="rounded-xl border border-white/10 p-5 mb-6">
            <p className="text-xs text-zinc-500 mb-2">{lang === "en" ? "Result" : "Kết quả"}</p>
            <p className="text-sm whitespace-pre-wrap">{result}</p>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 p-6 text-center bg-gradient-to-br from-amber-600/5 to-transparent">
          <p className="text-sm text-zinc-400 mb-4">{lang === "en" ? "Need AI for your shop? OmniAI answers customers 24/7 on Facebook, Zalo, TikTok, Shopee." : "Cần AI mạnh hơn cho shop? OmniAI trả lời khách 24/7 trên Facebook, Zalo, TikTok, Shopee."}</p>
          <Link href="/register?redirect=/tools" className="inline-flex px-6 py-3 rounded-xl bg-amber-600 font-bold text-sm hover:bg-amber-500 transition-colors">{lang === "en" ? "Try OmniAI for free" : "Dùng thử OmniAI miễn phí"}</Link>
        </div>
      </div>
    </main>
  );
}

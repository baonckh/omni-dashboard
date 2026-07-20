"use client";

import { useState } from "react";
import Link from "next/link";

export default function BotNamePage() {
  const [industry, setIndustry] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAI = async () => {
    if (!industry.trim()) return;
    setLoading(true); setResult("");
    try {
      const r = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Gợi ý 5 tên cho chatbot bán hàng online bằng tiếng Việt. Ngành hàng: ${industry}. Yêu cầu: tên ngắn gọn, dễ nhớ, có thể bao gồm tiếng Anh. Chỉ trả về danh sách 5 tên, mỗi tên 1 dòng.`,
        }),
      });
      const d = await r.json();
      setResult(d.result || "Lỗi: " + (d.error || "unknown"));
    } catch {
      setResult("Lỗi kết nối");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 pt-28 pb-16">
        <Link href="/tools" className="text-sm text-zinc-500 hover:text-white mb-6 inline-block">← Tất cả công cụ</Link>
        <h1 className="text-3xl font-extrabold mb-3">AI Đặt tên chatbot</h1>
        <p className="text-zinc-400 mb-8">Nhập ngành hàng của bạn — AI gợi ý 5 tên chatbot phù hợp. Miễn phí, không cần đăng nhập.</p>

        <div className="rounded-2xl border border-white/10 p-6 mb-6">
          <label className="block text-sm font-medium mb-2">Ngành hàng / Sản phẩm</label>
          <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="VD: Thời trang nam, Mỹ phẩm, Điện thoại"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 mb-4 focus:outline-none focus:border-blue-500/50" />
          <button onClick={handleAI} disabled={loading || !industry.trim()}
            className="px-6 py-3 rounded-xl bg-blue-600 font-bold text-sm hover:bg-blue-500 disabled:opacity-50 transition-colors">
            {loading ? "Đang xử lý..." : "Gợi ý tên"}
          </button>
        </div>

        {result && (
          <div className="rounded-xl border border-white/10 p-5 mb-6">
            <p className="text-xs text-zinc-500 mb-2">Gợi ý tên chatbot</p>
            <pre className="text-sm whitespace-pre-wrap font-sans">{result}</pre>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 p-6 text-center bg-gradient-to-br from-amber-600/5 to-transparent">
          <p className="text-sm text-zinc-400 mb-4">Cần bot CSKH thật cho shop? OmniAI trả lời khách 24/7 trên Facebook, Zalo, TikTok, Shopee.</p>
          <Link href="/register?redirect=/tools/bot-name" className="inline-flex px-6 py-3 rounded-xl bg-amber-600 font-bold text-sm hover:bg-amber-500 transition-colors">Dùng thử OmniAI miễn phí</Link>
        </div>
      </div>
    </main>
  );
}

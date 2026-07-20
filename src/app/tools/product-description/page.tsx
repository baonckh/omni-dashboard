"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProductDescriptionPage() {
  const [name, setName] = useState("");
  const [features, setFeatures] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAI = async () => {
    if (!name.trim()) return;
    setLoading(true); setResult("");
    try {
      const r = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Viết mô tả sản phẩm bán hàng online chuyên nghiệp, chuẩn SEO bằng tiếng Việt.\nTên sản phẩm: ${name}\nĐặc điểm: ${features || "không có"}\n\nViết 1 đoạn mô tả ngắn gọn (3-5 câu), nhấn mạnh lợi ích cho khách hàng.`,
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
        <h1 className="text-3xl font-extrabold mb-3">AI Viết mô tả sản phẩm</h1>
        <p className="text-zinc-400 mb-8">Nhập tên sản phẩm và đặc điểm — AI viết đoạn mô tả chuyên nghiệp, chuẩn SEO. Miễn phí, không cần đăng nhập.</p>

        <div className="rounded-2xl border border-white/10 p-6 mb-6">
          <label className="block text-sm font-medium mb-2">Tên sản phẩm</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Áo thun cotton nam tay ngắn"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 mb-4 focus:outline-none focus:border-blue-500/50" />
          <label className="block text-sm font-medium mb-2">Đặc điểm (không bắt buộc)</label>
          <textarea value={features} onChange={e => setFeatures(e.target.value)} rows={3} placeholder="VD: Chất liệu cotton 100%, form regular fit, 5 màu"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 mb-4 focus:outline-none focus:border-blue-500/50" />
          <button onClick={handleAI} disabled={loading || !name.trim()}
            className="px-6 py-3 rounded-xl bg-blue-600 font-bold text-sm hover:bg-blue-500 disabled:opacity-50 transition-colors">
            {loading ? "Đang xử lý..." : "Viết mô tả"}
          </button>
        </div>

        {result && (
          <div className="rounded-xl border border-white/10 p-5 mb-6">
            <p className="text-xs text-zinc-500 mb-2">Kết quả</p>
            <p className="text-sm whitespace-pre-wrap">{result}</p>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 p-6 text-center bg-gradient-to-br from-amber-600/5 to-transparent">
          <p className="text-sm text-zinc-400 mb-4">Viết mô tả từng sản phẩm thủ công? OmniAI tự động viết mô tả cho TOÀN BỘ danh mục — đồng bộ Facebook, Zalo, TikTok.</p>
          <Link href="/register?redirect=/tools/product-description" className="inline-flex px-6 py-3 rounded-xl bg-amber-600 font-bold text-sm hover:bg-amber-500 transition-colors">Dùng thử OmniAI miễn phí</Link>
        </div>
      </div>
    </main>
  );
}

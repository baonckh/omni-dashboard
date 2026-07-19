import Link from "next/link";

export const metadata = {
  title: "AI Viết mô tả sản phẩm miễn phí — OmniAI",
  description:
    "Công cụ AI viết mô tả sản phẩm bán hàng online. Nhập tên + đặc điểm → AI viết đoạn mô tả chuyên nghiệp, chuẩn SEO. Miễn phí, không lưu trữ.",
  openGraph: {
    title: "AI Viết mô tả sản phẩm — OmniAI",
    description:
      "Viết mô tả sản phẩm bán hàng bằng AI. Miễn phí, không cần đăng nhập.",
    url: "https://omni-dashboard-tau.vercel.app/tools/viet-mo-ta-san-pham",
  },
};

export default function ToolPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 pt-28 pb-16">
        <h1 className="text-3xl font-extrabold mb-3">
          AI Viết mô tả sản phẩm
        </h1>
        <p className="text-zinc-400 mb-8">
          Nhập tên sản phẩm và đặc điểm — AI viết đoạn mô tả chuyên nghiệp, chuẩn SEO, sẵn sàng đăng bán.
          Miễn phí, không lưu trữ.
        </p>

        <div className="rounded-2xl border border-white/10 p-6 mb-6">
          <label className="block text-sm font-medium mb-2">
            Tên sản phẩm
          </label>
          <input
            type="text"
            placeholder="VD: Áo thun cotton nam tay ngắn"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 mb-4 focus:outline-none focus:border-blue-500/50"
          />
          <label className="block text-sm font-medium mb-2">
            Đặc điểm (màu sắc, chất liệu, kích thước, công dụng...)
          </label>
          <textarea
            rows={4}
            placeholder="VD: Chất liệu cotton 100%, form regular fit, 5 màu, phù hợp mặc hàng ngày, đi làm, đi chơi"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 mb-4 focus:outline-none focus:border-blue-500/50"
          />
          <button
            type="button"
            className="px-6 py-3 rounded-xl bg-blue-600 font-bold text-sm hover:bg-blue-500 transition-colors"
          >
            Viết mô tả
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 p-6 mb-12 text-center bg-gradient-to-br from-blue-600/5 to-transparent">
          <p className="text-sm text-zinc-400 mb-4">
            Viết mô tả cho từng sản phẩm thủ công tốn thời gian?
            OmniAI tự động viết mô tả cho TOÀN BỘ danh mục — đồng bộ Facebook, Zalo, TikTok.
          </p>
          <Link
            href="/register"
            className="inline-flex px-6 py-3 rounded-xl bg-blue-600 font-bold text-sm hover:bg-blue-500 transition-colors"
          >
            Dùng thử OmniAI miễn phí
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Link
            href="/tools"
            className="text-center p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors text-sm text-zinc-400 hover:text-white"
          >
            ← Tất cả công cụ
          </Link>
        </div>
      </div>
    </main>
  );
}

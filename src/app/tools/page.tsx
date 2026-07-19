import Link from "next/link";

export const metadata = {
  title: "AI Tools miễn phí — OmniAI",
  description:
    "Bộ công cụ AI miễn phí: soát lỗi chính tả, tóm tắt văn bản, viết lại nội dung, chuyển đổi file. Không đăng ký, không lưu trữ.",
  openGraph: {
    title: "AI Tools miễn phí — OmniAI",
    description:
      "Soát lỗi, tóm tắt, viết lại nội dung bằng AI. Free, không lưu trữ.",
    url: "https://omni-dashboard-tau.vercel.app/tools",
  },
};

const tools = [
  {
    name: "AI Soát lỗi chính tả",
    desc: "Dùng AI phát hiện và sửa lỗi chính tả, ngữ pháp tiếng Việt. Dán văn bản → nhận kết quả ngay.",
    icon: "✓",
  },
  {
    name: "AI Tóm tắt văn bản",
    desc: "Rút gọn bài viết, email, tài liệu thành 3-5 câu ngắn gọn. Giữ nguyên ý chính.",
    icon: "Σ",
  },
  {
    name: "AI Viết lại nội dung",
    desc: "Viết lại đoạn văn theo giọng điệu mong muốn: chuyên nghiệp, thân thiện, ngắn gọn.",
    icon: "↻",
  },
  {
    name: "AI Chuyển giọng văn",
    desc: "Chuyển đổi giữa các phong cách viết: báo chí, marketing, kỹ thuật, chat.",
    icon: "⇄",
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-5 pt-28 pb-16">
        <h1 className="text-3xl font-extrabold mb-3">AI Tools miễn phí</h1>
        <p className="text-zinc-400 mb-10 max-w-xl">
          Công cụ AI nhỏ gọn, xử lý tại chỗ. Không lưu trữ, không cần tài
          khoản. Dùng thử ngay — nếu thấy hữu ích, OmniAI bot có thể làm nhiều
          hơn thế cho shop của bạn.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {tools.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/10 p-6 hover:border-blue-500/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-lg mb-4">
                {t.icon}
              </div>
              <h2 className="font-bold mb-1">{t.name}</h2>
              <p className="text-sm text-zinc-500 mb-4">{t.desc}</p>
              <Link
                href="/register"
                className="text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                Dùng thử →
              </Link>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 p-8 text-center bg-gradient-to-br from-blue-600/5 to-transparent">
          <h2 className="text-xl font-bold mb-2">
            Cần AI mạnh hơn cho shop?
          </h2>
          <p className="text-sm text-zinc-400 mb-4 max-w-md mx-auto">
            OmniAI là bot CSKH tự động — hiểu sản phẩm, tồn kho, chính sách của
            bạn. Trả lời khách 24/7 trên Facebook, Zalo, TikTok, Shopee.
          </p>
          <Link
            href="/register"
            className="inline-flex px-6 py-3 rounded-xl bg-blue-600 font-bold text-sm hover:bg-blue-500 transition-colors"
          >
            Dùng thử OmniAI miễn phí
          </Link>
        </div>
      </div>
    </main>
  );
}

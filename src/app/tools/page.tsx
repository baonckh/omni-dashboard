import Link from "next/link";
import { ArrowLeftRight, ArrowRight, FileText } from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  "→": <ArrowRight className="h-5 w-5" />,
  "📄": <FileText className="h-5 w-5" />,
  "⇔": <ArrowLeftRight className="h-5 w-5" />,
};

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
    name: "AI Viết mô tả sản phẩm",
    desc: "Nhập tên + đặc điểm — AI viết đoạn mô tả chuyên nghiệp, chuẩn SEO, sẵn sàng đăng bán.",
    icon: "→",
    href: "/tools/product-description",
  },
  {
    name: "PDF sang Text",
    desc: "Chuyển PDF sang văn bản — upload hoặc dán nội dung, AI trích xuất nhanh chóng.",
    icon: "📄",
    href: "/tools/file-converter",
  },
  {
    name: "So sánh file",
    desc: "Upload 2 file — AI so sánh sự khác biệt. Hỗ trợ PDF, Word, Excel, text.",
    icon: "⇔",
    href: "/tools/file-compare",
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
            <Link key={t.name} href={t.href} className="block rounded-2xl border border-white/10 p-6 hover:border-blue-500/30 transition-colors group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-lg mb-4">
                {ICON_MAP[t.icon] || t.icon}
              </div>
              <h2 className="font-bold mb-1">{t.name}</h2>
              <p className="text-sm text-zinc-500 mb-4">{t.desc}</p>
            </Link>
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
          <Link href="/register?redirect=/tools" className="inline-flex px-6 py-3 rounded-xl bg-blue-600 font-bold text-sm hover:bg-blue-500 transition-colors">
            Dùng thử OmniAI miễn phí
          </Link>
        </div>
      </div>
    </main>
  );
}

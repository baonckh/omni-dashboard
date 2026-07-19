import Link from "next/link";

export const metadata = {
  title: "PDF sang Text miễn phí — OmniAI",
  description:
    "Chuyển đổi PDF sang văn bản trực tuyến, miễn phí, không cần đăng ký. Dán nội dung PDF hoặc tải lên — AI trích xuất văn bản nhanh chóng.",
  openGraph: {
    title: "PDF sang Text — Chuyển đổi miễn phí | OmniAI",
    description: "Chuyển PDF sang text online, free, không lưu trữ.",
    url: "https://omni-dashboard-tau.vercel.app/tools/pdf-sang-text",
  },
};

export default function PdfToTextPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 pt-28 pb-16">
        <h1 className="text-3xl font-extrabold mb-3">PDF sang Text</h1>
        <p className="text-zinc-400 mb-8">
          Dán nội dung PDF hoặc upload file — AI trích xuất văn bản nhanh chóng.
          Miễn phí, không lưu trữ, không cần đăng ký.
        </p>

        <div className="rounded-2xl border border-white/10 p-6 mb-6">
          <label className="block text-sm font-medium mb-2">Upload PDF</label>
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center mb-4 hover:border-blue-500/30 transition-colors cursor-pointer">
            <p className="text-zinc-500 text-sm">Kéo thả PDF vào đây hoặc click để chọn file</p>
            <p className="text-zinc-600 text-xs mt-1">Tối đa 10MB</p>
          </div>
          <label className="block text-sm font-medium mb-2">
            Hoặc dán nội dung PDF
          </label>
          <textarea
            rows={6}
            placeholder="Dán nội dung PDF vào đây..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 mb-4 focus:outline-none focus:border-blue-500/50"
          />
          <button
            type="button"
            className="px-6 py-3 rounded-xl bg-blue-600 font-bold text-sm hover:bg-blue-500 transition-colors"
          >
            Chuyển đổi
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 p-6 mb-12 text-center bg-gradient-to-br from-blue-600/5 to-transparent">
          <p className="text-sm text-zinc-400 mb-4">
            Phải copy-paste từ PDF thủ công tốn thời gian?
            OmniAI tự động đọc nội dung PDF — hỗ trợ trả lời khách dựa trên tài liệu, báo giá, catalogue.
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

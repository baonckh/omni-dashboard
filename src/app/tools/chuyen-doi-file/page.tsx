"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const FORMATS = [
  { label: "PDF → Text", accept: ".pdf", extract: "pdf" },
  { label: "Word (.docx) → Text", accept: ".docx", extract: "docx" },
  { label: "Excel (.xlsx) → CSV", accept: ".xlsx,.xls", extract: "xlsx" },
];

export default function ConvertPage() {
  const [tab, setTab] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fmt = FORMATS[tab];

  async function handleFile(f: File) {
    setLoading(true);
    setText("");
    try {
      const buf = await f.arrayBuffer();
      let out = "";
      if (fmt.extract === "pdf") {
        // ponytail: client-side pdf parsing via pdf.js CDN
        const pdfjs = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.155/+esm");
        const doc = await pdfjs.getDocument(buf).promise;
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const content = await page.getTextContent();
          out += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
      } else if (fmt.extract === "docx") {
        // ponytail: mammoth.js client-side
        const mammoth = await import("https://cdn.jsdelivr.net/npm/mammoth@1.8.0/+esm");
        const r = await mammoth.extractRawText({ arrayBuffer: buf });
        out = r.value;
      } else if (fmt.extract === "xlsx") {
        // ponytail: SheetJS client-side
        const XLSX = await import("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm");
        const wb = XLSX.read(buf, { type: "array" });
        out = wb.SheetNames.map((name: string) => {
          const sheet = wb.Sheets[name];
          return `=== ${name} ===\n` + XLSX.utils.sheet_to_csv(sheet);
        }).join("\n");
      }
      setText(out);
    } catch (e: any) {
      setText("Lỗi: " + (e.message || "Không thể đọc file"));
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 pt-28 pb-16">
        <h1 className="text-3xl font-extrabold mb-3">Chuyển đổi file</h1>
        <p className="text-zinc-400 mb-8">
          Chọn định dạng, upload file — trình duyệt xử lý trực tiếp. File KHÔNG rời khỏi máy bạn.
        </p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {FORMATS.map((f, i) => (
            <button key={f.label} onClick={() => { setTab(i); setText(""); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${i === tab ? "bg-blue-600 text-white" : "bg-white/5 text-zinc-400 hover:text-white"}`}
            >{f.label}</button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 p-6 mb-6">
          <input ref={inputRef} type="file" accept={fmt.accept} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden" />
          <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center mb-4 hover:border-blue-500/30 transition-colors cursor-pointer">
            {loading ? (
              <p className="text-zinc-400 text-sm">Đang xử lý...</p>
            ) : (
              <>
                <p className="text-zinc-500 text-sm">Click để chọn file {fmt.accept}</p>
                <p className="text-zinc-600 text-xs mt-1">Xử lý hoàn toàn trong trình duyệt</p>
              </>
            )}
          </div>

          {text && (
            <textarea readOnly value={text} rows={12}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none" />
          )}
          {text && (
            <button onClick={() => navigator.clipboard.writeText(text)}
              className="mt-2 px-4 py-2 rounded-xl bg-white/10 text-sm hover:bg-white/20 transition-colors">
              Copy kết quả
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 p-6 text-center bg-gradient-to-br from-blue-600/5 to-transparent">
          <p className="text-sm text-zinc-400 mb-4">
            Phải convert file thủ công tốn thời gian? OmniAI tự động đọc tài liệu, báo giá, catalogue — trả lời khách dựa trên nội dung thật.
          </p>
          <Link href="/register"
            className="inline-flex px-6 py-3 rounded-xl bg-blue-600 font-bold text-sm hover:bg-blue-500 transition-colors">
            Dùng thử OmniAI miễn phí
          </Link>
        </div>
      </div>
    </main>
  );
}

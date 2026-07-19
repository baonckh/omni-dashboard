"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import * as pdfjs from "pdfjs-dist";
import { extractRawText } from "mammoth";
import * as XLSX from "xlsx";
import { useLang } from "@/lib/i18n";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

const FREE_LIMIT = 3;
const USE_KEY = "omni_tool_uses";

const FORMATS = [
  { label: "PDF → Text", accept: ".pdf", extract: "pdf" },
  { label: "Word (.docx) → Text", accept: ".docx", extract: "docx" },
  { label: "Excel (.xlsx) → CSV", accept: ".xlsx,.xls", extract: "xlsx" },
];

const T = {
  title: { vi: "Chuyển đổi file", en: "File Converter" },
  desc: { vi: "Chọn định dạng, upload file — trình duyệt xử lý trực tiếp. File KHÔNG rời khỏi máy bạn.", en: "Select format and upload — processed in your browser. Files NEVER leave your device." },
  upload: { vi: "Click để chọn file", en: "Click to select file" },
  client: { vi: "Xử lý hoàn toàn trong trình duyệt", en: "Processed entirely in browser" },
  processing: { vi: "Đang xử lý...", en: "Processing..." },
  copy: { vi: "Copy kết quả", en: "Copy result" },
  download: { vi: "Tải về .txt", en: "Download .txt" },
  cta: { vi: "Phải convert file thủ công tốn thời gian? OmniAI tự động đọc tài liệu, báo giá, catalogue — trả lời khách dựa trên nội dung thật.", en: "Manual file conversion is tedious? OmniAI reads PDFs, quotes, catalogs — and answers based on real content." },
  cta_btn: { vi: "Dùng thử OmniAI miễn phí", en: "Try OmniAI for free" },
  error: { vi: "Lỗi: ", en: "Error: " },
  free_left: { vi: "Còn", en: "" },
  free_uses: { vi: "lần dùng thử", en: "free uses left" },
  locked_title: { vi: "Bạn đã dùng hết lượt miễn phí", en: "You've used all free tries" },
  locked_desc: { vi: "Đăng ký để dùng không giới hạn", en: "Sign up for unlimited use" },
};

export default function ConvertPage() {
  const [tab, setTab] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [blobUrl, setBlobUrl] = useState("");
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [remaining, setRemaining] = useState(FREE_LIMIT);
  const { lang } = useLang();
  const _ = (o: { vi: string; en: string }) => lang === "en" ? o.en : o.vi;

  // ponytail: read use count from localStorage
  useEffect(() => {
    const used = parseInt(localStorage.getItem(USE_KEY) || "0", 10);
    setRemaining(Math.max(0, FREE_LIMIT - used));
  }, []);

  function useOne() {
    const used = parseInt(localStorage.getItem(USE_KEY) || "0", 10) + 1;
    localStorage.setItem(USE_KEY, String(used));
    setRemaining(Math.max(0, FREE_LIMIT - used));
  }

  // ponytail: client-side title fallback
  useEffect(() => { document.title = _(T.title); }, [lang]);

  const fmt = FORMATS[tab];
  const locked = remaining <= 0;

  async function handleFile(f: File) {
    if (locked) return;
    useOne();
    setLoading(true);
    setText("");
    setBlobUrl("");
    try {
      const buf = await f.arrayBuffer();
      let out = "";
      if (fmt.extract === "pdf") {
        const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const content = await page.getTextContent();
          out += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
      } else if (fmt.extract === "docx") {
        const r = await extractRawText({ arrayBuffer: buf });
        out = r.value;
      } else if (fmt.extract === "xlsx") {
        const wb = XLSX.read(buf, { type: "array" });
        out = wb.SheetNames.map((name: string) => {
          const sheet = wb.Sheets[name];
          return `=== ${name} ===\n` + XLSX.utils.sheet_to_csv(sheet);
        }).join("\n");
      }
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(URL.createObjectURL(new Blob([out], { type: "text/plain" })));
      setText(out);
    } catch (e: any) {
      setText(_(T.error) + (e.message || ""));
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 pt-28 pb-16">
        <Link href="/tools" className="text-sm text-zinc-500 hover:text-white mb-6 inline-block">← {_({ vi: "Tất cả công cụ", en: "All tools" })}</Link>
        <h1 className="text-3xl font-extrabold mb-3">{_(T.title)}</h1>
        {remaining > 0 && remaining < FREE_LIMIT && (
          <p className="text-xs text-zinc-500 mb-2">{_(T.free_left)} {remaining} {_(T.free_uses)}</p>
        )}
        <p className="text-zinc-400 mb-8">{_(T.desc)}</p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {FORMATS.map((f, i) => (
            <button key={f.label} onClick={() => { setTab(i); setText(""); setBlobUrl(""); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${i === tab ? "bg-blue-600 text-white" : "bg-white/5 text-zinc-400 hover:text-white"}`}>{f.label}</button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 p-6 mb-6">
          {locked ? (
            <div className="text-center py-8">
              <p className="text-zinc-400 font-medium mb-2">{_(T.locked_title)}</p>
              <p className="text-zinc-600 text-sm mb-4">{_(T.locked_desc)}</p>
              <Link href="/register?redirect=/tools/file-converter"
                className="inline-flex px-5 py-2.5 rounded-xl bg-amber-600 font-bold text-sm hover:bg-amber-500 transition-colors">{_(T.cta_btn)}</Link>
            </div>
          ) : (
          <>          <input ref={inputRef} type="file" accept={fmt.accept} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
          <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center mb-4 hover:border-blue-500/30 transition-colors cursor-pointer">
            {loading ? (
              <p className="text-zinc-400 text-sm">{_(T.processing)}</p>
            ) : (
              <>
                <p className="text-zinc-500 text-sm">{_(T.upload)} {fmt.accept}</p>
                <p className="text-zinc-600 text-xs mt-1">{_(T.client)}</p>
              </>
            )}
          </div>

          {text && (
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-zinc-800 text-zinc-400 uppercase tracking-wider">{_({ vi: "AI tạo", en: "AI generated" })}</span>
              <span className="text-xs text-zinc-600">
                {_({ vi: "Kết quả có thể không chính xác 100%", en: "Result may not be 100% accurate" })}
              </span>
            </div>
          )}
          {text && (
            <textarea readOnly value={text} rows={12}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none" />
          )}
          {text && (
            <div className="flex gap-2 mt-2 flex-wrap">
              <button onClick={() => navigator.clipboard.writeText(text)}
                className="px-4 py-2 rounded-xl bg-white/10 text-sm hover:bg-white/20 transition-colors">{_(T.copy)}</button>
              {blobUrl && (
                <a href={blobUrl} download="converted.txt"
                  className="inline-flex px-4 py-2 rounded-xl bg-blue-600/20 text-sm text-blue-400 hover:bg-blue-600/30 transition-colors">{_(T.download)}</a>
              )}
            </div>
          )}
          {text && (
            <div className="flex items-center gap-2 mt-3 text-sm text-zinc-500">
              <button onClick={() => setFeedback("up")}
                className={`p-1.5 rounded-lg transition-colors ${feedback === "up" ? "text-green-400 bg-green-500/10" : "hover:text-white hover:bg-white/5"}`}>👍</button>
              <button onClick={() => setFeedback("down")}
                className={`p-1.5 rounded-lg transition-colors ${feedback === "down" ? "text-red-400 bg-red-500/10" : "hover:text-white hover:bg-white/5"}`}>👎</button>
              {feedback && <span className="text-xs text-zinc-600">{_({ vi: "Cảm ơn bạn!", en: "Thanks!" })}</span>}
            </div>
          )}
        </>
        )}
        </div>

        <div className="rounded-2xl border border-white/10 p-6 text-center bg-gradient-to-br from-amber-600/5 to-transparent">
          <p className="text-sm text-zinc-400 mb-4">{_(T.cta)}</p>
          <Link href="/register?redirect=/tools/file-converter" className="inline-flex px-6 py-3 rounded-xl bg-amber-600 font-bold text-sm hover:bg-amber-500 transition-colors">{_(T.cta_btn)}</Link>
        </div>
      </div>
    </main>
  );
}

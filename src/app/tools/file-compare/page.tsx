"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { diffLines, type Change } from "diff";
import { useLang } from "@/lib/i18n";

const T = {
  title: { vi: "So sánh file", en: "File Compare" },
  desc: { vi: "Upload 2 file để so sánh sự khác biệt. Xử lý hoàn toàn trong trình duyệt, file KHÔNG rời khỏi máy bạn.", en: "Upload 2 files to compare differences. Processed entirely in your browser, files NEVER leave your device." },
  upload_a: { vi: "File A (cũ)", en: "File A (old)" },
  upload_b: { vi: "File B (mới)", en: "File B (new)" },
  processing: { vi: "Đang xử lý...", en: "Processing..." },
  no_diff: { vi: "2 file giống nhau", en: "No differences found" },
};

export default function FileComparePage() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diffs, setDiffs] = useState<Change[] | null>(null);
  const [loading, setLoading] = useState(false);
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);
  const { lang } = useLang();
  const _ = (o: { vi: string; en: string }) => lang === "en" ? o.en : o.vi;

  const readFile = async (f: File): Promise<string> => {
    if (f.name.endsWith(".pdf")) {
      const buf = await f.arrayBuffer();
      const pdfjs = await import("pdfjs-dist");
      const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
      let text = "";
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ") + "\n";
      }
      return text;
    }
    return await f.text();
  };

  const handleFile = async (side: "a" | "b", f: File) => {
    setLoading(true);
    try {
      const text = await readFile(f);
      if (side === "a") setTextA(text);
      else setTextB(text);
    } catch {}
    setLoading(false);
  };

  const compare = () => {
    if (!textA || !textB) return;
    setDiffs(diffLines(textA, textB));
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-5 pt-28 pb-16">
        <Link href="/tools" className="text-sm text-zinc-500 hover:text-white mb-6 inline-block">← {_({ vi: "Tất cả công cụ", en: "All tools" })}</Link>
        <h1 className="text-3xl font-extrabold mb-3">{_(T.title)}</h1>
        <p className="text-zinc-400 mb-8">{_(T.desc)}</p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {(["a", "b"] as const).map((side) => (
            <div key={side} className="rounded-xl border border-white/10 p-4">
              <p className="text-sm font-medium mb-3">{side === "a" ? _(T.upload_a) : _(T.upload_b)}</p>
              <input ref={side === "a" ? inputARef : inputBRef} type="file" accept=".txt,.csv,.md,.json,.xml,.pdf" onChange={(e) => e.target.files?.[0] && handleFile(side, e.target.files[0])} className="hidden" />
              <div onClick={() => (side === "a" ? inputARef : inputBRef).current?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-blue-500/30 transition-colors cursor-pointer text-sm text-zinc-500">
                {loading ? _(T.processing) : `${_(side === "a" ? { vi: "Chọn file A", en: "Select file A" } : { vi: "Chọn file B", en: "Select file B" })} (.txt, .csv, .md, .pdf)`}
              </div>
              {(side === "a" ? textA : textB) && <p className="text-xs text-green-400 mt-2">✅ {_({ vi: "Đã tải", en: "Loaded" })} {(side === "a" ? textA : textB).length} chars</p>}
            </div>
          ))}
        </div>

        {textA && textB && (
          <button onClick={compare} disabled={diffs !== null}
            className="mb-6 px-6 py-3 rounded-xl bg-blue-600 font-bold text-sm hover:bg-blue-500 disabled:opacity-50 transition-colors">
            {_({ vi: "So sánh", en: "Compare" })}
          </button>
        )}

        {diffs && (
          <div className="rounded-xl border border-white/10 p-4 max-h-[500px] overflow-auto font-mono text-xs leading-relaxed">
            {diffs.length === 1 && !diffs[0].added && !diffs[0].removed ? (
              <p className="text-zinc-500">{_(T.no_diff)}</p>
            ) : (
              diffs.map((part, i) => {
                const color = part.added ? "text-green-400 bg-green-500/5" : part.removed ? "text-red-400 bg-red-500/5" : "text-zinc-500";
                const prefix = part.added ? "+" : part.removed ? "-" : " ";
                return part.value.split("\n").map((line, j) => line !== undefined ? (
                  <div key={`${i}-${j}`} className={`${color} px-2`}>
                    <span className="select-none w-4 inline-block shrink-0">{prefix}</span>
                    {line || <span className="opacity-0">.</span>}
                  </div>
                ) : null);
              })
            )}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-white/10 p-6 text-center bg-gradient-to-br from-amber-600/5 to-transparent">
          <p className="text-sm text-zinc-400 mb-4">{_({ vi: "Phải so sánh file thủ công tốn thời gian? OmniAI tự động xử lý tài liệu — chấp nhận mọi định dạng, so sánh thông minh.", en: "Manual file comparison tedious? OmniAI automatically processes documents — accepts all formats, smart diff." })}</p>
          <Link href="/register?redirect=/tools/file-compare" className="inline-flex px-6 py-3 rounded-xl bg-amber-600 font-bold text-sm hover:bg-amber-500 transition-colors">{_({ vi: "Dùng thử OmniAI miễn phí", en: "Try OmniAI for free" })}</Link>
        </div>
      </div>
    </main>
  );
}

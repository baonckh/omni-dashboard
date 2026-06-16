"use client";
import React, { useState, useEffect } from "react";
import { BookOpen, Upload, Globe, Trash2, FileText, ChevronDown, Settings } from "lucide-react";
import { useShopId } from "@/lib/use-shop";
import { ingestKnowledge, ingestWebKnowledge, listKnowledgeDocs, deleteKnowledgeDoc, fetchBotSettings } from "@/lib/api";
import { cn } from "@/lib/utils";

export function KnowledgeSection() {
  const shopId = useShopId();
  const [docs, setDocs] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [ingesting, setIngesting] = useState(false);
  const [ingestMode, setIngestMode] = useState<"text" | "web" | "file">("text");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    listKnowledgeDocs(shopId).then((d) => { if (Array.isArray(d)) setDocs(d); }).catch(() => {});
  }, []);

  const reload = async () => {
    const d = await listKnowledgeDocs(shopId);
    if (Array.isArray(d)) setDocs(d);
  };

  const handleIngest = async () => {
    if (!content.trim()) return;
    setIngesting(true);
    try {
      await ingestKnowledge(shopId, { title: title || "Untitled", content, source: "manual_text" });
      setTitle(""); setContent(""); await reload();
    } catch (e) { console.error(e); }
    setIngesting(false);
  };

  const handleIngestWeb = async () => {
    if (!webUrl.trim()) return;
    setIngesting(true);
    try {
      await ingestWebKnowledge(shopId, { url: webUrl, recursive: false });
      setWebUrl(""); await reload();
    } catch (e) { console.error(e); }
    setIngesting(false);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIngesting(true);
    try {
      const text = await file.text();
      await ingestKnowledge(shopId, { title: file.name, content: text, source: "file_upload" });
      await reload();
    } catch (e) { console.error(e); }
    setIngesting(false);
  };

  return (
    <div className="space-y-5">
      {/* Simple Upload */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white">Knowledge</h3>
          <span className="text-[10px] text-zinc-600">— AI tự động xử lý tài liệu</span>
        </div>

        {/* Tab: Text | Web | File */}
        <div className="flex gap-1 p-0.5 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
          {(["text", "web", "file"] as const).map((mode) => (
            <button key={mode} onClick={() => setIngestMode(mode)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                ingestMode === mode ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white"
              )}
            >
              {mode === "text" ? "Text" : mode === "web" ? "Web" : "File"}
            </button>
          ))}
        </div>

        {ingestMode === "text" && (
          <div className="space-y-3">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g., Price List 2026)"
              className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors"
            />
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Paste document content here..."
              rows={5}
              className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors resize-none"
            />
            <button onClick={handleIngest} disabled={ingesting || !content.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl text-sm font-bold transition-all"
            >
              <Upload className="h-4 w-4" /> {ingesting ? "Processing..." : "Upload"}
            </button>
          </div>
        )}

        {ingestMode === "web" && (
          <div className="flex gap-2">
            <input type="url" value={webUrl} onChange={(e) => setWebUrl(e.target.value)}
              placeholder="https://example.com/page"
              className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors"
            />
            <button onClick={handleIngestWeb} disabled={ingesting || !webUrl.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl text-sm font-bold transition-all"
            >
              <Globe className="h-4 w-4" />
            </button>
          </div>
        )}

        {ingestMode === "file" && (
          <label className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:border-blue-500/30 transition-colors">
            <FileText className="h-8 w-8 text-zinc-600 mb-2" />
            <p className="text-sm text-zinc-500">Click to upload CSV, TXT, PDF</p>
            <input type="file" accept=".csv,.txt,.pdf" className="hidden" onChange={handleFile} />
          </label>
        )}
      </div>

      {/* Document List */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Documents ({docs.length})
        </h4>
        {docs.length === 0 ? (
          <div className="text-center py-8 text-zinc-600">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">No documents yet. Upload above.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {docs.map((doc: any) => (
              <div key={doc.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] group">
                <FileText className="h-4 w-4 text-zinc-500 shrink-0" />
                <span className="flex-1 text-sm text-zinc-300 truncate">{doc.title}</span>
                <span className="text-[10px] text-zinc-600">{doc.status === "INDEXED" ? "✅" : "⏳"}</span>
                <button onClick={() => deleteKnowledgeDoc(shopId, doc.id).then(reload)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advanced toggle — collapsed by default */}
      <div className="border-t border-white/[0.04] pt-4">
        <button onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <Settings className="h-3.5 w-3.5" />
          Advanced Config
          <ChevronDown className={cn("h-3 w-3 transition-transform", showAdvanced && "rotate-180")} />
        </button>
        {showAdvanced && (
          <div className="mt-3 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] space-y-3">
            <p className="text-[10px] text-zinc-600">Embedding: Google Gemini · Model: text-embedding-005</p>
            <p className="text-[10px] text-zinc-600">Storage: Vector DB (Qdrant) · Strategy: Basic RAG</p>
            <p className="text-[10px] text-zinc-600">Configure in Settings → AI Providers to change.</p>
          </div>
        )}
      </div>
    </div>
  );
}

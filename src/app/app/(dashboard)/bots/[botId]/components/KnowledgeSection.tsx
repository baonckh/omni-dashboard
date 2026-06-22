"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Upload, Globe, Trash2, FileText, ChevronDown, Settings,
  Database, Search, Layers, Zap, Cpu, GitBranch, Server, BarChart3,
  Lock
} from "lucide-react";
import { useShopId } from "@/lib/use-shop";
import { useSession } from "next-auth/react";
import { getPlanSync } from "@/lib/plans";
import { ingestKnowledge, ingestWebKnowledge, listKnowledgeDocs, deleteKnowledgeDoc, fetchBotSettings, updateBotSettings, confirmProducts, createPolicy } from "@/lib/api";
import { cn } from "@/lib/utils";

const SEARCH_OPTIONS = [
  { id: "mongodb", label: "MongoDB", desc: "Exact match on structured data", icon: Database },
  { id: "qdrant", label: "Qdrant", desc: "Vector/semantic search", icon: Search },
];

const STORAGE_ENGINES = [
  { id: "vector_db", name: "Vector DB", desc: "Embedding → cosine/dot similarity (Qdrant)", status: "active", icon: Database },
  { id: "graph_db", name: "Graph DB", desc: "Entity-Relationship graph (Neo4j)", status: "available", icon: GitBranch },
  { id: "hybrid_store", name: "Hybrid Store", desc: "Vector + Graph combined", status: "planned", icon: Layers },
];

const RETRIEVAL_STRATEGIES = [
  { id: "basic_rag", name: "Basic RAG", desc: "Query → Embed → Top-K → Inject", status: "active", tier: "free", icon: Zap },
  { id: "graph_rag", name: "GraphRAG", desc: "Multi-hop entity graph reasoning", status: "available", tier: "starter", icon: GitBranch },
  { id: "light_rag", name: "LightRAG", desc: "Lightweight graph+vector hybrid", status: "available", tier: "starter", icon: Zap },
  { id: "advanced_rag", name: "Advanced RAG", desc: "HyDE + reranking + multi-step", status: "planned", tier: "pro", icon: Cpu },
];

export function KnowledgeSection() {
  const { data: session } = useSession();
  const shopId = useShopId();
  const userPlan = session?.user?.plan || "";
  const planLimits = getPlanSync(userPlan);
  const isFree = userPlan === "free";

  const [docs, setDocs] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [ingesting, setIngesting] = useState(false);
  const [ingestMode, setIngestMode] = useState<"text" | "web" | "file">("text");
  const [docType, setDocType] = useState<"products" | "policies">("products");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchMode, setSearchMode] = useState<string>("mongodb");
  const [retrievalMode, setRetrievalMode] = useState<string>("basic_rag");
  const [saving, setSaving] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string>("gemini");
  const [activeModel, setActiveModel] = useState<string>("gemini-embedding-001");
  const [availableModels, setAvailableModels] = useState<string[]>(["gemini-embedding-001", "gemini-embedding-2", "gemini-embedding-2-preview"]);
  const [chunkSize, setChunkSize] = useState<string>("1000");
  const [chunkOverlap, setChunkOverlap] = useState<string>("150");
  const [usage, setUsage] = useState<any>(null);
  const [importResult, setImportResult] = useState<{ type: string; message: string; ok: boolean } | null>(null);
  const [keyCount, setKeyCount] = useState(0);

  // ponytail: names match each provider's GenerateEmbedding backend
  // gemini API names: gemini-embedding-001 (20K ctx, unified), gemini-embedding-2 (8K, multimodal), gemini-embedding-2-preview
  // openai default: text-embedding-3-small
  const MODEL_MAP: Record<string, string[]> = {
    openai: ["text-embedding-3-large", "text-embedding-3-small", "text-embedding-ada-002"],
    gemini: ["gemini-embedding-001", "gemini-embedding-2", "gemini-embedding-2-preview"],
    // ponytail: openrouter routes to any provider, include both OpenAI + Gemini
    openrouter: ["text-embedding-3-small", "text-embedding-3-large", "text-embedding-ada-002", "gemini-embedding-001", "gemini-embedding-2", "gemini-embedding-2-preview"],
    voyage: ["voyage-3", "voyage-3-lite", "voyage-code-3"],
  };

  const PROVIDER_LABELS: Record<string, string> = {
    openai: "OpenAI",
    gemini: "Google Gemini",
    openrouter: "OpenRouter",
    voyage: "Voyage AI",
  };

  useEffect(() => {
    listKnowledgeDocs(shopId).then((d) => { if (Array.isArray(d)) setDocs(d); }).catch(() => {});
    fetchBotSettings(shopId).then((s) => {
      const cfg = s?.aiConfig as any;
      if (cfg?.searchMode) setSearchMode(cfg.searchMode);
      if (cfg?.retrievalMode) setRetrievalMode(cfg.retrievalMode);
      // Read saved embedding config (if set) or fallback to active key
      if (cfg?.embeddingProvider) setActiveProvider(cfg.embeddingProvider);
      if (cfg?.embeddingModel) setActiveModel(cfg.embeddingModel);
      if (cfg?.chunkSize) setChunkSize(String(cfg.chunkSize));
      if (cfg?.chunkOverlap !== undefined) setChunkOverlap(String(cfg.chunkOverlap));
      // Fallback: read from active key
      const keys: any[] = cfg?.keys || [];
      setKeyCount(keys.length);
      if (!cfg?.embeddingProvider) {
        const activeKey = keys.find((k: any) => k.isActive);
        if (activeKey) {
          setActiveProvider(activeKey.provider);
          // ponytail: defaults match each provider's GenerateEmbedding
          const defaultModels: Record<string, string> = {
            openai: "text-embedding-3-small",
            gemini: "gemini-embedding-001",
            openrouter: "text-embedding-3-small",
            voyage: "voyage-3",
          };
          setActiveModel(defaultModels[activeKey.provider] || "gemini-embedding-001");
        }
      }
    }).catch(() => {});
    // Fetch usage from billing API
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    fetch(`${apiBase}/admin/billing/${shopId}/usage`, {
      headers: session?.user?.backendToken ? { Authorization: `Bearer ${session.user.backendToken}` } : {},
    }).then(r => r.json()).then(setUsage).catch(() => {});
  }, []);

  const reload = async () => {
    const d = await listKnowledgeDocs(shopId);
    if (Array.isArray(d)) setDocs(d);
  };

  // ponytail: saves individual aiConfig fields without clobbering existing keys
  const saveConfig = async (key: string, value: any) => {
    setSaving(true);
    try {
      const existing = await fetchBotSettings(shopId);
      const aiConfig = { ...((existing?.aiConfig as any) || {}), [key]: value };
      await updateBotSettings(shopId, { ...existing, aiConfig } as any);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleSearchMode = (mode: string) => {
    // If both currently active, clicking one turns the other off
    // If neither currently active, turn on the clicked one
    // If clicking the already active one, turn it off
    const currentModes = searchMode.split(",").filter(Boolean);
    if (currentModes.includes(mode)) {
      // Remove it
      const next = currentModes.filter(m => m !== mode).join(",");
      setSearchMode(next || "");
      saveConfig("searchMode", next || "");
    } else {
      // Add it
      const next = [...currentModes, mode].sort().join(",");
      setSearchMode(next);
      saveConfig("searchMode", next);
    }
  };

  const isSearchActive = (mode: string) => searchMode.split(",").includes(mode);

  const handleRetrieval = (mode: string) => {
    setRetrievalMode(mode);
    saveConfig("retrievalMode", mode);
  };

  const handleIngest = async () => {
    if (!content.trim()) return;
    setIngesting(true);
    try { await ingestKnowledge(shopId, { title: title || "Untitled", content, source: "manual_text" }); setTitle(""); setContent(""); await reload(); }
    catch (e) { console.error(e); }
    setIngesting(false);
  };

  const handleIngestWeb = async () => {
    if (!webUrl.trim()) return;
    setIngesting(true);
    try { await ingestWebKnowledge(shopId, { url: webUrl, recursive: false }); setWebUrl(""); await reload(); }
    catch (e) { console.error(e); }
    setIngesting(false);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIngesting(true);
    setImportResult(null);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const token = session?.user?.backendToken;
    try {
      if (docType === "products") {
        // Agent: parse → auto-import → report
        const formData = new FormData();
        formData.append("file", file);
        const parseRes = await fetch(`${apiBase}/admin/knowledge/parse?shop_id=${shopId}`, {
          method: "POST", body: formData, headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const parsed = await parseRes.json();
        if (!parsed?.products || parsed.products.length === 0) {
          setImportResult({ type: "error", message: `❌ Không tìm thấy sản phẩm nào trong file.${parsed.errors?.length ? ` (${parsed.errors.length} lỗi)` : ''}`, ok: false });
        } else {
          // First pass: try without overwrite — detect duplicates
          let confirmRes = await confirmProducts(shopId, parsed.products, { overwrite: false });
          const hasDups = confirmRes?.duplicates?.length > 0;
          if (hasDups) {
            const overwrite = window.confirm(
              `⚠️ Phát hiện ${confirmRes.duplicates.length} mã sản phẩm đã tồn tại.\nBấm OK để ghi đè (update).\nBấm Cancel để thêm mới (sản phẩm trùng sẽ tự đổi mã).`
            );
            // Re-import with user's choice
            confirmRes = await confirmProducts(shopId, parsed.products, { overwrite });
          }
          const imported = confirmRes?.inserted ?? 0;
          const updated = confirmRes?.updated ?? 0;
          const failed = confirmRes?.failed ?? 0;
          let msg = imported > 0 || updated > 0 ? `✅ Agent đã xử lý` : `⚠️ `;
          if (imported > 0) msg += ` ${imported} mới`;
          if (updated > 0) msg += `, cập nhật ${updated}`;
          if (failed > 0) msg += `, ${failed} lỗi`;
          msg += ` từ ${file.name}`;
          setImportResult({
            type: imported > 0 || updated > 0 ? "success" : "warning",
            message: msg + ` — <a href="/app/products" class="text-blue-400 underline">Xem trong Products →</a>`,
            ok: imported > 0 || updated > 0,
          });
        }
      } else if (docType === "policies") {
        // Agent: parse CSV → auto-create policies → report
        const text = await file.text();
        const rows = text.split("\n").filter(l => l.trim());
        let imported = 0, failed = 0;
        if (rows.length > 1) {
          const headers = rows[0].split(",").map(h => h.trim().toLowerCase());
          const ti = headers.findIndex(h => /tiêu|title|tên|name/.test(h));
          const ci = headers.findIndex(h => /nội|content|mô|desc/.test(h));
          const tgi = headers.findIndex(h => /tag|từ khóa|keyword|label/.test(h));
          for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(",").map(c => c.trim().replace(/^"|"$/g, ""));
            try {
              await createPolicy(shopId, cols[ti] || `Policy ${i}`, cols[ci] || cols[ti] || "", tgi >= 0 ? cols[tgi]?.split(/[;,|]/).map(t => t.trim()).filter(Boolean) : []);
              imported++;
            } catch { failed++; }
          }
        } else {
          await createPolicy(shopId, file.name, text);
          imported = 1;
        }
        setImportResult({
          type: imported > 0 ? "success" : "error",
          message: `✅ Agent đã import ${imported} chính sách${failed > 0 ? `, ${failed} lỗi` : ''} từ ${file.name}`,
          ok: imported > 0,
        });
      } else {
        const text = await file.text();
        await ingestKnowledge(shopId, { title: file.name, content: text, source: "file_upload" });
        setImportResult({ type: "success", message: `✅ Đã nhập tài liệu: ${file.name}`, ok: true });
      }
      await reload();
    } catch (e: any) {
      setImportResult({ type: "error", message: `❌ Lỗi: ${e.message || 'Không thể xử lý file'}`, ok: false });
    }
    setIngesting(false);
    // Reset file input
    e.target.value = "";
  };

  const filteredRetrieval = RETRIEVAL_STRATEGIES.filter(r => isFree ? r.tier === "free" : true);

  return (
    <div className="space-y-5">
      {/* Upload Card */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Documents & Policies</h3>
            {isFree && <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">Naive RAG</span>}
          </div>
          <a href="/docs/import-guide" target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 border border-blue-500/25 text-xs font-bold text-blue-300 hover:bg-blue-600/25 hover:text-blue-200 transition-all">
            📄 Mẫu file chuẩn
          </a>
        </div>

        <div className="flex gap-1 p-0.5 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
          {(["text", "web", "file"] as const).map((mode) => (
            <button key={mode} onClick={() => setIngestMode(mode)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", ingestMode === mode ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white")}>
              {mode === "text" ? "Text" : mode === "web" ? "Web" : "File"}
            </button>
          ))}
        </div>

        {ingestMode === "text" && (
          <div className="space-y-3">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Title..." className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Paste document content..." rows={5}
              className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 resize-none" />
            <button onClick={handleIngest} disabled={ingesting || !content.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl text-sm font-bold transition-all">
              <Upload className="h-4 w-4" /> {ingesting ? "Processing..." : "Upload"}
            </button>
          </div>
        )}
        {ingestMode === "web" && (
          <div className="flex gap-2">
            <input type="url" value={webUrl} onChange={(e) => setWebUrl(e.target.value)}
              placeholder="https://..." className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50" />
            <button onClick={handleIngestWeb} disabled={ingesting || !webUrl.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl text-sm font-bold">
              <Globe className="h-4 w-4" />
            </button>
          </div>
        )}
        {ingestMode === "file" && (
          <div className="space-y-3">
            {/* Document type selector */}
            <div className="flex gap-1 p-0.5 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
              {(["products", "policies"] as const).map((type) => (
                <button key={type} onClick={() => setDocType(type)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    docType === type ? "bg-emerald-600 text-white" : "text-zinc-500 hover:text-white")}>
                  {type === "products" ? "📦 Sản phẩm" : "📋 Chính sách"}
                </button>
              ))}
            </div>
            <label className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:border-blue-500/30 transition-colors">
              <FileText className="h-8 w-8 text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-500">{docType === "products" ? "Upload CSV/JSON sản phẩm" : "Upload CSV/TXT chính sách"}</p>
              <input type="file" accept={docType === "products" ? ".csv,.json,.xlsx,.xls" : ".csv,.json,.txt"} className="hidden" onChange={handleFile} />
            </label>
            {ingesting && <p className="text-xs text-blue-400 animate-pulse text-center">⏳ Agent đang xử lý...</p>}
            {importResult && (
              <div className={cn("text-xs px-4 py-2.5 rounded-xl border", importResult.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : importResult.type === "warning" ? "bg-amber-500/10 border-amber-500/20 text-amber-300" : "bg-red-500/10 border-red-500/20 text-red-300")}>
                <span dangerouslySetInnerHTML={{ __html: importResult.message }} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document List */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Documents ({docs.length})</h4>
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

      {/* ── Advanced Config ── */}
      <div className="border-t border-white/[0.04] pt-3">
        <button onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors w-full py-2">
          <Settings className="h-3.5 w-3.5" />
          <span className="font-medium">Advanced Config</span>
          <ChevronDown className={cn("h-3 w-3 ml-auto transition-transform", showAdvanced && "rotate-180")} />
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pt-4 space-y-5">
                
                {/* 2. Storage Engine — UI framework cho backend integration */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Database className="h-4 w-4" /> Storage Engine
                  </h5>
                  <div className="grid grid-cols-3 gap-3">
                    {STORAGE_ENGINES.map((eng) => (
                      <div key={eng.id} className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border text-sm transition-all",
                        eng.status === "active" ? "bg-green-600/10 border-green-500/20 text-green-400" :
                        eng.status === "available" ? "bg-white/[0.03] border-white/[0.06] text-zinc-500" :
                        "bg-white/[0.01] border-white/[0.04] text-zinc-700"
                      )}>
                        <eng.icon className="h-5 w-5" />
                        <p className="font-semibold">{eng.name}</p>
                        <p className="text-[10px] text-center opacity-70">{eng.desc}</p>
                        <span className={cn("text-[9px] font-bold mt-1",
                          eng.status === "active" ? "text-green-500" : eng.status === "available" ? "text-blue-400" : "text-zinc-600")}>
                          {eng.status === "active" ? "✅ Active" : eng.status === "available" ? "🔌 Available" : "📅 Planned"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1. Search Strategy */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Search className="h-4 w-4" /> Search Strategy
                  </h5>
                  <div className="flex gap-3">
                    {SEARCH_OPTIONS.map((opt) => {
                      const active = isSearchActive(opt.id);
                      return (
                        <button key={opt.id} onClick={() => handleSearchMode(opt.id)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all flex-1",
                            active
                              ? "bg-blue-600/20 border-blue-500/40 text-blue-300 shadow-sm shadow-blue-500/10"
                              : "bg-white/[0.03] border-white/[0.06] text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                          )}>
                          <opt.icon className="h-5 w-5" />
                          <div className="text-left">
                            <p className="font-semibold">{opt.label}</p>
                            <p className="text-[10px] opacity-60">{opt.desc}</p>
                          </div>
                          {active && <span className="ml-auto text-lg">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 bg-blue-500/5 border border-blue-500/10 rounded-lg px-3 py-2">
                    <Layers className="h-3.5 w-3.5 text-blue-400" />
                    {searchMode.split(",").filter(Boolean).length === 0 && <span>Select at least one strategy. Both = Hybrid.</span>}
                    {searchMode.split(",").filter(Boolean).length === 1 && <span>Currently using <strong className="text-zinc-300">{searchMode}</strong> only.</span>}
                    {searchMode.split(",").filter(Boolean).length === 2 && <span>✅ <strong className="text-zinc-300">Both</strong> — MongoDB + Qdrant = Hybrid Search with dedup &amp; reranking.</span>}
                  </div>
                </div>



                {/* 3. Retrieval Strategy */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" /> Retrieval Strategy
                    <span className="text-[9px] font-normal text-zinc-600">— Beta MVP: all unlocked</span>
                  </h5>
                  <div className="grid grid-cols-2 gap-3">
                    {RETRIEVAL_STRATEGIES.map((strat) => {
                      const active = retrievalMode === strat.id;
                      return (
                        <button key={strat.id} onClick={() => handleRetrieval(strat.id)}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-xl border text-sm transition-all",
                            active
                              ? "bg-purple-600/20 border-purple-500/40 text-purple-300 shadow-sm shadow-purple-500/10"
                              : "bg-white/[0.03] border-white/[0.06] text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                          )}>
                          <div className={`p-1.5 rounded-lg ${active ? "bg-purple-600/20" : "bg-white/5"}`}>
                            <strat.icon className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold">{strat.name}</p>
                            <p className="text-[10px] opacity-60">{strat.desc}</p>
                          </div>
                          <span className={cn("text-[9px] shrink-0 ml-auto", active ? "text-purple-400 font-bold" : "text-zinc-700")}>
                            {strat.status === "active" ? (active ? "✅" : "Available") : strat.status === "available" ? "🔌" : "📅"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-[11px] text-zinc-600 bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2">
                    <strong>After Beta:</strong> Free = Basic RAG only. Starter+ = GraphRAG, LightRAG. Pro+ = Advanced RAG.
                  </div>
                </div>

                {/* 4. Embedding Config — editable provider/model/chunk */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Cpu className="h-3 w-3" /> Embedding
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Provider select */}
                    <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                      <span className="text-zinc-600">Provider</span>
                      <select value={activeProvider} onChange={(e) => {
                        const p = e.target.value;
                        setActiveProvider(p);
                        const models = MODEL_MAP[p] || ["gemini-embedding-001"];
                        setActiveModel(models[0]);
                        setAvailableModels(models);
                        saveConfig("embeddingProvider", p);
                        saveConfig("embeddingModel", models[0]);
                      }}
                        className="w-full bg-transparent text-zinc-300 font-medium outline-none mt-0.5 cursor-pointer">
                        {Object.entries(PROVIDER_LABELS).map(([val, label]) => (
                          <option key={val} value={val} className="bg-zinc-900">{label}</option>
                        ))}
                      </select>
                    </div>
                    {/* Model select */}
                    <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                      <span className="text-zinc-600">Model</span>
                      <select value={activeModel} onChange={(e) => {
                        setActiveModel(e.target.value);
                        saveConfig("embeddingModel", e.target.value);
                      }}
                        className="w-full bg-transparent text-zinc-300 font-medium outline-none mt-0.5 cursor-pointer">
                        {(availableModels.length > 0 ? availableModels : MODEL_MAP[activeProvider] || []).map((m) => (
                          <option key={m} value={m} className="bg-zinc-900">{m}</option>
                        ))}
                      </select>
                    </div>
                    {/* Chunk Size */}
                    <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                      <span className="text-zinc-600">Chunk Size</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <input type="number" value={chunkSize} onChange={(e) => {
                          setChunkSize(e.target.value);
                          saveConfig("chunkSize", e.target.value);
                        }}
                          className="w-full bg-transparent text-zinc-300 font-medium outline-none" />
                        <span className="text-zinc-600 shrink-0">chars</span>
                      </div>
                    </div>
                    {/* Chunk Overlap */}
                    <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                      <span className="text-zinc-600">Chunk Overlap</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <input type="number" value={chunkOverlap} onChange={(e) => {
                          setChunkOverlap(e.target.value);
                          saveConfig("chunkOverlap", e.target.value);
                        }}
                          className="w-full bg-transparent text-zinc-300 font-medium outline-none" />
                        <span className="text-zinc-600 shrink-0">chars</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-zinc-600 bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2">
                    Active key: <strong className="text-zinc-400">{keyCount}</strong> configured ·{" "}
                    <a href="/app/settings" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                      Manage keys →
                    </a>
                  </div>
                </div>

                {/* 5. Usage Stats — reads from billing API */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BarChart3 className="h-3 w-3" /> Today's Usage
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                      <span className="text-zinc-600">DB Queries</span>
                      <p className="text-zinc-300 font-medium">
                        {(usage?.dbQueries ?? usage?.queryCount ?? usage?.queries) ?? 0} / {isFree ? "100" : "∞"}
                        {isFree && <span className="text-[9px] text-amber-500 ml-1">(free limit)</span>}
                      </p>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                      <span className="text-zinc-600">Vector Searches</span>
                      <p className="text-zinc-300 font-medium">
                        {(usage?.vectorSearches ?? usage?.vectorCount ?? 0)} / ∞
                      </p>
                    </div>
                  </div>
                  {!usage && <p className="text-[10px] text-zinc-600 mt-2">Loading usage data...</p>}
                  {saving && <p className="text-[10px] text-blue-400 mt-2 animate-pulse">Saving config...</p>}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

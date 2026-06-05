"use client";
import React, { useState, useEffect } from "react";
import { BookOpen, Upload, Globe, Database, Trash2, Search, FileUp, Layers, Server, Cpu, Zap, GitBranch } from "lucide-react";
import { Card, Field, SectionHeader, SHOP_ID } from "./shared";
import { ingestKnowledge, ingestWebKnowledge, listKnowledgeDocs, deleteKnowledgeDoc, updateKnowledgeDoc, fetchBotSettings, type BotSetting } from "@/lib/api";
import { cn } from "@/lib/utils";

// ============================================================
// RETRIEVAL STRATEGY ADAPTERS (Not vendor-specific!)
// ============================================================
const RETRIEVAL_ADAPTERS = [
  {
    category: "Storage Engine",
    adapters: [
      { id: "vector_db", name: "Vector DB", desc: "Embedding → cosine/dot similarity search (Qdrant, Pinecone, Milvus...)", status: "active", icon: Database },
      { id: "graph_db", name: "Graph DB", desc: "Entity-Relationship graph cho context phức tạp (Neo4j, ArangoDB...)", status: "available", icon: GitBranch },
      { id: "hybrid", name: "Hybrid Store", desc: "Kết hợp Vector + Graph cho multi-hop reasoning", status: "planned", icon: Layers },
    ],
  },
  {
    category: "Retrieval Strategy",
    adapters: [
      { id: "basic_rag", name: "Basic RAG", desc: "Query → Embed → Top-K vector search → Inject context", status: "active", icon: Search },
      { id: "graph_rag", name: "GraphRAG", desc: "Multi-hop reasoning qua entity graph — hiểu quan hệ sản phẩm phức tạp", status: "available", icon: GitBranch },
      { id: "light_rag", name: "LightRAG", desc: "Lightweight RAG tối ưu latency — graph + vector hybrid nhanh", status: "available", icon: Zap },
      { id: "advanced_rag", name: "Advanced RAG", desc: "Query rewrite + HyDE + reranking + multi-step retrieval", status: "planned", icon: Cpu },
    ],
  },
];

export function KnowledgeSection() {
  const [docs, setDocs] = useState<any[]>([]);
  const [botSettings, setBotSettings] = useState<BotSetting | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [ingesting, setIngesting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [ingestMode, setIngestMode] = useState<"text" | "web" | "file">("text");
  
  const [embedProvider, setEmbedProvider] = useState("gemini");
  const [embedModel, setEmbedModel] = useState("text-embedding-005");

  useEffect(() => { 
    listKnowledgeDocs(SHOP_ID).then((d) => { if (Array.isArray(d)) setDocs(d); }).catch(() => {}); 
    fetchBotSettings(SHOP_ID).then((s) => {
      setBotSettings(s);
      // Pick first active provider if default is not active
      const keys = s?.aiConfig?.keys || [];
      const activeGemini = keys.find(k => k.provider === "gemini" && k.isActive);
      const activeOpenAI = keys.find(k => k.provider === "openai" && k.isActive);
      
      if (activeGemini) {
        setEmbedProvider("gemini");
        setEmbedModel("text-embedding-005");
      } else if (activeOpenAI) {
        setEmbedProvider("openai");
        setEmbedModel("text-embedding-3-large");
      }
    }).catch(console.error);
  }, []);
  const reload = async () => { 
    const d = await listKnowledgeDocs(SHOP_ID); 
    if (Array.isArray(d)) setDocs(d); 
    const s = await fetchBotSettings(SHOP_ID);
    setBotSettings(s);
  };

  const handleIngestText = async () => {
    if (!content.trim()) return; setIngesting(true);
    try { await ingestKnowledge(SHOP_ID, { title: title || "Untitled", content, source: "manual_text", config: { provider: embedProvider, model: embedModel } }); setTitle(""); setContent(""); await reload(); } catch (e) { console.error(e); } finally { setIngesting(false); }
  };

  const handleIngestWeb = async () => {
    if (!webUrl.trim()) return; setIngesting(true);
    try { await ingestWebKnowledge(SHOP_ID, { url: webUrl, recursive: false, config: { provider: embedProvider, model: embedModel } }); setWebUrl(""); await reload(); } catch (e) { console.error(e); } finally { setIngesting(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files || files.length === 0) return;
    setIngesting(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        let text = "";

        if (["txt", "md", "csv", "json", "html"].includes(ext)) {
          text = await file.text();
        } else if (["docx", "pdf", "xlsx", "xls"].includes(ext)) {
          // Binary files: read as base64, backend sẽ parse (future)
          // Hiện tại: extract raw text nếu có thể, hoặc gửi warning
          try {
            text = await file.text(); // Fallback: raw text extraction
          } catch {
            text = `[File binary: ${file.name} — ${(file.size / 1024).toFixed(1)}KB. Cần backend parser cho định dạng ${ext}.]`;
          }
        } else {
          text = `[Unsupported format: ${ext}]`;
        }

        if (text.trim()) {
          await ingestKnowledge(SHOP_ID, { title: file.name, content: text, source: "file_upload", config: { provider: embedProvider, model: embedModel } });
        }
      }
      await reload();
    } catch (err) { console.error(err); }
    finally { setIngesting(false); if (e.target) e.target.value = ""; }
  };



  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);

  const startEdit = () => {
    if (!selectedDoc) return;
    setEditTitle(selectedDoc.title);
    setEditContent(selectedDoc.content);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!selectedDoc) return;
    setLoading(true);
    try {
      await updateKnowledgeDoc(SHOP_ID, selectedDoc.id, {
        title: editTitle,
        content: editContent,
        source: selectedDoc.source
      });
      setIsEditing(false);
      await reload();
      setSelectedDoc({ ...selectedDoc, title: editTitle, content: editContent });
    } catch (e) {
      console.error(e);
      alert("Lỗi khi cập nhật tài liệu");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (docId: string) => {
    if (!window.confirm("Sếp chắc chắn muốn xóa tài liệu này? Điều này sẽ xóa sạch các vector liên quan.")) return;
    setLoading(true);
    try {
      await deleteKnowledgeDoc(SHOP_ID, docId);
      // Optimistic UI: Xoá khỏi local state ngay lập tức
      setDocs(prev => prev.filter(d => d.id !== docId));
      if (selectedDoc?.id === docId) {
        setSelectedDoc(null);
      }
      // Vẫn reload để đảm bảo đồng bộ hoàn hảo với server
      await reload();
    } catch (e) {
      console.error(e);
      alert("Lỗi khi xóa tài liệu");
      // Nếu lỗi thật sự, reload lại để hiện lại data cũ
      await reload();
    } finally {
      setLoading(false);
    }
  };

  const isProviderActive = (provider: string) => {
    return botSettings?.aiConfig?.keys?.some(k => k.provider === provider && k.isActive) || false;
  };

  return (
    <div className="space-y-6 pb-8">
      <SectionHeader title="Knowledge Ingestion" subtitle="Nạp tài liệu sản phẩm/dịch vụ — AI sẽ dùng làm ngữ cảnh để tư vấn chính xác" icon={BookOpen} />
      
      {/* Provider Status Indicator */}
      <div className="flex gap-2 mb-2">
        {["openai", "gemini", "voyage", "openrouter"].map(p => {
          const active = isProviderActive(p);
          return (
            <div key={p} className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-[10px] font-bold uppercase tracking-wider",
              active ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-neutral-800/50 border-white/5 text-neutral-600 grayscale"
            )}>
              <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", active ? "bg-green-500" : "bg-neutral-700")} />
              {p} {active ? "Active" : "No Key"}
            </div>
          );
        })}
      </div>

      {/* Retrieval Strategy Adapters */}
      {RETRIEVAL_ADAPTERS.map((group) => (
        <Card key={group.category} title={group.category} icon={Server}>
          <div className={cn("grid gap-3", group.adapters.length > 3 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 lg:grid-cols-3")}>
            {group.adapters.map((a) => (
              <div key={a.id} className={cn(
                "p-3 rounded-xl border transition-all",
                a.status === "active" ? "bg-green-500/5 border-green-500/20" :
                a.status === "available" ? "bg-blue-500/[0.03] border-blue-500/15" :
                "bg-white/[0.01] border-white/5 opacity-60"
              )}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <a.icon className={cn("h-3.5 w-3.5", a.status === "active" ? "text-green-500" : a.status === "available" ? "text-blue-400" : "text-neutral-600")} />
                    <span className={cn("text-xs font-bold", a.status === "active" ? "text-green-400" : a.status === "available" ? "text-blue-400" : "text-neutral-600")}>{a.name}</span>
                  </div>
                  <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full font-bold",
                    a.status === "active" ? "bg-green-500/20 text-green-400" :
                    a.status === "available" ? "bg-blue-500/10 text-blue-400" :
                    "bg-neutral-800 text-neutral-600"
                  )}>{a.status === "active" ? "✅ đang dùng" : a.status === "available" ? "🔌 sẵn sàng" : "🔜 planned"}</span>
                </div>
                <p className="text-[10px] text-neutral-600 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Ingest Mode Tabs */}
      <Card title="Nạp dữ liệu mới" icon={Upload} action={
        <div className="flex gap-1">
          {([["text", "Text", Upload], ["web", "Web", Globe], ["file", "File", FileUp]] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setIngestMode(id)} className={cn("flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold", ingestMode === id ? "bg-white/10 text-white" : "text-neutral-600 hover:text-neutral-400")}>
              <Icon className="h-3 w-3" /> {label}
            </button>
          ))}
        </div>
      }>
        <div className="flex flex-col sm:flex-row gap-4 mb-4 pb-4 border-b border-white/5">
          <div className="flex-1">
            <label className="text-xs text-neutral-400 font-bold mb-1.5 block">Embedding Provider</label>
            <select
              value={embedProvider}
              onChange={(e) => {
                const val = e.target.value;
                setEmbedProvider(val);
                if (val === "openai") setEmbedModel("text-embedding-3-large");
                else if (val === "gemini") setEmbedModel("text-embedding-005");
                else if (val === "voyage") setEmbedModel("voyage-4-large");
                else if (val === "openrouter") setEmbedModel("openai/text-embedding-3-small");
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-medium text-white appearance-none focus:outline-none focus:border-amber-500/50 transition-colors"
            >
              <option value="openai" className="bg-neutral-900" disabled={!isProviderActive("openai")}>OpenAI (GPT-5 Era) {!isProviderActive("openai") && "🔒"}</option>
              <option value="gemini" className="bg-neutral-900" disabled={!isProviderActive("gemini")}>Google Gemini 3.1 {!isProviderActive("gemini") && "🔒"}</option>
              <option value="voyage" className="bg-neutral-900" disabled={!isProviderActive("voyage")}>Voyage AI (v4) {!isProviderActive("voyage") && "🔒"}</option>
              <option value="openrouter" className="bg-neutral-900" disabled={!isProviderActive("openrouter")}>OpenRouter {!isProviderActive("openrouter") && "🔒"}</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-neutral-400 font-bold mb-1.5 block">Model Dimension Strategy</label>
            <select
              value={embedModel}
              onChange={(e) => setEmbedModel(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-medium text-white appearance-none focus:outline-none focus:border-amber-500/50 transition-colors"
            >
              {embedProvider === "openai" && (
                <>
                  <option value="text-embedding-3-large" className="bg-neutral-900">text-embedding-3-large (SOTA)</option>
                  <option value="text-embedding-3-small" className="bg-neutral-900">text-embedding-3-small (Fast)</option>
                </>
              )}
              {embedProvider === "gemini" && (
                <>
                  <option value="text-embedding-005" className="bg-neutral-900">text-embedding-005 (Text Only - Stable)</option>
                  <option value="gemini-embedding-2-preview" className="bg-neutral-900">gemini-embedding-2 (Multimodal - Latest 2026)</option>
                  <option value="gemini-embedding-001" className="bg-neutral-900">gemini-embedding-001 (Legacy)</option>
                </>
              )}
              {embedProvider === "voyage" && (
                <>
                  <option value="voyage-4-large" className="bg-neutral-900">voyage-4-large (Mixture-of-Experts)</option>
                  <option value="voyage-4" className="bg-neutral-900">voyage-4 (Professional)</option>
                  <option value="voyage-4-lite" className="bg-neutral-900">voyage-4-lite (Cost Efficient)</option>
                </>
              )}
              {embedProvider === "openrouter" && (
                <>
                  <option value="openai/text-embedding-3-large" className="bg-neutral-900">text-embedding-3-large</option>
                  <option value="openai/text-embedding-3-small" className="bg-neutral-900">text-embedding-3-small</option>
                </>
              )}
            </select>
          </div>
        </div>

        {ingestMode === "text" && (<>
          <Field label="Tiêu đề" value={title} onChange={setTitle} placeholder="VD: Bảng giá 2026" />
          <Field label="Nội dung" value={content} onChange={setContent} placeholder="Paste nội dung tài liệu..." multiline rows={5} />
          <button onClick={handleIngestText} disabled={ingesting || !content.trim()} className="w-full py-3 bg-amber-600 hover:bg-amber-500 rounded-xl text-sm font-bold disabled:opacity-50 transition-all">{ingesting ? "Đang nạp..." : "⬆️ Nạp Text"}</button>
        </>)}
        {ingestMode === "web" && (<>
          <Field label="URL" value={webUrl} onChange={setWebUrl} placeholder="https://shop.vn/san-pham..." />
          <button onClick={handleIngestWeb} disabled={ingesting || !webUrl.trim()} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-bold disabled:opacity-50 transition-all">{ingesting ? "Đang cào..." : "🌐 Cào & nạp"}</button>
        </>)}
        {ingestMode === "file" && (<>
          <label className="flex flex-col items-center justify-center w-full h-36 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-white/20 transition-colors">
            <FileUp className="h-8 w-8 text-neutral-600 mb-2" />
            <span className="text-xs text-neutral-500">Kéo thả hoặc bấm để chọn file</span>
            <span className="text-[10px] text-neutral-700 mt-1">.txt, .csv, .json, .md, .html, .docx, .pdf, .xlsx</span>
            <input type="file" className="hidden" accept=".txt,.csv,.json,.md,.html,.docx,.pdf,.xlsx,.xls" onChange={handleFileUpload} multiple />
          </label>
          {ingesting && <p className="text-xs text-amber-500 text-center animate-pulse mt-2">Đang xử lý file...</p>}
        </>)}
      </Card>

      {/* Document List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <Card title={`Tài liệu (${docs.length})`} icon={Database}>
            {docs.length > 0 ? (
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                {docs.map((doc: any) => (
                  <div key={doc.id} className="group relative flex items-center">
                    <button 
                      onClick={() => { setSelectedDoc(doc); setIsEditing(false); }} 
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl text-left transition-all border", 
                        selectedDoc?.id === doc.id 
                          ? "bg-blue-500/10 border-blue-500/30 pr-12" 
                          : "bg-white/[0.01] border-white/5 hover:border-white/10 pr-12"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <BookOpen className="h-4 w-4 text-amber-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{doc.title || "Untitled"}</p>
                          <p className="text-[10px] text-neutral-600 truncate">{doc.source} • {doc.chunkCount || 0} chunks</p>
                        </div>
                      </div>
                      <span className={cn(
                        "text-[8px] px-1.5 py-0.5 rounded font-bold shrink-0", 
                        doc.status === "INDEXED" ? "bg-green-500/20 text-green-400" : 
                        doc.status === "FAILED" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      )}>{doc.status || "PENDING"}</span>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                      className="absolute right-2 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 text-neutral-600 hover:text-red-400 rounded-lg transition-all"
                      title="Xóa tài liệu"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-neutral-700 text-center py-8">Chưa có tài liệu. Nạp ở trên hoặc dùng file mock sẵn.</p>}
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card title="Phần mềm & Chi tiết" icon={Layers}>
            {selectedDoc ? (
              <div className="space-y-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <Field label="Tiêu đề" value={editTitle} onChange={setEditTitle} />
                    <Field label="Nội dung" value={editContent} onChange={setEditContent} multiline rows={8} />
                    <div className="flex gap-2">
                      <button onClick={cancelEdit} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10">Hủy</button>
                      <button onClick={handleUpdate} disabled={loading} className="flex-1 py-3 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? "..." : "Lưu & Re-index"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><span className="text-[10px] text-neutral-600 block mb-0.5">Tiêu đề</span><p className="text-xs font-bold truncate">{selectedDoc.title}</p></div>
                      <div><span className="text-[10px] text-neutral-600 block mb-0.5">Trạng thái</span><span className="text-[9px] px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded font-bold">{selectedDoc.status}</span></div>
                    </div>
                    <div><span className="text-[10px] text-neutral-600 block mb-0.5">Context Size</span><p className="text-xs">{selectedDoc.chunkCount || 0} vectors ({((selectedDoc.chunkCount || 0) * 500 / 1000).toFixed(1)}k chars)</p></div>
                    <div><span className="text-[10px] text-neutral-600 block mb-0.5">Preview nội dung</span><div className="text-[10px] text-neutral-400 leading-relaxed max-h-[160px] overflow-y-auto p-3 bg-black/40 border border-white/5 rounded-xl font-mono scrollbar-thin scrollbar-thumb-white/10">{selectedDoc.content || "N/A"}</div></div>
                    
                    <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                      <button onClick={startEdit} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 flex items-center justify-center gap-2">✏️ Chỉnh sửa nội dung</button>
                      <button onClick={() => handleDelete(selectedDoc.id)} disabled={loading} className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500/20 flex items-center justify-center gap-2">
                        {loading ? "Đang xóa..." : "🗑️ Xóa tài liệu vĩnh viễn"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : <p className="text-[10px] text-neutral-700 text-center py-12 flex flex-col items-center gap-3"><BookOpen className="h-8 w-8 opacity-10" />Chọn tài liệu từ danh sách bên trái</p>}
          </Card>
        </div>
      </div>

    </div>
  );
}

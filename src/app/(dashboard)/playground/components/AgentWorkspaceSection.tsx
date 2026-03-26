"use client";
import React, { useState, useEffect } from "react";
import { Users, Target, TrendingUp, Clock, Shield, Bot, BrainCircuit, AlertTriangle, ChevronRight, ArrowUpRight, Phone, Tag, MessageSquare } from "lucide-react";
import { Card, SectionHeader, SHOP_ID, DEFAULT_STAGES } from "./shared";
import { fetchInsights, fetchLeads, fetchThreads, fetchMessages, sendReply, fetchBotSettings, type BotSetting } from "@/lib/api";
import { cn } from "@/lib/utils";

// MOCK DATA REMOVED - Using live data from API

export function AgentWorkspaceSection() {
  const [insights, setInsights] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [botSettings, setBotSettings] = useState<BotSetting | null>(null);
  const [chatProvider, setChatProvider] = useState("gemini");
  const [chatModel, setChatModel] = useState("gemini-flash-lite-latest");

  useEffect(() => {
    fetchInsights(SHOP_ID).then((d) => { if (Array.isArray(d)) setInsights(d); }).catch(() => {});
    fetchLeads(SHOP_ID).then((d) => { if (Array.isArray(d)) setLeads(d); }).catch(() => {});
    fetchThreads(SHOP_ID).then((d) => { if (Array.isArray(d)) setConversations(d); }).catch(() => {});
    fetchBotSettings(SHOP_ID).then(setBotSettings).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedConv) {
      setIsLoading(true);
      fetchMessages(selectedConv.id)
        .then((msgs) => {
          if (Array.isArray(msgs)) setSelectedMessages(msgs);
        })
        .finally(() => setIsLoading(false));
    } else {
      setSelectedMessages([]);
    }
  }, [selectedConv]);

  const escalatedCount = conversations.filter((c) => c.status === "HUMAN_TAKEOVER" || c.needsHuman).length;
  const stats = [
    { label: "Active Chats", value: String(conversations.length), icon: MessageSquare, color: "text-blue-500" },
    { label: "Needs Human", value: String(escalatedCount), icon: AlertTriangle, color: escalatedCount > 0 ? "text-red-500" : "text-green-500" },
    { label: "Total Leads", value: String(leads.length), icon: Target, color: "text-green-500" },
    { label: "Profiles", value: String(insights.length), icon: Users, color: "text-purple-500" },
  ];

  const isWorkspaceProviderActive = (provider: string) => {
    return botSettings?.aiConfig?.keys?.some(k => k.provider === provider && k.isActive) || false;
  };

  const getPlatformStyle = (p: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      facebook: { bg: "bg-blue-500/10", text: "text-blue-400", label: "FB" },
      tiktok: { bg: "bg-pink-500/10", text: "text-pink-400", label: "TT" },
      shopee: { bg: "bg-orange-500/10", text: "text-orange-400", label: "SP" },
      web: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Web" },
    };
    return map[p] || map.web;
  };

  const getSentimentStyle = (s: string) => {
    if (s === "positive") return { bg: "bg-green-500/10", text: "text-green-400", label: "😊 Tích cực" };
    if (s === "negative") return { bg: "bg-red-500/10", text: "text-red-400", label: "😤 Tiêu cực" };
    return { bg: "bg-neutral-500/10", text: "text-neutral-400", label: "😐 Trung tính" };
  };

  // Find matching profile from DB
  const matchedProfile = selectedConv ? insights.find((i: any) => i.externalUserId === selectedConv.externalUserId || i.customerName === selectedConv.customerName) : null;

  const handleAgentSend = async () => {
    if (!chatInput.trim() || !selectedConv) return;
    try {
      await sendReply(selectedConv.id, chatInput);
      const newMsg = { role: "agent", content: chatInput, createdAt: new Date().toISOString() };
      setSelectedMessages((p) => [...p, newMsg]);
      setChatInput("");
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      <SectionHeader title="Agent Workspace — Customer Profiling & Live Chat" subtitle="Trung tâm điều hành: Theo dõi AI, phân biệt hội thoại và trực tiếp chat tiếp quản khách hàng" icon={Users} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className={cn("p-4 bg-white/[0.02] border rounded-2xl", s.label === "Needs Human" && escalatedCount > 0 ? "border-red-500/30 bg-red-500/5" : "border-white/10")}>
            <s.icon className={cn("h-4 w-4 mb-2", s.color)} />
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-[10px] text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 h-[calc(100vh-380px)] min-h-[500px]">
        {/* LEFT: Conversation List */}
        <div className="w-80 flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shrink-0">
          <div className="px-3 py-2.5 border-b border-white/5">
            <span className="text-xs font-bold text-neutral-400">Tất cả cuộc chat ({conversations.length})</span>
            {escalatedCount > 0 && <span className="ml-2 text-[9px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full font-bold animate-pulse">🚨 {escalatedCount} cần tiếp quản</span>}
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => {
              const ps = getPlatformStyle(c.platform);
              return (
                <button key={c.id} onClick={() => setSelectedConv(c)} className={cn(
                  "w-full flex items-start gap-3 px-3 py-3 text-left border-b border-white/[0.03] transition-all",
                  c.needsHuman ? "bg-red-500/[0.03]" : "",
                  selectedConv?.id === c.id ? "bg-blue-500/5 border-l-2 border-l-blue-500" : "hover:bg-white/[0.02]"
                )}>
                  <div className="relative shrink-0">
                    <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold", c.needsHuman ? "bg-red-500/20 text-red-400" : "bg-white/5 text-neutral-400")}>
                      {c.customerName.charAt(0)}
                    </div>
                    {c.needsHuman && <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold truncate">{c.customerName}</span>
                      <span className={cn("text-[8px] px-1 py-0.5 rounded-full font-bold", ps.bg, ps.text)}>{ps.label}</span>
                    </div>
                    <p className="text-[10px] text-neutral-600 truncate mt-0.5">{c.lastMsg}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full font-bold", c.aiStatus === "escalated" ? "bg-red-500/20 text-red-400" : "bg-green-500/10 text-green-400")}>
                        {c.aiStatus === "escalated" ? "🚨 Escalated" : "🤖 Active AI"}
                      </span>
                      <span className="text-[8px] text-neutral-700">Stage {c.stage}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MIDDLE: Hybrid Chat Panel (Take over) */}
        <div className="flex-1 flex flex-col bg-black/40 border border-white/5 rounded-2xl overflow-hidden min-w-0">
          {selectedConv ? (
            <>
              <header className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", selectedConv.needsHuman ? "bg-red-500 animate-pulse" : "bg-green-500")} />
                  <span className="text-xs font-bold">{selectedConv.customerName}</span>
                  <span className={cn("text-[10px] lowercase text-neutral-500")}>• {selectedConv.aiStatus === 'escalated' ? 'Waiting for human' : 'AI Handling'}</span>
                </div>
                {selectedConv.needsHuman && (
                  <span className="text-[8px] px-2 py-1 bg-red-500/20 text-red-400 rounded-lg font-bold">🚨 URGENT</span>
                )}
              </header>
              <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
                {selectedMessages.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col", msg.role === "user" ? "items-start" : "items-end")}>
                    <div className={cn(
                      "group relative px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed max-w-[85%]",
                      msg.role === "user" ? "bg-white/5 border border-white/10 rounded-tl-none text-neutral-200" :
                      msg.role === "assistant" ? "bg-blue-600/10 border border-blue-500/20 text-blue-100 rounded-tr-none" :
                      msg.role === "agent" ? "bg-purple-600 border border-purple-400/30 text-white rounded-tr-none shadow-lg shadow-purple-500/10" :
                      "bg-red-500/10 border border-red-500/20 text-red-400 self-center rounded-lg text-center font-bold"
                    )}>
                      {/* Role Labels (Internal only) */}
                      {msg.role === "assistant" && <span className="absolute -top-4 right-0 text-[8px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1"><Bot className="h-2 w-2" /> AI Bot</span>}
                      {msg.role === "agent" && <span className="absolute -top-4 right-0 text-[8px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1"><Users className="h-2 w-2" /> Bạn (Nhân viên)</span>}
                      
                      {msg.content}
                      
                      {/* AI Thought Tooltip (Only for Assistant) */}
                      {msg.role === "assistant" && msg.thought && (
                        <div className="mt-1.5 pt-1.5 border-t border-blue-500/20 text-[9px] text-blue-400/70 italic">
                          🧠 AI: {msg.thought}
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] text-neutral-700 mt-1 px-1">
                      {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                <div className="relative">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAgentSend()}
                    placeholder="Nhập câu trả lời để thay thế AI tiếp quản khách hàng..." 
                    className="w-full bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3 pr-12 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder:text-neutral-700"
                  />
                  <button 
                    onClick={handleAgentSend}
                    disabled={!chatInput.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 bg-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-500 disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20"
                  >
                    <ArrowUpRight className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-neutral-800 opacity-40">
              <MessageSquare className="h-12 w-12 mb-4" />
              <p className="text-sm font-bold">Agent Intervention Chat</p>
              <p className="text-xs">Chọn hội thoại để xem & tiếp quản</p>
            </div>
          )}
        </div>

        {/* RIGHT: Customer Intelligence */}
        <div className="w-80 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          <Card title="AI Config (Assistance)" icon={BrainCircuit} compact>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-neutral-500 font-bold mb-1 block uppercase tracking-wider">Provider</label>
                <select 
                  value={chatProvider} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setChatProvider(val);
                    if (val === "openai") setChatModel("o4-mini");
                    else setChatModel("gemini-flash-lite-latest");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-medium text-white appearance-none focus:outline-none focus:border-blue-500/50"
                >
                  <option value="openai" className="bg-neutral-900" disabled={!isWorkspaceProviderActive("openai")}>OpenAI ( GPT-5 Era)</option>
                  <option value="gemini" className="bg-neutral-900" disabled={!isWorkspaceProviderActive("gemini")}>Google Gemini 3.1</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-neutral-500 font-bold mb-1 block uppercase tracking-wider">Active Model</label>
                <select 
                  value={chatModel} 
                  onChange={(e) => setChatModel(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-medium text-white appearance-none focus:outline-none focus:border-blue-500/50"
                >
                  {chatProvider === "openai" ? (
                    <>
                      <option value="o4-mini" className="bg-neutral-900">o4-mini (Fast & Cheapest)</option>
                      <option value="gpt-5.4-thinking" className="bg-neutral-900">gpt-5.4-thinking (Next-Gen)</option>
                      <option value="gpt-5.4-pro" className="bg-neutral-900">gpt-5.4-pro</option>
                      <option value="o3" className="bg-neutral-900">o3 (Reasoning)</option>
                    </>
                  ) : (
                    <>
                      <option value="gemini-flash-lite-latest" className="bg-neutral-900">gemini-flash-lite (Cheapest)</option>
                      <option value="gemini-3.1-flash-lite-preview" className="bg-neutral-900">gemini-3.1-flash-lite</option>
                      <option value="gemini-3.1-pro-preview" className="bg-neutral-900">gemini-3.1-pro (SOTA Reasoning)</option>
                      <option value="gemini-3.1-flash-image-preview" className="bg-neutral-900">gemini-3.1-flash-image</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </Card>

          {selectedConv ? (
            <>
              {/* Analysis Cards */}
              <div className={cn("p-5 rounded-2xl border", selectedConv.status === "HUMAN_TAKEOVER" || selectedConv.needsHuman ? "bg-red-500/5 border-red-500/20" : "bg-white/[0.02] border-white/10")}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0", (selectedConv.status === "HUMAN_TAKEOVER" || selectedConv.needsHuman) ? "bg-red-500/20 text-red-400" : "bg-blue-500/10 text-blue-400")}>
                      {(selectedConv.customerName || "U").charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold truncate">{selectedConv.customerName || selectedConv.externalUserId || "Unknown"}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full font-bold", getPlatformStyle(selectedConv.platform).bg, getPlatformStyle(selectedConv.platform).text)}>{getPlatformStyle(selectedConv.platform).label}</span>
                        <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full font-bold", getSentimentStyle(selectedConv.sentiment || 'neutral').bg, getSentimentStyle(selectedConv.sentiment || 'neutral').text)}>{getSentimentStyle(selectedConv.sentiment || 'neutral').label}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {(selectedConv.status === "HUMAN_TAKEOVER" || selectedConv.needsHuman) && <p className="text-[9px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2 mt-1">⚠️ AI bị kẹt — cần bốc máy ngay sếp ơi!</p>}
              </div>

              <Card title="Intelligence" icon={BrainCircuit} compact>
                <div className="space-y-2">
                  {[
                    { label: "Stage", value: selectedConv.stage ? `Stage ${selectedConv.stage}` : "N/A", icon: Target },
                    { label: "Intent", value: selectedConv.intent || "Mua hàng", icon: ArrowUpRight },
                    { label: "Sentiment", value: selectedConv.sentiment || "Bình thường", icon: TrendingUp },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white/[0.02] rounded-lg">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-3 w-3 text-neutral-600" />
                        <span className="text-[10px] text-neutral-500">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="💡 Suggetion" icon={Shield} compact>
                <div className="p-2.5 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                  <p className="text-[10px] text-blue-300 leading-relaxed italic">
                    &quot;{matchedProfile?.analysis?.suggestedAction || (selectedConv.needsHuman ? "Khách đang nóng. Xin lỗi trước, giải quyết nhanh!" : "Dẫn dắt khách chốt đơn bằng mã giảm giá.")}&quot;
                  </p>
                </div>
              </Card>

              <Card title="Tags" icon={Tag} compact>
                <div className="flex flex-wrap gap-1">
                  {(selectedConv.tags || ["VVIP", "Tech Stack", "Follow-up"]).map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[8px] text-neutral-400 uppercase tracking-tighter">{tag}</span>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-neutral-800 opacity-20">
              <Bot className="h-8 w-8 mb-2" />
              <p className="text-[10px]">Chọn hội thoại để phân tích</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

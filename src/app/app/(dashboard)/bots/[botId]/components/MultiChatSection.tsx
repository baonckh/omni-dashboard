"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, Smartphone, Users, BrainCircuit, Target, RefreshCw, Plus, X } from "lucide-react";
import { useShopId } from "@/lib/use-shop";
import { Card, SectionHeader, DEFAULT_STAGES, PLATFORMS } from "./shared";
import { playgroundChat, fetchBotSettings, type BotSetting } from "@/lib/api";
import { ProductCarousel } from "@/components/ui/ProductCarousel";
import { cn } from "@/lib/utils";

const DEMO_RESPONSES: Record<string, { reply: string; sentiment: string; thought: string }> = {
  greeting: { reply: "👋 Chào bạn! Mình là AI tư vấn của shop. Bạn cần tìm sản phẩm gì hôm nay?", sentiment: "positive", thought: "User greeted with a greeting" },
  default: { reply: "Cảm ơn tin nhắn của bạn! Shop có nhiều sản phẩm đang khuyến mãi. Bạn quan tâm gì ạ?", sentiment: "neutral", thought: "Processing user message" },
};

type ChatMessage = { 
  role: "user" | "assistant" | "system" | "agent"; 
  content: string; 
  thought?: string; 
  functionName?: string; 
  functionArgs?: Record<string, any>; 
  timestamp: Date; 
  products?: Array<{ 
    title: string; 
    content: string; 
    price: number; 
    original_price?: number; 
    variants?: Array<{ sku: string; attributes: Record<string, string>; price: number; stock: number; image: string }>; 
    image?: string; 
    url?: string 
  }> 
};
type ChatSession = { id: string; name: string; senderId: string; messages: ChatMessage[]; stage: number; platform: string; lastMsg: string; unread: number };

export function MultiChatSection({ botId }: { botId: string }) {
  const shopId = useShopId();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [botSettings, setBotSettings] = useState<BotSetting | null>(null);
  const [activeId, setActiveId] = useState("");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [senderRole, setSenderRole] = useState<"user" | "agent">("user");
  const [apiStatus, setApiStatus] = useState<"unknown" | "online" | "offline">("unknown");
  const [aiStatus, setAiStatus] = useState<"unknown" | "online" | "offline">("unknown");
  const [showHelp, setShowHelp] = useState(false);
  const [chatProvider, setChatProvider] = useState("gemini");
  const [chatModel, setChatModel] = useState("gemini-flash-lite-latest");
  const [debounceMs, setDebounceMs] = useState(2000);
  const [lastThought, setLastThought] = useState<{ thought: string; fn?: string; args?: Record<string, any> } | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const session = sessions.find((s) => s.id === activeId);

  const isChatProviderActive = (provider: string) => {
    return botSettings?.aiConfig?.keys?.some(k => k.provider === provider && k.isActive) || false;
  };

  const [hasLoaded, setHasLoaded] = useState(false);
  const [openRouterModels, setOpenRouterModels] = useState<any[]>([]);

  // Load from LocalStorage (Run ONCE)
  useEffect(() => {
    const savedSessions = localStorage.getItem("omni_playground_sessions");
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const restored = parsed.map((s: any) => ({
            ...s,
            messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
          }));
          setSessions(restored);
          setActiveId(restored[0].id);
        }
      } catch (e) { console.error("Failed to restore sessions", e); }
    } else {
      const initialId = crypto.randomUUID();
      setSessions([{ id: initialId, name: "Khách hàng 1", senderId: "cust_001", messages: [], stage: 1, platform: "facebook", lastMsg: "", unread: 0 }]);
      setActiveId(initialId);
    }

    const savedConfig = localStorage.getItem("omni_playground_chat_config");
    if (savedConfig) {
      try {
        const { chatProvider: cp, chatModel: cm, debounceMs: dms } = JSON.parse(savedConfig);
        if (cp) setChatProvider(cp);
        if (cm) setChatModel(cm);
        if (dms) setDebounceMs(dms);
      } catch (e) { console.error("Failed to restore config", e); }
    }
    setHasLoaded(true);
  }, []);

  // Check API health
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080'}/ping`)
      .then(() => setApiStatus("online"))
      .catch(() => setApiStatus("offline"));
  }, []);

  // Save to LocalStorage (Only after loading)
  useEffect(() => {
    if (!hasLoaded) return;
    
    if (sessions.length > 0) {
      localStorage.setItem("omni_playground_sessions", JSON.stringify(sessions));
    }
    localStorage.setItem("omni_playground_chat_config", JSON.stringify({ chatProvider, chatModel, debounceMs }));
  }, [sessions, chatProvider, chatModel, debounceMs, hasLoaded]);

  // Fetch Bot Settings independently
  useEffect(() => {
    fetchBotSettings(shopId).then((s) => {
      setBotSettings(s);
      
      // Only set defaults if no saved config exists
      if (!localStorage.getItem("omni_playground_chat_config")) {
        const keys = s?.aiConfig?.keys || [];
        const activeGemini = keys.find(k => k.provider === "gemini" && k.isActive);
        const activeOpenAI = keys.find(k => k.provider === "openai" && k.isActive);
        
        if (activeGemini) {
          setChatProvider("gemini");
          setChatModel("gemini-flash-lite-latest");
        } else if (activeOpenAI) {
          setChatProvider("openai");
          setChatModel("o4-mini");
        }
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (chatProvider === "openrouter" && openRouterModels.length === 0) {
      fetch('https://openrouter.ai/api/v1/models')
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
            setOpenRouterModels(data.data.sort((a: any, b: any) => a.id.localeCompare(b.id)));
          }
        })
        .catch(console.error);
    }
  }, [chatProvider, openRouterModels.length]);

  useEffect(() => { chatRef.current?.scrollIntoView({ behavior: "smooth" }); }, [session?.messages]);

  const addSession = () => {
    const n = sessions.length + 1;
    const id = crypto.randomUUID();
    const platforms = ["facebook", "tiktok", "shopee", "web"];
    setSessions([...sessions, { id, name: `Khách hàng ${n}`, senderId: `cust_${id.substring(0, 5)}`, messages: [], stage: 1, platform: platforms[(n - 1) % platforms.length], lastMsg: "", unread: 0 }]);
    setActiveId(id);
  };

  const removeSession = (id: string) => {
    if (sessions.length <= 1) return;
    const next = sessions.filter((s) => s.id !== id);
    setSessions(next);
    if (activeId === id) {
      if (next.length > 0) {
        setActiveId(next[0].id);
      } else {
        setActiveId("");
      }
    }
  };

const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const pendingRef = useRef<string[]>([]);

  const handleSend = async () => {
    if (!input.trim() || isTyping || !session) return;
    
    // Nếu chat với tư cách của Nhân viên (Agent)
    if (senderRole === "agent") {
      const msg: ChatMessage = { role: "agent", content: input, timestamp: new Date() };
      setSessions((p) => p.map((s) => s.id === activeId ? { ...s, messages: [...s.messages, msg], lastMsg: input } : s));
      setInput("");
      return;
    }

    // Nếu chat với tư cách của Khách hàng (User) -> Gọi AI
    const msg: ChatMessage = { role: "user", content: input, timestamp: new Date() };
    setSessions((p) => p.map((s) => s.id === activeId ? { ...s, messages: [...s.messages, msg], lastMsg: input } : s));
    setInput(""); setIsTyping(true);

    try {
      const resp = await playgroundChat({ 
        shop_id: shopId, 
        bot_id: botId,
        sender_id: session.senderId, 
        message: input, 
        platform: session.platform,
        provider: chatProvider,
        model: chatModel
      });
      const ai: ChatMessage = { 
        role: "assistant", 
        content: resp.reply || "(No response)", 
        thought: resp.thought, 
        functionName: resp.functionName, 
        functionArgs: resp.functionArgs, 
        timestamp: new Date(),
        products: resp.products as ChatMessage["products"]
      };
      setSessions((p) => p.map((s) => {
        if (s.id !== activeId) return s;
        // Logic ưu tiên stage từ AI nếu có, nếu không thì dùng logic cũ hoặc giữ nguyên
        let stage = resp.stage || s.stage;
        
        // Fallback logic nếu AI không trả về stage
        if (!resp.stage) {
          if (resp.functionName === "report_lead") stage = 5;
          else if (resp.functionName === "escalate_to_human") stage = 6;
        }
        
        return { ...s, messages: [...s.messages, ai], stage, lastMsg: ai.content.substring(0, 50) };
      }));
      setLastThought({ thought: resp.thought || "", fn: resp.functionName, args: resp.functionArgs });
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorAi: ChatMessage = {
        role: "assistant",
        content: "⚠️ " + (err.message || "AI service error. Please check your API key configuration."),
        timestamp: new Date()
      };
      setSessions((p) => p.map((s) => s.id === activeId ? { ...s, messages: [...s.messages, errorAi] } : s));
    }
    finally { setIsTyping(false); }
  };

  const getPlatformStyle = (p: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      facebook: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Messenger" },
      tiktok: { bg: "bg-pink-500/10", text: "text-pink-400", label: "TikTok" },
      shopee: { bg: "bg-orange-500/10", text: "text-orange-400", label: "Shopee" },
      web: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Web" },
      playground: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "Sandbox" },
    };
    return map[p] || map.playground;
  };

  return (
    <div className="space-y-4 pb-8">
      <SectionHeader title="Multi-Chat Simulator" subtitle="Mẫu simulator hỗ trợ cả Khách hàng tự chat và Nhân viên shop nhảy vào tiếp quản" icon={Users} />
      <div className="flex gap-4 h-[calc(100vh-260px)] min-h-[480px]">

        {/* LEFT: Vertical Conversation List */}
        <div className="w-72 flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shrink-0">
          <div className="px-3 py-2.5 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400">Conversations ({sessions.length})</span>
            <button onClick={addSession} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10"><Plus className="h-3 w-3" /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sessions.map((s) => {
              const ps = getPlatformStyle(s.platform);
              return (
                <div
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={cn(
                    "w-full flex items-start gap-3 px-3 py-3 text-left border-b border-white/[0.03] transition-all cursor-pointer",
                    activeId === s.id ? "bg-blue-500/5" : "hover:bg-white/[0.02]"
                  )}
                >
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold", activeId === s.id ? "bg-blue-600 text-white" : "bg-white/5 text-neutral-500")}>
                    {s.name.charAt(s.name.length - 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-xs font-bold truncate", activeId === s.id ? "text-white" : "text-neutral-300")}>{s.name}</span>
                      {sessions.length > 1 && <button onClick={(e) => { e.stopPropagation(); removeSession(s.id); }} className="p-0.5 text-neutral-700 hover:text-red-500"><X className="h-2.5 w-2.5" /></button>}
                    </div>
                    <p className="text-[10px] text-neutral-600 truncate mt-0.5">{s.lastMsg || "Chưa có tin nhắn"}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full font-bold", ps.bg, ps.text)}>{ps.label}</span>
                      <span className="text-[8px] text-neutral-700">Stage {s.stage}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER: Chat Area */}
        <div className="flex-1 flex flex-col bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
          <header className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            {session ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{session.name}</span>
                    <span className={cn("text-[9px] w-fit px-1.5 py-0.5 rounded-full font-bold mt-0.5", getPlatformStyle(session.platform).bg, getPlatformStyle(session.platform).text)}>{getPlatformStyle(session.platform).label}</span>
                  </div>
                </div>
                <button onClick={() => setSessions((p) => p.map((s) => s.id === activeId ? { ...s, senderId: `cust_${crypto.randomUUID().substring(0, 8)}`, messages: [], stage: 1, lastMsg: "" } : s))} className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-600"><RefreshCw className="h-3.5 w-3.5" /></button>
                <div className="flex items-center gap-2 ml-2">
                  <div className={`h-2 w-2 rounded-full ${apiStatus === "online" ? "bg-green-500" : apiStatus === "offline" ? "bg-red-500" : "bg-yellow-500 animate-pulse"}`} />
                  <span className="text-[9px] text-neutral-600">API</span>
                </div>
                <button onClick={() => setShowHelp(true)} className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-600" title="Hướng dẫn">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.986.54-1.106 1.078-.121.54-.08 1.14-.12 1.714-.045.585.012 1.19.165 1.75.152.56.43.93.798 1.054.37.12.795.144 1.235.084.44-.06.85-.29 1.15-.6.3-.3.52-.71.65-1.15.13-.44.15-.95.12-1.45a4.97 4.97 0 00-.9-2.5M12 18h.01" />
                  </svg>
                </button>
              </>
            ) : (
              <span className="text-xs text-neutral-600">Chọn một cuộc hội thoại</span>
            )}
          </header>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!session && <div className="flex flex-col items-center justify-center h-full text-neutral-700 font-bold"><Smartphone className="h-10 w-10 opacity-15 mb-3" /><p className="text-xs">Chưa chọn phiên chat</p></div>}
            {session && session.messages.length === 0 && <div className="flex flex-col items-center justify-center h-full text-neutral-700"><Bot className="h-10 w-10 opacity-15 mb-3" /><p className="text-xs">Chat thử với tư cách &quot;{session.name}&quot;...</p></div>}
            {session && session.messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-2 max-w-[85%]", (msg.role === "user") ? "ml-auto flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border", 
                  msg.role === "assistant" ? "bg-white text-black border-white/20" : 
                  msg.role === "agent" ? "bg-purple-600 text-white border-purple-400/30" :
                  msg.role === "system" ? "bg-red-500/20 text-red-500 border-red-500/10" : 
                  "bg-blue-600 text-white border-blue-400/30"
                )}>
                  {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : 
                   msg.role === "agent" ? <Users className="h-4 w-4" /> :
                   <Smartphone className="h-4 w-4" />}
                </div>
                <div className="flex flex-col max-w-full">
                  <div className={cn(
                    "px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed relative", 
                    msg.role === "assistant" ? "bg-white/5 border border-white/10 rounded-tl-none" : 
                    msg.role === "agent" ? "bg-purple-600/20 border border-purple-500/30 text-purple-100 rounded-tl-none" :
                    msg.role === "system" ? "bg-red-500/10 border border-red-500/20 text-red-400 rounded-tl-none" : 
                    "bg-blue-600 text-white rounded-tr-none"
                  )}>
                    {msg.role === "assistant" && <span className="absolute -top-4 left-0 text-[8px] font-bold text-blue-400 uppercase tracking-wider">🤖 AI Bot</span>}
                    {msg.role === "agent" && <span className="absolute -top-4 left-0 text-[8px] font-bold text-purple-400 uppercase tracking-wider">👤 Nhân viên Shop</span>}
                    {msg.content}
                    {/* Render products if present */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-3 -mx-1">
                        <ProductCarousel products={msg.products} title="🛍️ Sản phẩm gợi ý" />
                      </div>
                    )}
                    {msg.functionName && <div className="mt-1.5 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-[9px] text-yellow-500 font-mono">⚡ {msg.functionName}</div>}
                  </div>
                  <span className="text-[8px] text-neutral-700 mt-1 block px-1">{msg.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
            {isTyping && <div className="flex gap-2"><div className="h-8 w-8 rounded-xl bg-white text-black flex items-center justify-center"><Bot className="h-4 w-4" /></div><div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none"><div className="flex gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-neutral-500 animate-bounce" /><div className="h-1.5 w-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.2s]" /><div className="h-1.5 w-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.4s]" /></div></div></div>}
            <div ref={chatRef} />
          </div>
          <div className="px-4 py-3 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Chat với tư cách:</span>
              <div className="flex gap-1.5">
                <button onClick={() => setSenderRole("user")} className={cn("px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all border", senderRole === "user" ? "bg-blue-600 text-white border-blue-400" : "bg-white/5 text-neutral-500 border-white/5 hover:bg-white/10")}>📱 Khách hàng</button>
                <button onClick={() => setSenderRole("agent")} className={cn("px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all border", senderRole === "agent" ? "bg-purple-600 text-white border-purple-400" : "bg-white/5 text-neutral-500 border-white/5 hover:bg-white/10")}>👤 Nhân viên</button>
              </div>
            </div>
            <div className="relative">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder={senderRole === "user" ? `Nhập tin nhắn từ "${session?.name || "Khách hàng"}"...` : "Nhập câu trả lời của Nhân viên shop..."} className={cn("w-full bg-white/5 border rounded-2xl px-5 py-3.5 pr-14 text-sm focus:outline-none focus:ring-2 transition-all", senderRole === "user" ? "border-white/10 focus:ring-blue-500/50" : "border-purple-500/30 focus:ring-purple-500/50 bg-purple-500/[0.03]")} />
              <button onClick={handleSend} disabled={!input.trim() || isTyping} className={cn("absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-lg", senderRole === "user" ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20" : "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20")}>
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: AI Brain */}
        <div className="w-56 space-y-3 flex flex-col shrink-0">
          <Card title="AI Config" icon={BrainCircuit} compact>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-neutral-500 font-bold mb-1 block uppercase tracking-wider">Provider</label>
                <select 
                  value={chatProvider} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setChatProvider(val);
                    if (val === "openai") setChatModel("o4-mini");
                    else if (val === "openrouter") setChatModel("anthropic/claude-3.5-sonnet");
                    else setChatModel("gemini-flash-lite-latest");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-medium text-white appearance-none focus:outline-none focus:border-blue-500/50"
                >
                  <option value="openai" className="bg-neutral-900" disabled={!isChatProviderActive("openai")}>OpenAI (GPT-5 Era)</option>
                  <option value="gemini" className="bg-neutral-900" disabled={!isChatProviderActive("gemini")}>Google Gemini 3.1</option>
                  <option value="openrouter" className="bg-neutral-900" disabled={!isChatProviderActive("openrouter")}>OpenRouter</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-neutral-500 font-bold mb-1 block uppercase tracking-wider">Model</label>
                <select 
                  value={chatModel} 
                  onChange={(e) => setChatModel(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-medium text-white appearance-none focus:outline-none focus:border-blue-500/50"
                >
                  {chatProvider === "openrouter" ? (
                    openRouterModels.length > 0 ? (
                      Object.entries(
                        openRouterModels.reduce((acc: any, m: any) => {
                          const author = m.id.split('/')[0];
                          if (!acc[author]) acc[author] = [];
                          acc[author].push(m);
                          return acc;
                        }, {})
                      ).map(([author, models]: [string, any]) => (
                        <optgroup key={author} label={author.toUpperCase()} className="bg-neutral-900 text-neutral-500 font-bold text-[9px]">
                          {models.map((m: any) => {
                            let pCost = "0.00", cCost = "0.00";
                            if (m.pricing) {
                                pCost = (Number(m.pricing.prompt) * 1000000).toFixed(2);
                                cCost = (Number(m.pricing.completion) * 1000000).toFixed(2);
                            }
                            return (
                              <option key={m.id} value={m.id} className="bg-neutral-900 text-white font-normal text-[10px]">
                                {m.name} (${pCost}/${cCost} per 1M)
                              </option>
                            );
                          })}
                        </optgroup>
                      ))
                    ) : (
                      <option value="anthropic/claude-3.5-sonnet" className="bg-neutral-900">Loading OpenRouter models...</option>
                    )
                  ) : chatProvider === "openai" ? (
                    <>
                      <option value="o4-mini" className="bg-neutral-900">o4-mini (Fast & Cheapest)</option>
                      <option value="o3" className="bg-neutral-900">o3 (Reasoning)</option>
                      <option value="gpt-5.4-thinking" className="bg-neutral-900">gpt-5.4-thinking (Next-Gen)</option>
                      <option value="gpt-5.4-pro" className="bg-neutral-900">gpt-5.4-pro</option>
                    </>
                  ) : (
                    <>
                      <option value="gemini-flash-lite-latest" className="bg-neutral-900">gemini-flash-lite (Nhanh, Tiết kiệm)</option>
                      <option value="gemini-3.1-flash-lite-preview" className="bg-neutral-900">gemini-3.1-flash-lite</option>
                      <option value="gemini-3.1-pro-preview" className="bg-neutral-900">gemini-3.1-pro (SOTA Reasoning)</option>
                      <option value="gemini-3.1-flash-image-preview" className="bg-neutral-900">gemini-3.1-flash-image</option>
                      <option value="gemini-flash-latest" className="bg-neutral-900">gemini-flash-latest</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            {/* Debounce config */}
            <div>
              <label className="text-[9px] text-neutral-600 font-medium uppercase tracking-wider">Gộp tin nhắn (ms)</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="range" min="0" max="5000" step="100" value={debounceMs} onChange={(e) => setDebounceMs(Number(e.target.value))} className="flex-1 accent-blue-500 h-1" />
                <span className="text-xs font-mono text-neutral-400 w-10 text-right">{debounceMs}ms</span>
              </div>
              <p className="text-[9px] text-neutral-700 mt-0.5">0 = tắt gộp, gửi ngay từng tin</p>
            </div>
          </Card>

          <Card title="Stage" icon={Target} compact>
            <div className="space-y-1">
              {DEFAULT_STAGES.map((st) => (
                <div key={st.order} className={cn("flex items-center gap-2 px-2 py-1 rounded-lg text-[10px]", session?.stage === st.order ? "bg-white/10 text-white font-bold" : "text-neutral-700")}>
                  <div className={cn("h-1.5 w-1.5 rounded-full", session?.stage === st.order ? "bg-blue-500" : "bg-neutral-800")} />
                  {st.order}. {st.name}
                </div>
              ))}
            </div>
          </Card>
          <Card title="AI Thought" icon={BrainCircuit} compact className="flex-1 overflow-auto">
            {lastThought ? (
              <div className="space-y-2 text-[10px]">
                <p className="text-neutral-400 leading-relaxed">{lastThought.thought}</p>
                {lastThought.fn && <div className="p-2 bg-yellow-500/5 border border-yellow-500/10 rounded-lg font-mono text-[9px]"><span className="text-yellow-500">{lastThought.fn}</span></div>}
              </div>
            ) : <p className="text-[10px] text-neutral-700 text-center py-6">Chat để xem AI suy nghĩ...</p>}
          </Card>
        </div>
      </div>

      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowHelp(false)}>
          <div className="bg-neutral-900 border border-white/20 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Hướng dẫn sử dụng Playground</h3>
              <button onClick={() => setShowHelp(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <svg className="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 text-xs text-neutral-400">
              <div>
                <h4 className="font-bold text-white mb-2">🔧 Yêu cầu hệ thống</h4>
                <ul className="space-y-1">
                  <li>• <span className="text-green-400">API Server</span> (Go) - Port 8080</li>
                  <li>• <span className="text-green-400">AI Service</span> (Python gRPC) - Port 50051</li>
                  <li>• <span className="text-yellow-400">MongoDB</span> - Port 27017</li>
                  <li>• <span className="text-yellow-400">Redis</span> - Port 6379</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">🚀 Cách khởi động</h4>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-[10px]">
                  <p className="text-neutral-500"># Terminal 1: API Server</p>
                  <p className="text-green-400">cd omni-backend && go run ./cmd/api/main.go</p>
                  <p className="text-neutral-500 mt-2"># Terminal 2: AI Service</p>
                  <p className="text-green-400">cd omni-ai-service && python main.py</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">📡 API Endpoints</h4>
                <ul className="space-y-1">
                  <li><span className="text-blue-400">POST</span> /api/v1/admin/chat/playground</li>
                  <li><span className="text-blue-400">GET</span> /api/v1/admin/products/:shopId</li>
                  <li><span className="text-blue-400">POST</span> /api/v1/admin/products/:shopId</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
              <button onClick={() => setShowHelp(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white">Đã hiểu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

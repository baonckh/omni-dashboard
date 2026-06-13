"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { MessageSquare, ArrowRight, Bot, User, Cpu, Key, Check, Loader2, ExternalLink } from "lucide-react";
import { getSession } from "next-auth/react";
import type { OnboardingData, AIProvider } from "@/types/onboarding";

interface StepProps {
  data: OnboardingData;
  onUpdate: (partial: Partial<OnboardingData>) => void;
  onSkip: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const QUICK_QUESTIONS = [
  "Xin chào",
  "Có sản phẩm mới không?",
  "Giao hàng thế nào?",
];

const PROVIDERS: { value: AIProvider; label: string; desc: string; docUrl: string }[] = [
  { value: "openai", label: "OpenAI", desc: "GPT-4o, GPT-4o-mini", docUrl: "https://platform.openai.com/api-keys" },
  { value: "gemini", label: "Gemini", desc: "Gemini 2.0 Flash", docUrl: "https://aistudio.google.com/apikey" },
  { value: "openrouter", label: "OpenRouter", desc: "Nhiều model giá rẻ", docUrl: "https://openrouter.ai/keys" },
];

export default function StepPlayground({ data, onUpdate }: StepProps) {
  const { lang } = useLang();
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const hasKey = data.aiProvider && data.aiKey;

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveKey = async () => {
    if (!data.aiProvider || !data.aiKey) return;
    setSaving(true);
    try {
      const session = await getSession();
      const token = session?.user?.backendToken;
      const shopId = session?.user?.shopId;
      if (!token || !shopId) return;
      await fetch(`${API_BASE}/admin/settings/${shopId}/bot`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          aiConfig: {
            keys: [{ provider: data.aiProvider, key: data.aiKey, isActive: true }],
          },
        }),
      });
      setSaved(true);
    } catch (e) {
      console.error("[PLAYGROUND] Save key failed:", e);
    }
    setSaving(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setSending(true);

    try {
      const session = await getSession();
      const token = session?.user?.backendToken;
      const shopId = session?.user?.shopId;

      // Call real playground API
      const res = await fetch(`${API_BASE}/chat/playground`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: userMsg,
          shop_id: shopId,
          tone: data.botTone,
          bot_name: data.botName || "AI Assistant",
        }),
      });

      if (res.ok) {
        const reply = await res.json();
        setMessages((prev) => [...prev, { role: "bot", text: reply.response || reply.text || "(no response)" }]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: `❌ Lỗi: ${res.status} - Không thể kết nối AI. Kiểm tra API key.` }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: "❌ Lỗi kết nối. Đảm bảo đã cấu hình AI Provider." }]);
    }
    setSending(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* AI Provider Key Card */}
      <div className={cn(
        "rounded-2xl border p-5 transition-all",
        hasKey ? "border-green-500/20 bg-green-500/[0.02]" : "border-white/[0.06] bg-white/[0.02]"
      )}>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5" />
            {lang === "vi" ? "AI PROVIDER" : "AI PROVIDER"}
          </label>
          {saved && <span className="text-[10px] text-green-500 flex items-center gap-1"><Check className="h-3 w-3" />Saved</span>}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {PROVIDERS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => { onUpdate({ aiProvider: p.value }); setSaved(false); }}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-medium border transition-all",
                data.aiProvider === p.value
                  ? "bg-purple-600/20 border-purple-500/40 text-purple-300"
                  : "bg-white/[0.03] border-white/[0.06] text-zinc-500 hover:bg-white/[0.06]"
              )}
            >
              {p.label}
              <span className="block text-[9px] text-zinc-600 font-normal">{p.desc}</span>
            </button>
          ))}
        </div>

        {data.aiProvider && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center gap-2">
              <Key className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <input
                type="password"
                value={data.aiKey}
                onChange={(e) => { onUpdate({ aiKey: e.target.value }); setSaved(false); }}
                placeholder={lang === "vi" ? "Paste API key..." : "Paste API key..."}
                className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-purple-500/50 transition-colors"
              />
              <button
                type="button"
                onClick={saveKey}
                disabled={saving || !data.aiKey}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              </button>
            </div>
            <a
              href={PROVIDERS.find((p) => p.value === data.aiProvider)?.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-blue-500 hover:text-blue-400 flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              {lang === "vi" ? "Lấy API Key" : "Get API Key"}
            </a>
          </motion.div>
        )}
      </div>

      {/* Chat Card */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="h-52 overflow-y-auto p-3 space-y-2.5">
          {!hasKey && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600">
              <MessageSquare className="h-6 w-6 mb-1.5 opacity-30" />
              <p className="text-xs">{lang === "vi" ? "Nhập API Key ở trên để chat với AI" : "Enter API Key above to chat with AI"}</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed",
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-zinc-800/80 text-zinc-200 rounded-bl-sm"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-zinc-800/80 rounded-2xl rounded-bl-sm px-3 py-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />
              </div>
            </div>
          )}
          <div ref={chatEnd} />
        </div>

        <div className="border-t border-white/[0.06] p-2.5 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={hasKey ? (lang === "vi" ? "Nhập tin nhắn..." : "Type a message...") : (lang === "vi" ? "Cấu hình AI key trước" : "Configure AI key first")}
            disabled={!hasKey}
            className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 disabled:opacity-40 transition-colors"
          />
          <button onClick={sendMessage} disabled={!hasKey || sending || !input.trim()}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 disabled:cursor-not-allowed rounded-xl transition-all active:scale-95"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Quick questions */}
        {hasKey && messages.length === 0 && (
          <div className="px-3 pb-3 flex gap-1.5 flex-wrap">
            {QUICK_QUESTIONS.map((q) => (
              <button key={q} onClick={() => { setInput(q); }}
                className="px-2.5 py-1 text-[10px] bg-white/[0.03] border border-white/[0.06] rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

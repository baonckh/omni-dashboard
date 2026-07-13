"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchHandoffThreads, claimThread, releaseThread, sendStaffMessage, fetchSuggestions, actionSuggestion, type HandoffThread, type AISuggestion } from "@/lib/handoff";

export default function HandoffPage() {
  const [threads, setThreads] = useState<HandoffThread[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetchHandoffThreads("all").then(setThreads).catch(console.error);
    const interval = setInterval(() => fetchHandoffThreads("all").then(setThreads).catch(() => {}), 5000);
    return () => clearInterval(interval);
  }, []);

  const selectThread = async (id: string) => {
    setSelected(id);
    const sug = await fetchSuggestions(id).catch(() => []);
    setSuggestions(sug);
  };

  const thread = threads.find(t => t.id === selected);
  const lastSuggestion = suggestions[0];

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      {/* Thread List */}
      <div className="w-72 shrink-0 border-r border-white/10 overflow-y-auto">
        <div className="p-3 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">Cần hỗ trợ</h2>
          <p className="text-[10px] text-zinc-500">{threads.length} thread đang chờ</p>
        </div>
        {threads.map(t => (
          <button
            key={t.id}
            onClick={() => selectThread(t.id)}
            className={`w-full text-left px-3 py-2.5 border-b border-white/5 hover:bg-white/5 transition-colors ${
              selected === t.id ? "bg-blue-600/10 border-l-2 border-l-blue-500" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {t.customerName?.charAt(0) || "?"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">{t.customerName || "Unknown"}</p>
                <p className="text-[10px] text-zinc-500">{t.platform} · {t.handoffReason?.slice(0, 30) || "Handoff"}</p>
              </div>
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                t.handoffState === "handoff_requested" ? "bg-red-500" :
                t.handoffState === "staff_claimed" ? "bg-amber-500" : "bg-zinc-600"
              }`} />
            </div>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!thread ? (
          <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
            Chọn một thread để xem chi tiết
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
              <div>
                <h3 className="text-sm font-semibold text-white">{thread.customerName}</h3>
                <p className="text-[10px] text-zinc-500">Trạng thái: {thread.handoffState} · {thread.platform}</p>
              </div>
              <div className="flex gap-2">
                {thread.handoffState === "handoff_requested" && (
                  <button onClick={() => claimThread(thread.id, "staff_001").then(() => selectThread(thread.id))}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors">
                    Claim
                  </button>
                )}
                {thread.handoffState === "staff_claimed" && (
                  <button onClick={() => releaseThread(thread.id).then(() => selectThread(thread.id))}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors">
                    Release
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {thread.messages?.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[70%] px-3 py-2 rounded-xl text-xs ${
                    msg.senderType === "BOT" ? "bg-blue-600/10 text-blue-300 border border-blue-500/20" :
                    msg.senderType === "HUMAN_OWNER" ? "bg-green-600/10 text-green-300 border border-green-500/20" :
                    "bg-white/5 text-zinc-300 border border-white/10"
                  }`}>
                    <p>{msg.content}</p>
                    <p className="text-[9px] text-zinc-600 mt-1">
                      {msg.senderType === "BOT" ? "Bot" : msg.senderType === "HUMAN_OWNER" ? "Staff" : "Khách"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Suggestion */}
            <AnimatePresence>
              {lastSuggestion && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="mx-4 mb-2 p-3 rounded-xl bg-blue-600/5 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0 mt-0.5">🤖</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-blue-300 font-medium">AI đề xuất</p>
                      <p className="text-xs text-zinc-400 mt-1">{lastSuggestion.suggestedReply}</p>
                      <details className="mt-1">
                        <summary className="text-[9px] text-zinc-600 cursor-pointer hover:text-zinc-500">
                          Xem thought process
                        </summary>
                        <p className="text-[10px] text-zinc-600 mt-1 italic">{lastSuggestion.thought}</p>
                      </details>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => { setInput(lastSuggestion.suggestedReply); actionSuggestion(lastSuggestion.id, "used"); }}
                          className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors">
                          Use
                        </button>
                        <button onClick={() => actionSuggestion(lastSuggestion.id, "ignored")}
                          className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-zinc-700 text-zinc-400 hover:bg-zinc-600 transition-colors">
                          Ignore
                        </button>
                      </div>
                    </div>
                    <span className="text-[9px] text-zinc-600">{(lastSuggestion.confidence * 100).toFixed(0)}%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && input.trim()) {
                      sendStaffMessage(thread.id, input.trim()).then(() => {
                        setInput("");
                        selectThread(thread.id);
                      });
                    }
                  }}
                  placeholder="Nhập tin nhắn hoặc dùng đề xuất AI..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50"
                />
                <button
                  onClick={() => {
                    if (input.trim()) {
                      sendStaffMessage(thread.id, input.trim()).then(() => {
                        setInput("");
                        selectThread(thread.id);
                      });
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-all disabled:opacity-50"
                  disabled={!input.trim()}
                >
                  Gửi
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

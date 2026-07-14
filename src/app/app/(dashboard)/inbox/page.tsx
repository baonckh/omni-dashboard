"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Search, 
  Filter, 
  Send, 
  MoreVertical, 
  MessageSquare, 
  User, 
  Bot, 
  ShieldCheck,
  Tag,
  Clock,
  ExternalLink,
  CheckCheck
} from "lucide-react";
import { useShopId } from "@/lib/use-shop";
import { fetchThreads, fetchMessages, sendReply, updateThreadStatus } from "@/lib/api";
import { ProductCarousel } from "@/components/ui/ProductCarousel";
import type { ProductCardData } from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";

// ponytail: inline product parser — extracts product blocks from bot response text
function parseProductsFromText(text: string): { cleanText: string; products: ProductCardData[] } {
  const products: ProductCardData[] = [];
  let cleanText = text;

  // Match product pattern: **Name**\nDescription\nPrice ₫\nMua
  // Try to extract product blocks between headers
  const lines = text.split('\n');
  let inProductSection = false;
  const nonProductLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Sản phẩm gợi ý') || line.includes('sản phẩm')) {
      inProductSection = true;
      continue;
    }

    // Match: **Product Name** — start of a product card
    const productMatch = line.match(/^\*\*(.+?)\*\*$/);
    if (productMatch && inProductSection) {
      const name = productMatch[1];
      // Skip blank lines between product fields (ponytail: bot output has variable spacing)
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      const description = lines[j]?.trim() || '';
      // Next non-blank line after description = price
      j++;
      while (j < lines.length && !lines[j].trim()) j++;
      const priceLine = lines[j]?.replace(/[^\d]/g, '') || '';
      const price = parseInt(priceLine, 10) || 0;
      products.push({ title: name, content: description, price, image: '' });
      i = j; // skip past price line
      continue;
    }

    // If we see a non-product line after product section ends, stop
    if (inProductSection && (line.startsWith('---') || line.trim() === '' || line.startsWith('Bạn muốn'))) {
      inProductSection = false;
    }

    if (!inProductSection) {
      nonProductLines.push(line);
    }
  }

  cleanText = nonProductLines.join('\n').trim();
  return { cleanText, products };
}

export default function InboxPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThread, setActiveThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const shopId = useShopId();

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeThread) {
      loadMessages(activeThread.id);
      // Polling every 5 seconds for new messages
      interval = setInterval(() => {
         loadMessages(activeThread.id, true);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [activeThread]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadThreads = async () => {
    try {
      const data = await fetchThreads(shopId);
      if (Array.isArray(data)) {
        setThreads(data);
        if (data.length > 0 && !activeThread) setActiveThread(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (threadId: string, background = false) => {
    try {
      const data = await fetchMessages(threadId);
      setMessages(data || []);
      // If run in background (polling), also occasionally refresh threads so we get latest timestamps & last message
      if (background) {
         fetchThreads(shopId).then(data => {
            if (Array.isArray(data)) setThreads(data);
         }).catch(console.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !activeThread || sending) return;

    setSending(true);
    try {
      await sendReply(activeThread.id, reply);
      setMessages((prev) => [...prev, {
        role: "assistant",
        senderType: "HUMAN_OWNER",
        content: reply,
        createdAt: new Date().toISOString()
      }]);
      setActiveThread((prev: any) => ({ ...prev, status: "HUMAN_TAKEOVER" }));
      setReply("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!activeThread) return;
    const newStatus = activeThread.status === "BOT_ACTIVE" ? "HUMAN_TAKEOVER" : "BOT_ACTIVE";
    try {
      await updateThreadStatus(activeThread.id, newStatus);
      setActiveThread((prev: any) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  if (loading) return <div className="p-10 text-neutral-500">Loading inbox...</div>;

  return (
    <div className="h-[calc(100vh-160px)] flex bg-black/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
      
      {/* Sidebar - Threads List */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-white/[0.02]">
        <div className="p-6 space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Inbox</h2>
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                 <Filter className="h-4 w-4 text-neutral-400" />
              </button>
           </div>
           <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {threads.map((t) => (
             <div 
               key={t.id} 
               onClick={() => setActiveThread(t)}
               className={cn(
                 "p-4 border-b border-white/[0.03] cursor-pointer transition-all hover:bg-white/[0.05] group",
                 activeThread?.id === t.id ? "bg-white/[0.08]" : ""
               )}
             >
                <div className="flex gap-3">
                   <div className="relative">
                      <div className="h-10 w-10 bg-neutral-800 rounded-full flex items-center justify-center text-sm font-bold border border-white/10 overflow-hidden">
                         {t.customerAvatar ? <img src={t.customerAvatar} alt="" /> : <User className="h-5 w-5 text-neutral-500" />}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-black flex items-center justify-center text-[8px] bg-blue-500 text-white font-bold">
                         {t.platform === "facebook" ? "F" : t.platform === "tiktok" ? "T" : t.platform === "shopee" ? "S" : "W"}
                      </div>
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                         <span className="font-bold text-sm truncate">{t.customerName || t.externalUserId}</span>
                         <span className="text-[10px] text-neutral-500 uppercase tracking-tighter">
                            {new Date(t.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                      </div>
                      <p className="text-xs text-neutral-500 truncate">
                        {t.messages && t.messages.length > 0 ? t.messages[t.messages.length-1].content : "No messages"}
                      </p>
                   </div>
                </div>
                {t.tags && t.tags.length > 0 && (
                   <div className="flex gap-1 mt-2">
                      {t.tags.map((tag: string) => (
                         <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-md uppercase font-bold tracking-widest">{tag}</span>
                      ))}
                   </div>
                )}
             </div>
           ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-black/20">
         {activeThread ? (
           <>
              {/* Chat Header */}
              <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-neutral-800 rounded-full flex items-center justify-center text-xs font-bold border border-white/10 overflow-hidden">
                       {activeThread.customerAvatar ? <img src={activeThread.customerAvatar} alt="" /> : <User className="h-4 w-4 text-neutral-500" />}
                    </div>
                    <div>
                       <h3 className="font-bold text-sm">{activeThread.customerName || activeThread.externalUserId}</h3>
                       <div className="flex items-center gap-2">
                          <span className="flex h-1.5 w-1.5 rounded-full bg-green-500" />
                          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">{activeThread.platform} Mode</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    {/* Bot/Human Switch Toggle */}
                    <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
                        <button
                           onClick={() => activeThread.status !== "BOT_ACTIVE" && handleToggleStatus()}
                           className={cn(
                             "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all",
                             activeThread.status === "BOT_ACTIVE" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-neutral-500 hover:text-white"
                           )}
                        >
                           <Bot className="h-3 w-3" /> Auto (Bot)
                        </button>
                        <button
                           onClick={() => activeThread.status !== "HUMAN_TAKEOVER" && handleToggleStatus()}
                           className={cn(
                             "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all",
                             activeThread.status === "HUMAN_TAKEOVER" ? "bg-green-600 text-white shadow-lg shadow-green-500/20" : "text-neutral-500 hover:text-white"
                           )}
                        >
                           <User className="h-3 w-3" /> Manual
                        </button>
                    </div>

                    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium transition-colors flex items-center gap-2">
                       <Tag className="h-3 w-3 text-blue-400" />
                       Add Tag
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                       <MoreVertical className="h-4 w-4 text-neutral-400" />
                    </button>
                 </div>
              </div>

              {/* Messages Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.98]"
              >
                 {messages.map((m, i) => {
                   const isCustomer = m.senderType === "CUSTOMER";
                   const isBot = m.senderType === "BOT";
                   const isOwner = m.senderType === "HUMAN_OWNER";

                   return (
                     <div 
                       key={i} 
                       className={cn(
                         "flex flex-col max-w-[80%]",
                         isCustomer ? "mr-auto items-start" : "ml-auto items-end"
                       )}
                     >
                        <div className="flex items-center gap-2 mb-1 px-1">
                           {isBot && <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1"><Bot className="h-3 w-3" /> AI Engine</span>}
                           {isOwner && <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> You (Owner)</span>}
                           <span className="text-[9px] text-neutral-500">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        
                        <div className={cn(
                          "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-lg relative group",
                          isCustomer ? "bg-white/10 text-white rounded-tl-none border border-white/5" : 
                          isBot ? "bg-blue-600/20 text-blue-50 border border-blue-500/30 rounded-tr-none" :
                          "bg-neutral-800 text-white rounded-tr-none border border-white/10"
                        )}>
                           {(() => {
                             if (!isBot) return m.content;
                             const { cleanText, products } = parseProductsFromText(m.content);
                             return (
                               <>
                                 {cleanText && <p className="whitespace-pre-wrap">{cleanText}</p>}
                                 {products.length > 0 && (
                                   <div className="mt-3">
                                     <ProductCarousel products={products} title="🛍️ Sản phẩm gợi ý" />
                                   </div>
                                 )}
                               </>
                             );
                           })()}
                           
                           {/* Tag indicator for training */}
                           <button className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded">
                              <Tag className="h-3 w-3 text-neutral-500" />
                           </button>
                        </div>
                     </div>
                   );
                 })}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white/[0.02] border-t border-white/5">
                 <form onSubmit={handleSend} className="relative group">
                    <textarea 
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend(e);
                        }
                      }}
                      placeholder="Type your message... (Enter to send)"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 pr-16 text-sm focus:outline-none focus:border-blue-500 transition-all min-h-[50px] max-h-[150px] resize-none overflow-hidden"
                      rows={1}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                       <button 
                         type="submit"
                         disabled={sending || !reply.trim()}
                         className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none"
                       >
                          {sending ? <Clock className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                       </button>
                    </div>
                 </form>
                 <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                    <div className="flex items-center gap-4">
                       <span className="flex items-center gap-1"><CheckCheck className="h-3 w-3 text-blue-500" /> AI Monitoring Active</span>
                       <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors"><Tag className="h-3 w-3" /> Auto-Tagging Enabled</span>
                    </div>
                    <div className="flex items-center gap-1">
                       Shift + Enter for new line
                    </div>
                 </div>
              </div>
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-6">
              <div className="p-6 bg-white/5 rounded-full">
                 <MessageSquare className="h-12 w-12 text-neutral-700" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-bold">Your Conversations</h3>
                 <p className="text-neutral-500 max-w-sm">Chọn một hội thoại để bắt đầu quản lý. Hệ thống sẽ tự động gắn nhãn người gửi để sếp dễ dàng theo dõi.</p>
              </div>
              <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors font-medium">
                 View Analytics
              </button>
           </div>
         )}
      </div>

      {/* Right Sidebar - Detail Context (Coming soon) */}
      <div className="w-64 border-l border-white/5 bg-black/40 p-6 hidden xl:block">
         <div className="space-y-8">
            <div className="space-y-4">
               <h4 className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold">Customer Details</h4>
               {activeThread ? (
                 <div className="space-y-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-xs text-neutral-500 mb-1">Platform ID</p>
                       <p className="text-sm font-mono truncate">{activeThread.externalUserId}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-xs text-neutral-500 mb-1">Last Seen</p>
                       <p className="text-sm">{new Date(activeThread.updatedAt).toLocaleString()}</p>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition-all">
                       <ExternalLink className="h-3 w-3" />
                       View Original Page
                    </button>
                 </div>
               ) : (
                 <p className="text-xs text-neutral-600">No customer selected</p>
               )}
            </div>

            <div className="space-y-4">
               <h4 className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold">AI Context</h4>
               <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-[11px] text-neutral-400 leading-relaxed italic">
                  "Hệ thống đang tự động theo dõi ý định mua hàng. Dữ liệu chat của chủ shop (Human) sẽ được ưu tiên làm mẫu thử cho lần cập nhật AI tới."
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

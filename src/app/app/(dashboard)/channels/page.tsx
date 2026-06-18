"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  ExternalLink, 
  RefreshCcw, 
  ShieldCheck, 
  AlertTriangle,
  Facebook,
  MessageSquare,
  ShoppingBag,
  MessageCircle,
  Globe,
  Zap,
  Copy,
  Check,
  Smartphone,
  Code2,
} from "lucide-react";
import { useShopId } from "@/lib/use-shop";
import { fetchChannels, getConnectUrl } from "@/lib/api";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";

type Channel = {
  id: string;
  platform: string;
  pageId: string;
  name: string;
  avatar: string;
  isActive: boolean;
  expiresAt: number;
};

const PLATFORM_INFO: Record<string, any> = {
  facebook: { name: "Messenger", icon: Facebook, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Facebook Messenger & Fanpage" },
  tiktok: { name: "TikTok Shop", icon: MessageSquare, color: "text-pink-500", bg: "bg-pink-500/10", desc: "TikTok Shop messages" },
  shopee: { name: "Shopee", icon: ShoppingBag, color: "text-orange-500", bg: "bg-orange-500/10", desc: "Shopee chat" },
  zalo: { name: "Zalo OA", icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Zalo Official Account" },
  web: { name: "Web Widget", icon: Globe, color: "text-green-500", bg: "bg-green-500/10", desc: "Website chat widget" },
};

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const shopId = useShopId();

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const data = await fetchChannels(shopId);
      setChannels(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: string) => {
    if (platform === "web") {
      // Web Widget: auto-activate, no OAuth
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
        const session = await import("next-auth/react").then(m => m.getSession());
        await fetch(`${API_BASE}/admin/channels/callback/web`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session?.user?.backendToken}` },
          body: JSON.stringify({ shop_id: shopId }),
        });
        await loadChannels();
      } catch (err) {
        console.error(err);
      }
      return;
    }
    try {
      const { url } = await getConnectUrl(platform, shopId);
      window.open(url, "_blank");
    } catch (err) {
      alert("Failed to get connect URL");
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Channels Management</h1>
          <p className="text-neutral-400">Kết nối và quản lý các nền tảng bán hàng của bạn.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <ShimmerButton onClick={() => loadChannels()}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Status
           </ShimmerButton>
        </div>
      </div>

      {/* Connection Guards / Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(PLATFORM_INFO).map(([id, info]) => (
          <div key={id} className="bg-black/40 border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
             <div className="flex items-center justify-between relative z-10">
                <div className={cn("p-3 rounded-2xl", info.bg)}>
                   <info.icon className={cn("h-6 w-6", info.color)} />
                </div>
                <button 
                  onClick={() => handleConnect(id)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                   <Plus className="h-5 w-5 text-white" />
                </button>
             </div>
             
             <div className="mt-6 relative z-10">
                <h3 className="text-lg font-bold">{info.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">
                   {id === "facebook" ? "Messenger & Fanpage" : `Kết nối tài khoản ${info.name}`}
                </p>
             </div>

             <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-colors" />
          </div>
        ))}
      </div>

      {/* Connected Channels List */}
      <div className="space-y-6">
         <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            Active Connections
         </h2>
         
         <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="h-32 bg-white/5 animate-pulse rounded-2xl" />
            ) : channels.length > 0 ? (
              channels.map((ch) => {
                const info = PLATFORM_INFO[ch.platform] || { name: ch.platform, icon: Zap, color: "text-white", bg: "bg-white/10" };
                const isExpiring = ch.expiresAt > 0 && (ch.expiresAt - Date.now()/1000 < 86400 * 3); // 3 days

                return (
                  <div key={ch.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.04] transition-colors group">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-neutral-800 to-black border border-white/10 flex items-center justify-center overflow-hidden">
                           {ch.avatar ? (
                             <img src={ch.avatar} alt={ch.name} className="h-full w-full object-cover" />
                           ) : (
                             <info.icon className={cn("h-6 w-6", info.color)} />
                           )}
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                             <h4 className="font-bold text-white">{ch.name || "Unnamed Shop"}</h4>
                             <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-bold uppercase">
                               Active
                             </span>
                           </div>
                           <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-neutral-500 flex items-center gap-1">
                                 <info.icon className="h-3 w-3" /> {info.name}
                              </span>
                              <span className="text-xs text-neutral-600">•</span>
                              <span className="text-xs text-neutral-500 font-mono">ID: {ch.pageId}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-4">
                         {isExpiring && (
                           <div className="flex items-center gap-1.5 text-yellow-500 text-xs font-medium px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                              <AlertTriangle className="h-3 w-3" />
                              Expiring Soon
                           </div>
                         )}
                         {ch.platform === "web" ? (
                           <button
                             onClick={() => {
                               navigator.clipboard.writeText(`<script src="https://omni-deploy.onrender.com/embed.js" data-shop-id="${shopId}"></script>`);
                               setCopiedId(ch.id);
                               setTimeout(() => setCopiedId(null), 2000);
                             }}
                             className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                           >
                              {copiedId === ch.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              {copiedId === ch.id ? "Copied!" : "Embed Code"}
                           </button>
                         ) : (
                           <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
                              <ExternalLink className="h-4 w-4" />
                              Configure
                           </button>
                         )}
                      </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl text-neutral-600">
                 <ShieldCheck className="h-12 w-12 opacity-20 mb-4" />
                 <p>No active channels. Start by connecting a platform above.</p>
              </div>
            )}
         </div>
      </div>

      {/* Integration Guides — merged từ Settings cũ */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Code2 className="h-5 w-5 text-blue-400" />
          Integration Guides
        </h2>

        {/* Web Widget */}
        <div className="rounded-[2.5rem] border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-transparent p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Web Chat Widget</h3>
              <p className="text-sm text-neutral-400">Nhúng AI vào Website hoặc Landing Page của bạn.</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-neutral-300">Copy đoạn code này và dán vào cuối thẻ <code className="text-blue-400">&lt;body&gt;</code> của website:</p>
            <div className="relative group">
              <pre className="bg-black/60 p-6 rounded-2xl border border-white/10 text-blue-400 text-sm font-mono overflow-x-auto">
                {`<script 
  src="https://cdn.omni-ai.com/widget.js" 
  data-shop-id="${shopId}"
  async
></script>`}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`<script src="https://cdn.omni-ai.com/widget.js" data-shop-id="${shopId}" async></script>`);
                  setCopiedId("embed");
                  setTimeout(() => setCopiedId(null), 2000);
                }}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white text-neutral-400 hover:text-black rounded-xl transition-all"
              >
                {copiedId === "embed" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Platform Setup Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2rem] space-y-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-pink-500" />
              <h4 className="font-bold">TikTok Shop Integration</h4>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              1. Đăng nhập TikTok Seller Center.<br/>
              2. Tìm mục <strong>App & Service Control</strong>.<br/>
              3. Subscribe Webhook URL của hệ thống OmniAI.<br/>
              4. Hoàn tất kết nối tại menu <strong>Channels</strong>.
            </p>
            <button className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest pt-2">
              Xem hướng dẫn chi tiết <ExternalLink className="h-3 w-3" />
            </button>
          </div>

          <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2rem] space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              <h4 className="font-bold">Shopee Integration</h4>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              1. Truy cập Shopee Open Platform.<br/>
              2. Kết nối Shop của bạn với App ID <code className="text-blue-400">OMNI-AI-PRO</code>.<br/>
              3. Grant permission cho mục Chat & Webhook.<br/>
              4. Token sẽ tự động được gia hạn mỗi 365 ngày.
            </p>
            <button className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest pt-2">
              Xem hướng dẫn chi tiết <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

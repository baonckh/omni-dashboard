"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchBots, saveBot } from "@/lib/api";
import { Plus, Bot, ChevronRight, Hash } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useShopId } from "@/lib/use-shop";

export default function BotsListPage() {
  const shopId = useShopId();
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = async () => {
    setLoading(true);
    try {
      const data = await fetchBots(shopId);
      setBots(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      // Create an empty new bot via POST API (omitting ID forces create on backend logic)
      const res = await saveBot(shopId, "", {
        botName: "Nhân viên mới",
        persona: "Chưa có thông tin",
        tone: "Chuyên nghiệp",
        greeting: "Xin chào",
        rules: [],
        scenarios: []
      });
      // Navigate or reload
      if (res?.data?.id) {
        window.location.href = `/bots/${res.data.id}`;
      } else {
        loadBots();
      }
    } catch (e) {
      alert("Lỗi khi tạo bot mới!");
      console.error(e);
    }
  };

  if (loading) {
    return <div className="p-8 text-neutral-400">Đang tải danh sách AI Bots...</div>;
  }

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bot className="h-8 w-8 text-indigo-500" /> AI Bot Manager
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            Quản lý đội ngũ nhân sự Trí Tuệ Nhân Tạo (Agents). Tạo bot bán hàng, CSKH chuyên biệt.
          </p>
        </div>
        <ShimmerButton onClick={handleCreateNew} className="px-6">
          <Plus className="h-4 w-4 mr-2" /> Tạo Bot Mới
        </ShimmerButton>
      </div>

      {bots.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-white/10 rounded-[2.5rem] bg-black/40">
           <Bot className="h-12 w-12 text-white/20 mx-auto mb-4" />
           <p className="text-neutral-500 text-sm">Cửa hàng của bạn chưa có Agent nào hoạt động.</p>
           <button onClick={handleCreateNew} className="mt-4 text-indigo-400 text-sm hover:text-indigo-300 font-bold">Khởi tạo nhân viên đầu tiên &rarr;</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot, idx) => (
            <Link key={bot.id || idx} href={`/bots/${bot.id}`}>
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/5 p-6 rounded-3xl hover:border-indigo-500/30 transition-all group flex flex-col h-full cursor-pointer relative overflow-hidden">
                {bot.isDefault && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-[9px] font-bold text-white px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Default 🍁
                  </div>
                )}
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">{bot.botName || "Unnamed Bot"}</h3>
                <p className="text-xs text-neutral-500 line-clamp-2 mb-6 flex-1">{bot.persona || "Chưa thiết lập tiểu sử"}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <span className="text-[10px] uppercase font-bold text-neutral-600 flex items-center gap-1">
                      <Hash className="h-3 w-3" /> {(bot.scenarios || []).length} Proxy Rules
                    </span>
                    <span className="text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                        Cấu hình <ChevronRight className="h-4 w-4 ml-1" />
                    </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

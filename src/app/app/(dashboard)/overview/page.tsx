"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  MessageSquare, 
  Zap, 
  TrendingUp, 
  ArrowUpRight,
  MousePointerClick,
  Bot,
  ShieldCheck,
  Globe,
  Smartphone,
  CheckCircle2
} from "lucide-react";
import { useShopId } from "@/lib/use-shop";
import { fetchAnalytics } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const shopId = useShopId();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const a = await fetchAnalytics(shopId);
      setAnalytics(a);
    } catch (err) {
      console.error(err);
    }
  };

  const cards = [
    { name: "Total Leads", value: analytics?.totalLeads || 0, icon: Users, color: "text-blue-500", trend: "+12%" },
    { name: "AI Conversations", value: analytics?.totalMessages || 0, icon: MessageSquare, color: "text-purple-500", trend: "+24%" },
    { name: "AI Success Rate", value: (analytics?.successRate || 0) + "%", icon: Bot, color: "text-green-500", trend: "Stable" },
    { name: "Active Channels", value: "3", icon: Zap, color: "text-amber-500", trend: "Max" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-neutral-500 mt-1">Chào mừng sếp quay lại! Hệ thống OmniAI đang hoạt động tốt trên mọi nền tảng.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-neutral-400">System Status: Optimal</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="group p-6 bg-white/[0.03] border border-white/10 rounded-3xl hover:bg-white/[0.05] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
               <div className={cn("p-2 rounded-2xl bg-white/5", card.color)}>
                  <card.icon className="h-5 w-5" />
               </div>
               <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{card.trend}</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-neutral-500">{card.name}</h3>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Growth Chart (Simplified Mock) */}
        <div className="lg:col-span-2 p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="h-32 w-32" />
           </div>
           
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold">Lead Growth</h3>
                <p className="text-xs text-neutral-500">Thống kê số lượng khách hàng tiềm năng 7 ngày qua</p>
              </div>
              <select className="bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
              </select>
           </div>

           <div className="flex items-end justify-between h-48 gap-2">
              {analytics?.leadGrowth?.map((g: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                   <div className="w-full relative">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 group-hover/bar:from-blue-500 group-hover/bar:to-blue-300 shadow-[0_0_20px_rgba(37,99,235,0.2)]" 
                        style={{ height: `${(g.count / (Math.max(...analytics.leadGrowth.map((x:any)=>x.count)) || 1)) * 120 + 20}px` }}
                      >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                            {g.count}
                         </div>
                      </div>
                   </div>
                   <span className="text-[10px] text-neutral-500 font-medium uppercase">{g.date}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Platform Distribution */}
        <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] flex flex-col justify-between">
           <div>
              <h3 className="text-lg font-bold mb-6">Channel Performance</h3>
              <div className="space-y-6">
                 {analytics?.platformStats?.map((ps: any, i: number) => (
                   <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                         <span className="flex items-center gap-2">
                            {ps.platform === "TIKTOK" ? <Smartphone className="h-3 w-3 text-pink-500" /> : <Globe className="h-3 w-3 text-blue-500" />}
                            {ps.platform}
                         </span>
                         <span className="font-bold">{ps.count} Leads</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <div 
                           className={cn(
                             "h-full rounded-full transition-all duration-1000",
                             ps.platform === "TIKTOK" ? "bg-pink-500" : "bg-blue-500"
                           )}
                           style={{ width: `${(ps.count / (analytics.totalLeads || 1)) * 100}%` }}
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="pt-8 border-t border-white/5 space-y-3">
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Optimization Tip</p>
              <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-start gap-3">
                 <Zap className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                 <p className="text-[11px] text-neutral-400">Dữ liệu cho thấy **TikTok** đang có tỉ lệ chuyển đổi cao nhất. Hãy điều hướng AI ưu tiên chốt đơn tại đây.</p>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}

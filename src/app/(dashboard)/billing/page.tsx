"use client";
import React, { useState, useEffect } from "react";
import { CreditCard, TrendingUp, BarChart3, PieChart, Calendar, ArrowUpRight, DollarSign, Zap } from "lucide-react";
import { Card, SectionHeader, SHOP_ID } from "@/app/(dashboard)/bots/[botId]/components/shared";
import { getUsageStats } from "@/lib/api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getUsageStats(SHOP_ID, dateRange.from, dateRange.to);
      setStats(data.stats || []);
      setTotalCost(data.total_cost || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const maxTokens = Math.max(...stats.map((s) => s.total_tokens), 1);

  return (
    <div className="space-y-6 pb-8">
      <SectionHeader 
        title="Usage & Billing" 
        subtitle="Theo dõi chi phí và mức độ sử dụng Token của các AI Model" 
        icon={CreditCard} 
      />

      {/* Date Filter & Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex gap-4 items-center">
            <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Từ ngày</label>
                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5">
                    <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                    <input 
                        type="date" 
                        value={dateRange.from} 
                        onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                        className="bg-transparent text-xs text-white focus:outline-none"
                    />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Đến ngày</label>
                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5">
                    <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                    <input 
                        type="date" 
                        value={dateRange.to} 
                        onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                        className="bg-transparent text-xs text-white focus:outline-none"
                    />
                </div>
            </div>
        </div>

        <button 
            onClick={fetchStats}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
            <TrendingUp className="h-4 w-4" /> Làm mới dữ liệu
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <DollarSign className="h-16 w-16 text-amber-500" />
            </div>
            <div className="relative z-10">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Tổng chi phí dự kiến</span>
                <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">${totalCost.toFixed(4)}</span>
                    <span className="text-xs text-neutral-500 font-medium">USD</span>
                </div>
                <p className="mt-2 text-xs text-neutral-500 leading-relaxed">Chi phí được tính dựa trên số lượng token in/out thực tế của các provider.</p>
            </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group"
        >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Zap className="h-16 w-16 text-cyan-500" />
            </div>
            <div className="relative z-10">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Tổng Token Tiêu thụ</span>
                <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{stats.reduce((acc, s) => acc + s.total_tokens, 0).toLocaleString()}</span>
                    <span className="text-xs text-neutral-500 font-medium">tokens</span>
                </div>
                <p className="mt-2 text-xs text-neutral-500 leading-relaxed">Bao gồm cả Prompt Token và Completion Token từ tất cả các models.</p>
            </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group"
        >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-16 w-16 text-purple-500" />
            </div>
            <div className="relative z-10">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Model hoạt động nhất</span>
                <div className="mt-1">
                    <span className="text-2xl font-black text-white truncate block">
                        {stats.length > 0 ? stats.sort((a,b) => b.total_tokens - a.total_tokens)[0].model : "N/A"}
                    </span>
                </div>
                <p className="mt-2 text-xs text-neutral-500 leading-relaxed">Model chiếm tỷ trọng lớn nhất trong tổng số token tiêu thụ của shop.</p>
            </div>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Token Usage by Model" icon={BarChart3}>
            <div className="space-y-6 py-2">
                {loading ? (
                    <div className="p-12 text-center text-neutral-600 animate-pulse text-xs font-bold">Đang tải dữ liệu...</div>
                ) : stats.length === 0 ? (
                    <div className="p-12 text-center text-neutral-600 text-xs font-bold italic">Chưa có dữ liệu tiêu thụ trong khoảng thời gian này.</div>
                ) : (
                    stats.map((s, i) => (
                        <div key={s.model} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-neutral-200">{s.model}</span>
                                    <span className="text-[10px] text-neutral-500 font-medium">Chi phí: <span className="text-amber-500/80">${s.total_cost.toFixed(4)}</span></span>
                                </div>
                                <span className="text-[10px] font-bold text-neutral-400">{s.total_tokens.toLocaleString()} tokens</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(s.total_tokens / maxTokens) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                                    className={cn(
                                        "h-full rounded-full",
                                        i % 3 === 0 ? "bg-amber-500" : i % 3 === 1 ? "bg-cyan-500" : "bg-purple-500"
                                    )}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>

        <Card title="Model Cost Ratio" icon={PieChart}>
            <div className="flex flex-col h-full justify-center">
                {loading ? (
                    <div className="p-12 text-center text-neutral-600 animate-pulse text-xs font-bold">Đang tải biểu đồ...</div>
                ) : stats.length === 0 ? (
                    <div className="p-12 text-center text-neutral-600 text-xs font-bold italic">Không có dữ liệu chi phí.</div>
                ) : (
                    <div className="space-y-3">
                         {stats.map((s, i) => {
                             const ratio = (s.total_cost / totalCost) * 100;
                             if (totalCost === 0) return null;
                             return (
                                <div key={s.model} className="flex items-center gap-4 group">
                                    <div className={cn(
                                        "h-3 w-3 rounded-sm shrink-0",
                                        i % 3 === 0 ? "bg-amber-500" : i % 3 === 1 ? "bg-cyan-500" : "bg-purple-500"
                                    )} />
                                    <div className="flex-1 flex justify-between items-center border-b border-white/[0.03] py-2 group-hover:border-white/10 transition-colors">
                                        <span className="text-xs font-bold text-neutral-400">{s.model}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-white">{ratio.toFixed(1)}%</span>
                                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                                 <div className={cn("h-full", i % 3 === 0 ? "bg-amber-500" : i % 3 === 1 ? "bg-cyan-500" : "bg-purple-500")} style={{ width: `${ratio}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             );
                         })}
                    </div>
                )}

                <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-4">
                     <div className="bg-amber-500/20 p-2 rounded-xl">
                        <ArrowUpRight className="h-4 w-4 text-amber-500" />
                     </div>
                     <div>
                        <h4 className="text-xs font-bold text-amber-500">Mẹo tối ưu chi phí</h4>
                        <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">Sử dụng các model nén như <b>text-embedding-3-small</b> hoặc <b>gemini-flash</b> để tiết kiệm tới 90% chi phí trong khi vẫn giữ được độ chính xác trên 95% cho các tác vụ RAG thông thường.</p>
                     </div>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
}

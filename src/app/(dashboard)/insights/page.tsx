"use client";

import React, { useEffect, useState } from "react";
import { 
  BrainCircuit, 
  Target, 
  TrendingUp, 
  MessageSquare, 
  ShieldCheck,
  Zap
} from "lucide-react";
import { fetchInsights } from "@/lib/api";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";

type Insight = {
  id: string;
  externalUserId: string;
  analysis: {
    funnelStage: string;
    behaviorTags: string[];
    sentiment: string;
    psychologicalProfile: string;
    summary: string;
  };
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const shopId = "test_shop";

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const data = await fetchInsights(shopId);
      setInsights(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Customer Insights</h1>
           <p className="text-neutral-400">AI phác họa chân dung và hành vi khách hàng dựa trên hội thoại.</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
           <Zap className="h-3 w-3 text-yellow-400 fill-yellow-400" />
           AI Analysis Active
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="h-80 bg-white/5 animate-pulse rounded-2xl" />
           ))}
        </div>
      ) : insights.length > 0 ? (
        <div className="space-y-12">
          {insights.map((insight) => (
            <div key={insight.id} className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                     <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                       Profile: {insight.externalUserId.slice(0, 12)}...
                       <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-neutral-500 border border-white/5">
                         {insight.analysis?.funnelStage || "AWARENESS"}
                       </span>
                    </h2>
                  </div>
               </div>

               <BentoGrid>
                  <BentoCard
                    name="Tâm lý & Hành vi"
                    className="col-span-2"
                    description={insight.analysis?.psychologicalProfile || "Đang phân tích dữ liệu tâm lý khách hàng..."}
                    Icon={Target}
                    cta="Chi tiết phân tích"
                    href="#"
                    background={<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />}
                  />
                  <BentoCard
                    name="Tóm tắt AI"
                    className="col-span-1"
                    description={insight.analysis?.summary || "AI đang tổng hợp nội dung cuộc hội thoại..."}
                    Icon={MessageSquare}
                    cta="Xem chat log"
                    href="#"
                    background={<div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />}
                  />
                  <BentoCard
                    name="Tags Hành vi"
                    className="col-span-1"
                    description={insight.analysis?.behaviorTags?.join(", ") || "Chưa có tag"}
                    Icon={TrendingUp}
                    cta="Gắn tag thủ công"
                    href="#"
                    background={<div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />}
                  />
                  <BentoCard
                    name="Sentiment"
                    className="col-span-1"
                    description={insight.analysis?.sentiment || "Neutral"}
                    Icon={ShieldCheck}
                    cta="Báo cáo cảm xúc"
                    href="#"
                    background={<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />}
                  />
               </BentoGrid>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl text-neutral-500 space-y-4">
           <BrainCircuit className="h-12 w-12 opacity-20" />
           <p>Chưa có đủ dữ liệu hội thoại để phác họa chân dung khách hàng.</p>
        </div>
      )}
    </div>
  );
}

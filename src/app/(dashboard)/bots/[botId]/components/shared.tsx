"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: any }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold flex items-center gap-2"><Icon className="h-5 w-5 text-neutral-500" /> {title}</h2>
      <p className="text-xs text-neutral-600 mt-0.5">{subtitle}</p>
    </div>
  );
}

export function Card({ title, icon: Icon, children, action, compact, className }: { title: string; icon: any; children: React.ReactNode; action?: React.ReactNode; compact?: boolean; className?: string }) {
  return (
    <div className={cn("bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden", className)}>
      <div className={cn("flex items-center justify-between border-b border-white/5", compact ? "px-3 py-2.5" : "px-5 py-3.5")}>
        <div className="flex items-center gap-2"><Icon className="h-3.5 w-3.5 text-neutral-500" /><h3 className="text-xs font-bold">{title}</h3></div>
        {action}
      </div>
      <div className={cn(compact ? "p-3" : "p-5", "space-y-3")}>{children}</div>
    </div>
  );
}

export function Field({ label, value, onChange, placeholder, multiline, rows }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; rows?: number }) {
  const cls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-neutral-700";
  return (
    <div>
      <label className="text-[10px] text-neutral-500 font-medium mb-1 block">{label}</label>
      {multiline ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows || 3} className={cn(cls, "resize-none")} /> : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />}
    </div>
  );
}

export const SHOP_ID = "test_shop";

export const TONES = [
  { value: "professional", label: "🏢 Chuyên nghiệp" },
  { value: "friendly", label: "😊 Thân thiện" },
  { value: "humorous", label: "🔥 Hài hước" },
  { value: "warm", label: "🏠 Ấm áp" },
  { value: "luxury", label: "💎 Sang trọng" },
];

export const DEFAULT_STAGES = [
  { order: 1, name: "Chào hỏi", description: "Giới thiệu bản thân", prompt: "Hãy chào khách hàng thân thiện, giới thiệu bạn là ai." },
  { order: 2, name: "Phân loại khách", description: "Xác nhận đối tượng", prompt: "Xác minh khách hàng có đúng đối tượng mục tiêu không." },
  { order: 3, name: "Tư vấn giá trị", description: "Giải thích USP", prompt: "Trình bày USP tập trung vào pain point của khách." },
  { order: 4, name: "Phân tích nhu cầu", description: "Hỏi mở nhu cầu sâu", prompt: "Đặt câu hỏi mở để khai thác nhu cầu sâu." },
  { order: 5, name: "Chốt đơn", description: "Đề xuất & thu SĐT", prompt: "Đề xuất sản phẩm phù hợp, tạo urgency và xin SĐT. Gọi report_lead khi có SĐT." },
];

export const PLATFORMS = [
  { id: "playground", name: "Sandbox" },
  { id: "facebook", name: "Messenger" },
  { id: "tiktok", name: "TikTok" },
  { id: "shopee", name: "Shopee" },
  { id: "web", name: "Web" },
];

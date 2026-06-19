"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "./Sidebar";
import { NotificationBell } from "./NotificationBell";
import { Store, ChevronDown, Check, Plus, Sparkles, BarChart3, ShoppingBag, Bot, ExternalLink } from "lucide-react";
import { fetchPlans, type PlanLimits } from "@/lib/plans";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const PLAN_LABELS: Record<string, string> = {
  beta: "Beta MVP",
  free: "Beta MVP",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

const PLAN_COLORS: Record<string, string> = {
  beta: "bg-purple-600/20 text-purple-300 border-purple-500/30 shadow-purple-500/10",
  free: "bg-purple-600/20 text-purple-300 border-purple-500/30 shadow-purple-500/10",
  pro: "bg-purple-600/20 text-purple-300 border-purple-500/30",
  starter: "bg-amber-600/15 text-amber-300 border-amber-500/15",
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const user = session?.user;
  const [shopOpen, setShopOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
              const [creating, setCreating] = useState(false);
  const [usage, setUsage] = useState<any>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const shops = user?.shops || [];
  const currentShopId = user?.shopId || "";
  const userPlan = user?.plan || "free";
  const [planLimits, setPlanLimits] = useState<PlanLimits>({ maxShops: 0, maxBots: 0, maxProducts: 0, maxConversationsPerMonth: 0, analyticsDays: 0, features: [] });
  const canCreateNewShop = shops.length < planLimits.maxShops;
  useEffect(() => { fetchPlans().then(plans => { const p = plans[userPlan]; if (p) setPlanLimits(p); }); }, [userPlan]);
  const planLabel = PLAN_LABELS[userPlan] || userPlan;

  // Fetch real usage from API
  useEffect(() => {
    if (!user?.backendToken || !user?.shopId) return;
    fetch(`${API_BASE}/admin/billing/${user.shopId}/usage`, {
      headers: { Authorization: `Bearer ${user.backendToken}` },
    }).then(r => r.json()).then(setUsage).catch(() => {});
  }, [user?.shopId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShopOpen(false);
      if (planRef.current && !planRef.current.contains(e.target as Node)) setPlanOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!planOpen) return;
    const fetchUsage = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/billing/${user?.shopId}/usage`, {
          headers: { Authorization: `Bearer ${user?.backendToken}` }
        });
        const data = await res.json();
        setUsage(data);
      } catch { /* ignore */ }
    };
    fetchUsage();
  }, [planOpen, user?.shopId, user?.backendToken]);

  const switchShop = async (shopId: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/shops/switch`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.backendToken}` },
        body: JSON.stringify({ shop_id: shopId }),
      });
      if (!res.ok) return;
      const data = await res.json();
      await update({ ...session, user: { ...user, backendToken: data.token, shopId: data.shop_id, shops: data.shops } });
      router.refresh();
    } catch (e) { console.error(e); }
    setShopOpen(false);
  };

  const createShop = async () => {
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/auth/shops/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.backendToken}` },
        body: JSON.stringify({ name: "Shop mới" }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.contact || data.error);
        setCreating(false);
        return;
      }
      await update({ ...session, user: { ...user, shops: data.shops } });
    } catch (e) { console.error(e); }
    setCreating(false);
    setShopOpen(false);
  };

  return (
    <div className="flex bg-[#050505] text-white min-h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto bg-gradient-to-br from-black to-[#0a0a0a]">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="text-white font-medium">OmniAI</span>
            <span className="text-neutral-600">/</span>
            <span>Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />

            {/* Shop Switcher */}
            <div className="relative" ref={shopRef}>
              <button onClick={() => setShopOpen(!shopOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs hover:bg-white/10 transition-colors"
              >
                <Store className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-white font-medium max-w-[100px] truncate">
                  {shops.find((s: any) => s.id === currentShopId)?.name || currentShopId}
                </span>
                <ChevronDown className="h-3 w-3 text-neutral-500" />
              </button>

              {shopOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#111] shadow-2xl shadow-black/50 py-2 z-50">
                  <p className="px-4 py-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Shops</p>
                  {shops.map((s: any) => (
                    <button key={s.id} onClick={() => switchShop(s.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                        <Store className="h-3 w-3 text-blue-400" />
                      </div>
                      <span className="flex-1 text-white">{s.name}</span>
                      {s.id === currentShopId && <Check className="h-3.5 w-3.5 text-blue-500" />}
                    </button>
                  ))}
                  <div className="border-t border-white/5 mt-1 pt-1">
                    <button onClick={createShop} disabled={creating || !canCreateNewShop}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50">
                      <Plus className="h-3.5 w-3.5" />
                      {creating ? "Đang tạo..." : !canCreateNewShop ? `Đã đạt giới hạn (${planLimits.maxShops} shop)` : "Tạo shop mới"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left leading-tight">
                <p className="text-xs font-medium text-white">{user?.name || user?.email || "User"}</p>
                <p className="text-[10px] text-neutral-500">{user?.email || ""}</p>
              </div>
              {/* Plan badge + dropdown */}
              <div className="hidden md:relative md:inline-block" ref={planRef}>
                <button
                  onClick={() => setPlanOpen(!planOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border-2 transition-all hover:opacity-80 shadow-lg ${PLAN_COLORS[userPlan] || PLAN_COLORS.free}`}
                >
                  <Sparkles className="h-3 w-3" />
                  {planLabel}
                  <ChevronDown className={`h-3 w-3 ml-0.5 transition-transform ${planOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {planOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-4 z-50">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                      <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                      <span className="text-xs font-bold text-white">{planLabel}</span>
                    </div>

                    <div className="space-y-2.5 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500 flex items-center gap-1.5"><ShoppingBag className="h-3 w-3" /> Shops</span>
                        <span className="text-zinc-300 font-medium">{usage?.shopCount ?? shops.length} / {planLimits.maxShops === 999 ? "∞" : planLimits.maxShops}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500 flex items-center gap-1.5"><Bot className="h-3 w-3" /> Bots</span>
                        <span className="text-zinc-300 font-medium">{usage?.botCount ?? "-"} / {planLimits.maxBots === 999 ? "∞" : planLimits.maxBots}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500 flex items-center gap-1.5"><BarChart3 className="h-3 w-3" /> Conversations</span>
                        <span className="text-zinc-300 font-medium">{usage?.conversationCount ?? "-"} / {planLimits.maxConversationsPerMonth === 999999 ? "∞" : planLimits.maxConversationsPerMonth.toLocaleString()}</span>
                      </div>
                    </div>

                    <Link
                      href="/app/billing"
                      onClick={() => setPlanOpen(false)}
                      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 transition-all"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Usage & Billing
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

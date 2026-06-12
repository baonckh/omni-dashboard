"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { NotificationBell } from "./NotificationBell";
import { Store, ChevronDown, Check, Plus, Sparkles } from "lucide-react";
import { getPlan } from "@/lib/plans";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const user = session?.user;
  const [shopOpen, setShopOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);
  const shops = user?.shops || [];
  const currentShopId = user?.shopId || "";
  const userPlan = user?.plan || "free";
  const planLimits = getPlan(userPlan);
  const canCreateNewShop = shops.length < planLimits.maxShops;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShopOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
              {/* Plan badge */}
              <div className={`hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${userPlan === "pro" ? "bg-purple-600/20 text-purple-300 border border-purple-500/20" : "bg-blue-600/15 text-blue-300 border border-blue-500/15"}`}>
                <Sparkles className="h-2.5 w-2.5" />
                {userPlan}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Store, Plus, Pencil, Check, X, Globe } from "lucide-react";
import { useSession } from "next-auth/react";
import { useShopId } from "@/lib/use-shop";
import { cn } from "@/lib/utils";

export default function ShopsPage() {
  const { data: session, update } = useSession();
  const currentShopId = useShopId();
  const shops = session?.user?.shops || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleSave = async (id: string) => {
    // ponytail: shop rename API not implemented yet, just optimistically update local
    setEditingId(null);
  };

  const handleCreate = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/auth/shops/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.backendToken}`,
          },
          body: JSON.stringify({ name: "Shop mới" }),
        }
      );
      if (res.ok) update();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-5xl space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Store className="h-8 w-8 text-emerald-400" />
          Shops & Brands
        </h1>
        <p className="text-neutral-400 mt-1">Quản lý các cửa hàng và thông tin thương hiệu.</p>
      </div>

      {/* Shop List */}
      <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Shops</h3>
              <p className="text-sm text-neutral-400">{shops.length} shop(s) connected.</p>
            </div>
          </div>
          <button onClick={handleCreate}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
            <Plus className="h-4 w-4" /> New Shop
          </button>
        </div>

        <div className="space-y-3">
          {shops.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl">
              <Store className="h-10 w-10 mx-auto text-neutral-700 mb-3" />
              <p className="text-sm text-neutral-600">No shops yet. Create one to get started.</p>
            </div>
          ) : shops.map((s: any) => (
            <div key={s.id} className={cn(
              "flex items-center justify-between p-5 rounded-2xl border transition-all",
              s.id === currentShopId
                ? "bg-emerald-600/5 border-emerald-500/20"
                : "bg-white/[0.02] border-white/5 hover:border-white/20"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                  s.id === currentShopId ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-neutral-500"
                )}>
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  {editingId === s.id ? (
                    <div className="flex items-center gap-2">
                      <input value={editName} onChange={(e) => setEditName(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white outline-none focus:border-emerald-500/50" />
                      <button onClick={() => handleSave(s.id)} className="p-1 hover:bg-white/10 rounded-lg text-green-400">
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1 hover:bg-white/10 rounded-lg text-neutral-500">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-white">{s.name || s.id}</p>
                  )}
                  <p className="text-[10px] text-neutral-600 font-mono mt-0.5">ID: {s.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {s.id === currentShopId && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                    Active
                  </span>
                )}
                <button onClick={() => handleEdit(s.id, s.name || "")}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-500 hover:text-white transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future: Shop Detail Config */}
      <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 space-y-6 opacity-60">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Shop Details</h3>
            <p className="text-sm text-neutral-400 italic">Cấu hình thương hiệu, domain, ngôn ngữ — sẽ có trong bản cập nhật sau.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Shop Name", "Domain", "Language", "Timezone"].map((f) => (
            <div key={f} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] font-bold text-neutral-500 uppercase">{f}</p>
              <p className="text-sm text-neutral-600 mt-1">—</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

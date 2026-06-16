"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Store, Bot, MessageSquare } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${API_BASE}/admin-panel/stats`, { headers })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
    fetch(`${API_BASE}/admin-panel/users`, { headers })
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => {});
  }, [router]);

  const [planChanging, setPlanChanging] = useState<string | null>(null);

  const handleChangePlan = async (userId: string, newPlan: string) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    setPlanChanging(userId);
    try {
      const res = await fetch(`${API_BASE}/admin-panel/users/${userId}/plan`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: newPlan }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u))
        );
      }
    } catch { /* ignore */ }
    setPlanChanging(null);
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats.totalUsers ?? "-", icon: Users, color: "blue" },
    { label: "Total Shops", value: stats.totalShops ?? "-", icon: Store, color: "emerald" },
    { label: "Total Bots", value: stats.totalBots ?? "-", icon: Bot, color: "purple" },
    { label: "Total Conversations", value: stats.totalConversations ?? "-", icon: MessageSquare, color: "amber" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-600/20 text-blue-300 border-blue-500/20",
    emerald: "bg-emerald-600/20 text-emerald-300 border-emerald-500/20",
    purple: "bg-purple-600/20 text-purple-300 border-purple-500/20",
    amber: "bg-amber-600/20 text-amber-300 border-amber-500/20",
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-extrabold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${colorMap[card.color]}`}>
                <card.icon className="h-4 w-4" />
              </div>
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                {card.label}
              </span>
            </div>
            <p className="text-3xl font-extrabold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-4">Users</h2>
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="text-left px-5 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">Plan</th>
              <th className="text-left px-5 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">Shops</th>
              <th className="text-left px-5 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4 text-white">{u.email}</td>
                <td className="px-5 py-4 text-zinc-300">{u.name || "-"}</td>
                <td className="px-5 py-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-600/20 text-purple-300 border border-purple-500/20">
                    {u.plan}
                  </span>
                </td>
                <td className="px-5 py-4 text-zinc-300">{u.shopCount ?? "-"}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-1">
                    {["free", "starter", "pro", "enterprise"].map((p) => (
                      <button
                        key={p}
                        onClick={() => handleChangePlan(u.id, p)}
                        disabled={planChanging === u.id || u.plan === p}
                        className={`text-[10px] px-2 py-1 rounded-lg border font-bold uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                          u.plan === p
                            ? "bg-purple-600/20 text-purple-300 border-purple-500/20"
                            : "bg-white/5 text-zinc-500 border-white/10 hover:text-white hover:border-white/20"
                        }`}
                      >
                        {p === u.plan ? "✓" : p.charAt(0).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-zinc-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

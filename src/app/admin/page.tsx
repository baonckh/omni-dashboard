"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Store, Bot, MessageSquare, Package, LogOut, Search, Trash2,
  RefreshCw,   Shield, Activity, Globe, Clock, Zap, ChevronDown, ExternalLink, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

function apiHeaders() {
  const token = localStorage.getItem("admin_token");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    loadStats();
    loadThreads();
  }, [router]);

  const loadStats = () => {
    fetch(`${API_BASE}/panel-api/stats`, { headers: apiHeaders() })
      .then(r => r.json()).then(d => { if (d && typeof d === 'object') setStats(d); }).catch(() => {});
  };

  const loadData = (endpoint: string, setter: (d: any) => void) => {
    setLoading(true);
    fetch(`${API_BASE}/panel-api/${endpoint}`, { headers: apiHeaders() })
      .then(r => r.json()).then(d => { if (d && Array.isArray(d[endpoint])) setter(d[endpoint]); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  const loadThreads = () => {
    fetch(`${API_BASE}/panel-api/threads`, { headers: apiHeaders() })
      .then(r => r.json()).then(d => { if (d && Array.isArray(d.threads)) setThreads(d.threads); }).catch(() => {});
  };

  const handleDelete = async (endpoint: string, id: string, setter: (d: any) => void) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`${API_BASE}/panel-api/${endpoint}/${id}`, { method: "DELETE", headers: apiHeaders() });
    loadData(endpoint, setter);
  };

  const statCards = stats ? [
    { label: "Total Users", value: stats.totalUsers ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Shops", value: stats.totalShops ?? 0, icon: Store, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "AI Bots", value: stats.totalBots ?? 0, icon: Bot, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Conversations", value: stats.totalConversations ?? 0, icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
  ] : [];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30">
            <Shield className="h-4 w-4 text-red-400" />
          </div>
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/20 font-bold uppercase">Super Admin</span>
        </div>
        <button onClick={() => { localStorage.removeItem("admin_token"); router.push("/admin/login"); }}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors">
          <LogOut className="h-3.5 w-3.5" /> Logout
        </button>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${c.bg}`}><c.icon className={`h-4 w-4 ${c.color}`} /></div>
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{c.label}</span>
              </div>
              <p className="text-2xl font-extrabold text-white">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Conversations */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-bold">Recent Conversations</h2>
              <span className="text-[10px] text-zinc-600">(Multi-tenant)</span>
            </div>
            <button onClick={loadThreads} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
              <RefreshCw className="h-3.5 w-3.5 text-zinc-500" />
            </button>
          </div>
          <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
            {threads.length === 0 ? (
              <div className="py-12 text-center text-zinc-600 text-sm">No conversations yet</div>
            ) : (
              threads.slice(0, 20).map((t: any) => (
                <div key={t._id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 shrink-0">
                        {(t.customerName || "?").charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{t.customerName || "Anonymous"}</p>
                        <p className="text-[10px] text-zinc-600">
                          Shop: {t.shop_id?.slice(0, 16) || "?"} · {t.platform || "?"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium",
                        t.status === "HUMAN_TAKEOVER" ? "bg-red-500/10 text-red-400" :
                        t.status === "BOT" ? "bg-green-500/10 text-green-400" :
                        "bg-blue-500/10 text-blue-400"
                      )}>
                        {t.status || "ACTIVE"}
                      </span>
                      <span className="text-[10px] text-zinc-600">{t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                  {t.lastMessage && (
                    <p className="text-xs text-zinc-500 mt-1 truncate pl-10">{t.lastMessage}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Overview + Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-x-auto">
            {["overview", "users", "shops", "bots", "channels", "products", "leads"].map((t) => (
              <button key={t} onClick={() => { setTab(t); if (t !== "overview" && t !== "threads") loadData(t, (data:any) => { if (t==="users") setUsers(data.users||data); if (t==="shops") setShops(data.shops||data); if (t==="bots") setBots(data.bots||data); if (t==="channels") setChannels(data.channels||data); if (t==="products") setProducts(data.products||data); if (t==="leads") setLeads(data.leads||data); }); }}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
                  tab === t ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white"
                )}
              >{t.charAt(0).toUpperCase() + t.slice(1)}</button>
            ))}
          </div>
          {tab !== "overview" && (
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-zinc-500" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..." className="bg-white/5 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none w-40" />
            </div>
          )}
        </div>

        {/* Tab Content */}
        {tab === "users" && <DataTable data={users} search={search} cols={["email", "name", "plan", "shopCount"]}
          onDelete={(id) => handleDelete("users", id, setUsers)} loading={loading} />}
        {tab === "shops" && <DataTable data={shops} search={search} cols={["name", "user_email", "plan"]}
          loading={loading} />}
        {tab === "bots" && <DataTable data={bots} search={search} cols={["botName", "shop_id", "tone"]}
          onDelete={(id) => handleDelete("bots", id, setBots)} loading={loading} />}
        {tab === "channels" && <DataTable data={channels} search={search} cols={["platform", "name", "shop_id", "isActive"]}
          onDelete={(id) => handleDelete("channels", id, setChannels)} loading={loading} />}
        {tab === "products" && <DataTable data={products} search={search} cols={["name", "category", "price", "shop_id"]}
          onDelete={(id) => handleDelete("products", id, setProducts)} loading={loading} />}
        {tab === "leads" && <DataTable data={leads} search={search} cols={["customerName", "phone", "platform", "status", "shop_id"]}
          loading={loading} />}
      </div>
    </div>
  );
}

function DataTable({ data, search, cols, onDelete, loading }: {
  data: any[]; search: string; cols: string[];
  onDelete?: (id: string) => void; loading?: boolean;
}) {
  const filtered = data.filter((row) =>
    cols.some((c) => String(row[c] || "").toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <Spinner />;

  return (
    <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            {cols.map((c) => (
              <th key={c} className="text-left px-4 py-3 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{c}</th>
            ))}
            {onDelete && <th className="px-4 py-3 w-16"></th>}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={cols.length + (onDelete ? 1 : 0)} className="px-4 py-12 text-center text-zinc-600 text-sm">No data</td></tr>
          ) : (
            filtered.map((row: any, i: number) => (
              <tr key={row._id || i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                {cols.map((c) => (
                  <td key={c} className="px-4 py-3 text-xs text-zinc-300 max-w-[200px] truncate">
                    {c === "price" ? `$${row[c]}` :
                     c === "isActive" ? <span className={row[c] ? "text-green-400" : "text-zinc-600"}>{row[c] ? "✅" : "❌"}</span> :
                     String(row[c] ?? "-")}
                  </td>
                ))}
                {onDelete && (
                  <td className="px-4 py-3">
                    <button onClick={() => onDelete(row._id)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                      <Trash2 className="h-3.5 w-3.5 text-zinc-600 hover:text-red-400" />
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}

// Need to import Shield


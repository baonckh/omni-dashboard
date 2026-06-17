"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Store, Bot, MessageSquare, Package, LogOut,
  Search, Trash2, RefreshCw, Shield, LayoutDashboard, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const SIDEBAR = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "chats", label: "Chats", icon: MessageSquare },
  { id: "users", label: "Users", icon: Users },
  { id: "shops", label: "Shops", icon: Store },
  { id: "bots", label: "Bots", icon: Bot },
  { id: "channels", label: "Channels", icon: MessageSquare },
  { id: "products", label: "Products", icon: Package },
  { id: "leads", label: "Leads", icon: Users },
];

function apiHeaders() {
  const token = localStorage.getItem("admin_token");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dataMap, setDataMap] = useState<Record<string, any[]>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    loadStats(); loadThreads();
  }, [router]);

  const loadStats = () => {
    fetch(`${API_BASE}/panel-api/stats`, { headers: apiHeaders() })
      .then(r => r.json()).then(d => { if (d && typeof d === 'object') setStats(d); }).catch(() => {});
  };
  const loadThreads = () => {
    fetch(`${API_BASE}/panel-api/threads`, { headers: apiHeaders() })
      .then(r => r.json()).then(d => { if (d && Array.isArray(d.threads)) setThreads(d.threads); }).catch(() => {});
  };

  const loadTabData = (tabId: string) => {
    if (tabId === "overview") return;
    setLoading(true);
    const endpoint = tabId === "chats" ? "threads" : tabId;
    fetch(`${API_BASE}/panel-api/${endpoint}`, { headers: apiHeaders() })
      .then(r => r.json())
      .then(d => { if (d && Array.isArray(d[endpoint])) setDataMap(prev => ({ ...prev, [tabId]: d[endpoint] })); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleTabChange = (t: string) => {
    setTab(t);
    setSearch("");
    if (t !== "overview" && !dataMap[t]) loadTabData(t);
  };

  const handleDelete = async (endpoint: string, id: string) => {
    if (!confirm("Delete?")) return;
    const apiEndpoint = endpoint === "chats" ? "threads" : endpoint;
    await fetch(`${API_BASE}/panel-api/${apiEndpoint}/${id}`, { method: "DELETE", headers: apiHeaders() });
    loadTabData(endpoint);
  };

  const handleLogout = () => { localStorage.removeItem("admin_token"); router.push("/admin/login"); };

  const Spinner = () => <div className="flex items-center justify-center py-16"><div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;
  const currentData = dataMap[tab] || [];
  const filtered = currentData.filter((row: any) =>
    Object.values(row).some((v: any) => String(v || "").toLowerCase().includes(search.toLowerCase()))
  );

  const statCards = stats ? [
    { label: "Total Users", value: stats.totalUsers ?? 0, icon: Users },
    { label: "Total Shops", value: stats.totalShops ?? 0, icon: Store },
    { label: "AI Bots", value: stats.totalBots ?? 0, icon: Bot },
    { label: "Conversations", value: stats.totalConversations ?? 0, icon: MessageSquare },
  ] : [];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      {/* Sidebar */}
      <aside className={cn(
        "border-r border-white/5 bg-black/40 flex flex-col transition-all duration-200 shrink-0",
        sidebarOpen ? "w-52" : "w-14"
      )}>
        {/* Logo */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-white/5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 shrink-0">
            <Shield className="h-4 w-4 text-red-400" />
          </div>
          {sidebarOpen && <span className="text-sm font-bold">Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto p-1 hover:bg-white/5 rounded-lg">
            {sidebarOpen ? <X className="h-3.5 w-3.5 text-zinc-500" /> : <Menu className="h-3.5 w-3.5 text-zinc-500" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {SIDEBAR.map((item) => (
            <button key={item.id} onClick={() => handleTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                tab === item.id ? "bg-blue-600/20 text-blue-300" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-white/5">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-all">
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Overview */}
          {tab === "overview" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((c) => (
                  <div key={c.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-white/5"><c.icon className="h-4 w-4 text-zinc-400" /></div>
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
                  <button onClick={loadThreads} className="p-1.5 hover:bg-white/5 rounded-lg">
                    <RefreshCw className="h-3.5 w-3.5 text-zinc-500" />
                  </button>
                </div>
                <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
                  {threads.length === 0 ? (
                    <div className="py-12 text-center text-zinc-600 text-sm">No conversations yet</div>
                  ) : (
                    threads.slice(0, 30).map((t: any) => (
                      <div key={t._id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 shrink-0">
                              {(t.customerName || "?").charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">{t.customerName || "Anonymous"}</p>
                              <p className="text-[10px] text-zinc-600">Shop: {(t.shop_id || "").slice(0, 16)} · {t.platform || "?"}</p>
                            </div>
                          </div>
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0", t.status === "HUMAN_TAKEOVER" ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400")}>
                            {t.status || "ACTIVE"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* Chats Tab — expanded view */}
          {tab === "chats" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">All Conversations</h2>
                <button onClick={() => loadTabData("chats")} className="p-1.5 hover:bg-white/5 rounded-lg">
                  <RefreshCw className="h-3.5 w-3.5 text-zinc-500" />
                </button>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/5">
                {loading ? <Spinner /> : filtered.length === 0 ? <div className="py-12 text-center text-zinc-600 text-sm">No conversations</div> :
                filtered.map((t: any) => (
                  <div key={t._id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {(t.customerName || "?").charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{t.customerName || "Anonymous"}</p>
                          <p className="text-[10px] text-zinc-600">Shop: {(t.shop_id || "").slice(0, 20)} · Platform: {t.platform || "?"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", t.status === "HUMAN_TAKEOVER" ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400")}>
                          {t.status || "ACTIVE"}
                        </span>
                        <span className="text-[10px] text-zinc-600">{t.updatedAt ? new Date(t.updatedAt).toLocaleString() : ""}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-zinc-600 mt-1 ml-11">
                      {t.tags?.length > 0 && <span>Tags: {t.tags.join(", ")}</span>}
                      {t.sentiment && <span>Sentiment: {t.sentiment}</span>}
                    </div>
                    <button onClick={() => handleDelete("chats", t._id)} className="mt-2 ml-11 text-[10px] text-zinc-600 hover:text-red-400 transition-colors">Delete</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Users Tab — with Plan management */}
          {tab === "users" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">Users</h2>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search email..." className="bg-white/5 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none w-48" />
              </div>
              <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="text-left px-4 py-3 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Email</th>
                      <th className="text-left px-4 py-3 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Name</th>
                      <th className="text-left px-4 py-3 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Plan</th>
                      <th className="text-left px-4 py-3 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Shops</th>
                      <th className="text-left px-4 py-3 w-24"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? <tr><td colSpan={5} className="px-4 py-16 text-center"><Spinner /></td></tr> :
                    filtered.map((u: any) => (
                      <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-xs text-white">{u.email}</td>
                        <td className="px-4 py-3 text-xs text-zinc-300">{u.name || "-"}</td>
                        <td className="px-4 py-3">
                          <select value={u.plan || "free"} onChange={async (e) => {
                            const newPlan = e.target.value;
                            await fetch(`${API_BASE}/panel-api/users/${u._id}/plan`, { method: "PUT", headers: apiHeaders(), body: JSON.stringify({ plan: newPlan }) });
                            loadTabData("users");
                          }} className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none focus:border-purple-500/50">
                            <option value="beta" className="bg-zinc-900">Beta MVP</option>
                            <option value="free" className="bg-zinc-900">Free</option>
                            <option value="starter" className="bg-zinc-900">Starter</option>
                            <option value="pro" className="bg-zinc-900">Pro</option>
                            <option value="enterprise" className="bg-zinc-900">Enterprise</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-300">{u.shopCount ?? "-"}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDelete("users", u._id)} className="p-1 hover:bg-white/10 rounded-lg">
                            <Trash2 className="h-3.5 w-3.5 text-zinc-600 hover:text-red-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Other data tabs (auto table) */}
          {tab !== "overview" && tab !== "chats" && tab !== "users" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold capitalize">{tab}</h2>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..." className="bg-white/5 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none w-48" />
              </div>
              <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      {filtered.length > 0 && Object.keys(filtered[0]).filter(k => k !== '_id' && k !== 'password').slice(0, 6).map((k) => (
                        <th key={k} className="text-left px-4 py-3 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{k}</th>
                      ))}
                      <th className="px-4 py-3 w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? <tr><td colSpan={7} className="px-4 py-16 text-center"><Spinner /></td></tr> :
                    filtered.length === 0 ? <tr><td colSpan={7} className="px-4 py-12 text-center text-zinc-600 text-sm">No data</td></tr> :
                    filtered.map((row: any, i: number) => (
                      <tr key={row._id || i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        {Object.entries(row).filter(([k]) => k !== '_id' && k !== 'password').slice(0, 6).map(([k, v]: [string, any]) => (
                          <td key={k} className="px-4 py-3 text-xs text-zinc-300 max-w-[200px] truncate">
                            {k === 'isActive' ? <span className={v ? "text-green-400" : "text-zinc-600"}>{v ? "Active" : "Inactive"}</span> :
                             String(v ?? "-")}
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          <button onClick={() => handleDelete(tab, row._id)} className="p-1 hover:bg-white/10 rounded-lg">
                            <Trash2 className="h-3.5 w-3.5 text-zinc-600 hover:text-red-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

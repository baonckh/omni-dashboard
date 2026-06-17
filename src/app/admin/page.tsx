"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Store, Bot, Hash, MessageSquare, Package, UserPlus,
  LogOut, Search, Trash2, ChevronDown, ChevronUp, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const TABS = ["users", "shops", "bots", "channels", "threads", "products", "leads"] as const;

const ICONS: Record<string, React.ElementType> = {
  users: Users, shops: Store, bots: Bot, channels: Hash,
  threads: MessageSquare, products: Package, leads: UserPlus,
};

function apiHeaders() {
  const token = localStorage.getItem("admin_token");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

type Tab = (typeof TABS)[number];

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="text-center text-zinc-500 py-12">{label}</p>;
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <p className="text-red-400 text-sm">Failed to load data</p>
      <button onClick={onRetry} className="flex items-center gap-1.5 bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors">
        <RefreshCw className="h-3.5 w-3.5" /> Retry
      </button>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="w-full bg-white/5 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-blue-500/50 placeholder:text-zinc-600"
      />
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  const [planChanging, setPlanChanging] = useState<string | null>(null);
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<Record<string, any[]>>({});

  const [searchEmail, setSearchEmail] = useState("");
  const [searchShopName, setSearchShopName] = useState("");
  const [filterShopId, setFilterShopId] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [channelShopId, setChannelShopId] = useState("");
  const [threadShopId, setThreadShopId] = useState("");

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return false; }
    return true;
  }, [router]);

  const fetchData = useCallback(async (t: Tab) => {
    if (!checkAuth()) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${API_BASE}/panel-api/${t}`, { headers: apiHeaders() });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const key = t === "users" ? "users" : t === "shops" ? "shops" : t === "bots" ? "bots" : t === "channels" ? "channels" : t === "threads" ? "threads" : t === "products" ? "products" : "leads";
      const list = Array.isArray(data[key]) ? data[key] : [];
      if (t === "users") setUsers(list);
      else if (t === "shops") setShops(list);
      else if (t === "bots") setBots(list);
      else if (t === "channels") setChannels(list);
      else if (t === "threads") setThreads(list);
      else if (t === "products") setProducts(list);
      else setLeads(list);
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [checkAuth]);

  useEffect(() => { fetchData(tab); }, [tab, fetchData]);

  const handleLogout = () => { localStorage.removeItem("admin_token"); router.push("/admin/login"); };

  const handleChangePlan = async (userId: string, newPlan: string) => {
    setPlanChanging(userId);
    try {
      const res = await fetch(`${API_BASE}/panel-api/users/${userId}/plan`, {
        method: "PATCH", headers: apiHeaders(), body: JSON.stringify({ plan: newPlan }),
      });
      if (res.ok) setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u)));
    } catch {}
    setPlanChanging(null);
  };

  const handleDelete = async (endpoint: string, id: string, listKey: Tab, setter: (v: any[]) => void, list: any[]) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`${API_BASE}/panel-api/${endpoint}/${id}`, { method: "DELETE", headers: apiHeaders() });
      if (res.ok) setter(list.filter((item: any) => item.id !== id));
    } catch {}
  };

  const toggleThread = async (threadId: string) => {
    if (expandedThread === threadId) { setExpandedThread(null); return; }
    setExpandedThread(threadId);
    if (!threadMessages[threadId]) {
      try {
        const res = await fetch(`${API_BASE}/panel-api/threads/${threadId}/messages`, { headers: apiHeaders() });
        if (res.ok) {
          const data = await res.json();
          setThreadMessages((prev) => ({ ...prev, [threadId]: Array.isArray(data.messages) ? data.messages : [] }));
        }
      } catch {}
    }
  };

  const filteredUsers = users.filter((u) => u.email?.toLowerCase().includes(searchEmail.toLowerCase()));
  const filteredShops = shops.filter((s) => s.name?.toLowerCase().includes(searchShopName.toLowerCase()));
  const filteredBots = bots.filter((b) => !filterShopId || b.shop_id?.includes(filterShopId));
  const filteredChannels = channels.filter((c) => !channelShopId || c.shop_id?.includes(channelShopId));
  const filteredThreads = threads.filter((t) => !threadShopId || t.shop_id?.includes(threadShopId));
  const filteredProducts = products.filter((p) => p.name?.toLowerCase().includes(searchProduct.toLowerCase()));

  const renderTable = (content: React.ReactNode) => (
    <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
      <table className="w-full text-sm">{content}</table>
    </div>
  );

  const th = (label: string) => (
    <th className="text-left px-5 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">{label}</th>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors">
          <LogOut className="h-3.5 w-3.5" /> Logout
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl w-fit mb-6 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = ICONS[t];
          return (
            <button key={t} onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap",
                tab === t ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" /> {t}
            </button>
          );
        })}
      </div>

      {loading && <Spinner />}
      {error && !loading && <ErrorState onRetry={() => fetchData(tab)} />}

      {!loading && !error && tab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SearchInput value={searchEmail} onChange={setSearchEmail} placeholder="Search by email..." />
            <span className="text-xs text-zinc-500">{filteredUsers.length} users</span>
          </div>
          {renderTable(
            <>
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  {th("Email")} {th("Name")} {th("Plan")} {th("Shops")} {th("Actions")}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u: any) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-white">{u.email}</td>
                    <td className="px-5 py-4 text-zinc-300">{u.name || "-"}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-600/20 text-purple-300 border border-purple-500/20">
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-300">{u.shopCount ?? "-"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <select value={u.plan} onChange={(e) => handleChangePlan(u.id, e.target.value)}
                          disabled={planChanging === u.id}
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-purple-500/50 disabled:opacity-50"
                        >
                          <option value="beta" className="bg-zinc-900">Beta MVP</option>
                          <option value="free" className="bg-zinc-900">Free</option>
                          <option value="starter" className="bg-zinc-900">Starter</option>
                          <option value="pro" className="bg-zinc-900">Pro</option>
                          <option value="enterprise" className="bg-zinc-900">Enterprise</option>
                        </select>
                        {planChanging === u.id && <span className="text-[10px] text-purple-400">...</span>}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && <tr><td colSpan={5}><EmptyState label="No users found" /></td></tr>}
              </tbody>
            </>
          )}
        </div>
      )}

      {!loading && !error && tab === "shops" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SearchInput value={searchShopName} onChange={setSearchShopName} placeholder="Search by name..." />
            <span className="text-xs text-zinc-500">{filteredShops.length} shops</span>
          </div>
          {renderTable(
            <>
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  {th("Name")} {th("Owner Email")} {th("Plan")} {th("Created")}
                </tr>
              </thead>
              <tbody>
                {filteredShops.map((s: any) => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-white font-medium">{s.name || s.id}</td>
                    <td className="px-5 py-4 text-zinc-300">{s.ownerName || s.ownerEmail || "-"}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-600/20 text-emerald-300 border border-emerald-500/20">{s.plan || "free"}</span>
                    </td>
                    <td className="px-5 py-4 text-zinc-300">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
                {filteredShops.length === 0 && <tr><td colSpan={4}><EmptyState label="No shops found" /></td></tr>}
              </tbody>
            </>
          )}
        </div>
      )}

      {!loading && !error && tab === "bots" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SearchInput value={filterShopId} onChange={setFilterShopId} placeholder="Filter by shop_id..." />
            <span className="text-xs text-zinc-500">{filteredBots.length} bots</span>
          </div>
          {renderTable(
            <>
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  {th("Name")} {th("Shop ID")} {th("Tone")} {th("Actions")}
                </tr>
              </thead>
              <tbody>
                {filteredBots.map((b: any) => (
                  <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-white font-medium">{b.name || "-"}</td>
                    <td className="px-5 py-4 text-zinc-300 text-xs font-mono">{b.shop_id}</td>
                    <td className="px-5 py-4 text-zinc-300">{b.tone || "-"}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDelete("bots", b.id, "bots", setBots, bots)}
                        className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-colors">
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBots.length === 0 && <tr><td colSpan={4}><EmptyState label="No bots found" /></td></tr>}
              </tbody>
            </>
          )}
        </div>
      )}

      {!loading && !error && tab === "channels" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SearchInput value={channelShopId} onChange={setChannelShopId} placeholder="Filter by shop_id..." />
            <span className="text-xs text-zinc-500">{filteredChannels.length} channels</span>
          </div>
          {renderTable(
            <>
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  {th("Platform")} {th("Name")} {th("Shop ID")} {th("Active")} {th("Actions")}
                </tr>
              </thead>
              <tbody>
                {filteredChannels.map((c: any) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-white font-medium capitalize">{c.platform || "-"}</td>
                    <td className="px-5 py-4 text-zinc-300">{c.name || "-"}</td>
                    <td className="px-5 py-4 text-zinc-300 text-xs font-mono">{c.shop_id}</td>
                    <td className="px-5 py-4">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border", c.active ? "bg-green-600/20 text-green-300 border-green-500/20" : "bg-zinc-600/20 text-zinc-400 border-zinc-500/20")}>
                        {c.active ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDelete("channels", c.id, "channels", setChannels, channels)}
                        className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-colors">
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredChannels.length === 0 && <tr><td colSpan={5}><EmptyState label="No channels found" /></td></tr>}
              </tbody>
            </>
          )}
        </div>
      )}

      {!loading && !error && tab === "threads" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SearchInput value={threadShopId} onChange={setThreadShopId} placeholder="Filter by shop_id..." />
            <span className="text-xs text-zinc-500">{filteredThreads.length} threads</span>
          </div>
          {renderTable(
            <>
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  {th("ID")} {th("Shop ID")} {th("Customer")} {th("Status")} {th("Platform")} {th("Last Updated")} {th("")}
                </tr>
              </thead>
              <tbody>
                {filteredThreads.map((t: any) => (
                  <>
                    <tr key={t.id} onClick={() => toggleThread(t.id)}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <td className="px-5 py-4 text-white text-xs font-mono">{(t.id || "").slice(0, 12)}...</td>
                      <td className="px-5 py-4 text-zinc-300 text-xs font-mono">{t.shop_id}</td>
                      <td className="px-5 py-4 text-zinc-300">{t.customer_name || t.customer || "-"}</td>
                      <td className="px-5 py-4">
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border", t.status === "active" || t.status === "open" ? "bg-green-600/20 text-green-300 border-green-500/20" : t.status === "closed" ? "bg-zinc-600/20 text-zinc-400 border-zinc-500/20" : "bg-amber-600/20 text-amber-300 border-amber-500/20")}>
                          {t.status || "-"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-zinc-300 capitalize">{t.platform || "-"}</td>
                      <td className="px-5 py-4 text-zinc-300 text-xs">{t.updatedAt || t.last_updated ? new Date(t.updatedAt || t.last_updated).toLocaleString() : "-"}</td>
                      <td className="px-5 py-4 text-zinc-500">
                        {expandedThread === t.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </td>
                    </tr>
                    {expandedThread === t.id && (
                      <tr key={`${t.id}-messages`}>
                        <td colSpan={7} className="px-5 py-4 bg-white/[0.01]">
                          {threadMessages[t.id] ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {threadMessages[t.id].length === 0 ? (
                                <p className="text-zinc-500 text-xs text-center py-2">No messages</p>
                              ) : (
                                threadMessages[t.id].map((msg: any, i: number) => (
                                  <div key={i} className={cn("rounded-xl px-4 py-2.5 text-sm max-w-[80%]", msg.role === "assistant" || msg.role === "bot" ? "bg-blue-600/10 border border-blue-500/10 ml-auto" : "bg-white/5 border border-white/[0.06]")}>
                                    <p className="text-[10px] text-zinc-500 uppercase mb-1 font-medium">{msg.role || "user"}</p>
                                    <p className="text-zinc-200 whitespace-pre-wrap">{msg.content || msg.text || ""}</p>
                                    {msg.created_at && <p className="text-[10px] text-zinc-600 mt-1">{new Date(msg.created_at).toLocaleString()}</p>}
                                  </div>
                                ))
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-zinc-500 text-xs">
                              <div className="h-3 w-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                              Loading messages...
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {filteredThreads.length === 0 && <tr><td colSpan={7}><EmptyState label="No threads found" /></td></tr>}
              </tbody>
            </>
          )}
        </div>
      )}

      {!loading && !error && tab === "products" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SearchInput value={searchProduct} onChange={setSearchProduct} placeholder="Search by name..." />
            <span className="text-xs text-zinc-500">{filteredProducts.length} products</span>
          </div>
          {renderTable(
            <>
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  {th("Name")} {th("Category")} {th("Price")} {th("Stock")} {th("Shop ID")} {th("Actions")}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p: any) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-white font-medium">{p.name || "-"}</td>
                    <td className="px-5 py-4 text-zinc-300">{p.category || "-"}</td>
                    <td className="px-5 py-4 text-zinc-300">{p.price != null ? `$${Number(p.price).toFixed(2)}` : "-"}</td>
                    <td className="px-5 py-4">
                      <span className={cn("text-sm font-medium", (p.stock ?? 0) > 0 ? "text-green-400" : "text-red-400")}>{p.stock ?? 0}</span>
                    </td>
                    <td className="px-5 py-4 text-zinc-300 text-xs font-mono">{p.shop_id}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDelete("products", p.id, "products", setProducts, products)}
                        className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-colors">
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && <tr><td colSpan={6}><EmptyState label="No products found" /></td></tr>}
              </tbody>
            </>
          )}
        </div>
      )}

      {!loading && !error && tab === "leads" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">{leads.length} leads</span>
          </div>
          {renderTable(
            <>
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  {th("Customer Name")} {th("Phone")} {th("Platform")} {th("Status")} {th("Shop ID")} {th("Created")}
                </tr>
              </thead>
              <tbody>
                {leads.map((l: any) => (
                  <tr key={l.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-white font-medium">{l.customer_name || l.name || "-"}</td>
                    <td className="px-5 py-4 text-zinc-300">{l.phone || "-"}</td>
                    <td className="px-5 py-4 text-zinc-300 capitalize">{l.platform || "-"}</td>
                    <td className="px-5 py-4">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border", l.status === "new" || !l.status ? "bg-blue-600/20 text-blue-300 border-blue-500/20" : l.status === "contacted" ? "bg-amber-600/20 text-amber-300 border-amber-500/20" : l.status === "converted" ? "bg-green-600/20 text-green-300 border-green-500/20" : "bg-zinc-600/20 text-zinc-400 border-zinc-500/20")}>
                        {l.status || "new"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-300 text-xs font-mono">{l.shop_id}</td>
                    <td className="px-5 py-4 text-zinc-300 text-xs">{l.created_at || l.createdAt ? new Date(l.created_at || l.createdAt).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
                {leads.length === 0 && <tr><td colSpan={6}><EmptyState label="No leads found" /></td></tr>}
              </tbody>
            </>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { 
  Cpu, Plus, Trash2, Save, CheckCircle2, Key,
  ShieldCheck, Zap, Database, Search, BarChart3, FlaskConical
} from "lucide-react";
import { useShopId } from "@/lib/use-shop";
import { useSession } from "next-auth/react";
import { fetchBotSettings, updateBotSettings, testKey } from "@/lib/api";
import { cn } from "@/lib/utils";

const PROVIDERS = [
  { id: "openai", label: "OpenAI" },
  { id: "gemini", label: "Google Gemini" },
  { id: "openrouter", label: "OpenRouter" },
  { id: "voyage", label: "Voyage AI" },
];

const MODEL_MAP: Record<string, string[]> = {
  openai: ["text-embedding-3-large", "text-embedding-3-small", "text-embedding-ada-002"],
  gemini: ["gemini-embedding-001", "gemini-embedding-2", "gemini-embedding-2-preview"],
  openrouter: ["text-embedding-3-small", "text-embedding-3-large", "text-embedding-ada-002", "gemini-embedding-001", "gemini-embedding-2", "gemini-embedding-2-preview"],
  voyage: ["voyage-3", "voyage-3-lite", "voyage-code-3"],
};

const CHAT_MODELS: Record<string, string[]> = {
  openai: ["gpt-5.4", "o4-mini", "o3", "gpt-4o", "gpt-4o-mini"],
  gemini: ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.5-pro", "gemini-2.5-flash"],
  openrouter: ["anthropic/claude-3.5-sonnet", "openai/gpt-4o", "google/gemini-2.0-flash", "meta-llama/llama-3.3-70b"],
  voyage: [],
};

export default function KeysPage() {
  const { data: session } = useSession();
  const shopId = useShopId();
  const [botSettings, setBotSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [usage, setUsage] = useState<any>(null);

  // Default chat config (from stored or fallback)
  const [defaultChatProvider, setDefaultChatProvider] = useState("gemini");
  const [defaultChatModel, setDefaultChatModel] = useState("gemini-2.0-flash");

  useEffect(() => {
    Promise.all([
      fetchBotSettings(shopId).then(setBotSettings),
      fetchUsage(),
    ]).finally(() => setLoading(false));
  }, []);

  const fetchUsage = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${apiBase}/admin/billing/${shopId}/usage`, {
        headers: session?.user?.backendToken ? { Authorization: `Bearer ${session.user.backendToken}` } : {},
      });
      const data = await res.json();
      setUsage(data);
    } catch {}
  };

  // Load saved defaults from aiConfig
  useEffect(() => {
    if (botSettings?.aiConfig) {
      if (botSettings.aiConfig.defaultChatProvider) setDefaultChatProvider(botSettings.aiConfig.defaultChatProvider);
      if (botSettings.aiConfig.defaultChatModel) setDefaultChatModel(botSettings.aiConfig.defaultChatModel);
    }
  }, [botSettings]);

  const handleAutoSave = async (updated: any) => {
    setSaving(true);
    try {
      await updateBotSettings(shopId, updated);
      setBotSettings(updated);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleTestKey = async (keyId: string, provider: string, key: string) => {
    setTestingId(keyId);
    setTestResults(prev => ({ ...prev, [keyId]: "testing..." }));
    try {
      const res = await testKey(shopId, provider, key);
      setTestResults(prev => ({ ...prev, [keyId]: res?.status === "ok" ? "✅ OK" : "❌ Failed" }));
    } catch {
      setTestResults(prev => ({ ...prev, [keyId]: "❌ Error" }));
    }
    setTestingId(null);
  };

  const saveDefaults = async () => {
    setSaving(true);
    try {
      const updated = {
        ...botSettings,
        aiConfig: {
          ...(botSettings?.aiConfig || { keys: [] }),
          defaultChatProvider,
          defaultChatModel,
        },
      };
      await updateBotSettings(shopId, updated);
      setBotSettings(updated);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-neutral-500">Loading keys...</div>;

  const keys = botSettings?.aiConfig?.keys || [];
  const chatModels = CHAT_MODELS[defaultChatProvider] || [];

  // ponytail: usage may return nested or flat; handle both
  const dbQueries = usage?.dbQueries ?? usage?.stats?.dbQueries ?? usage?.queryCount ?? 0;
  const vectorSearches = usage?.vectorSearches ?? usage?.stats?.vectorSearches ?? usage?.vectorCount ?? 0;

  return (
    <div className="max-w-5xl space-y-10 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Key className="h-8 w-8 text-purple-400" />
          API Keys & AI Providers
        </h1>
        <p className="text-neutral-400 mt-1">Quản lý API keys cho LLM và Embedding models. Thêm key từ OpenAI, Gemini, Voyage AI hoặc OpenRouter.</p>
      </div>

      {/* Section 1: API Keys */}
      <div className="rounded-[2.5rem] border border-purple-500/20 bg-gradient-to-br from-purple-600/10 to-transparent p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-500/20">
              <Key className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">API Keys</h3>
              <p className="text-sm text-neutral-400">Thêm keys từ nhiều providers. Key nào active sẽ được dùng cho AI.</p>
            </div>
          </div>
          <button
            onClick={() => {
              const newKey = {
                id: Math.random().toString(36).substring(7),
                name: "New Key",
                provider: "openai",
                key: "",
                isActive: false,
                status: "pending",
              };
              const updated = {
                ...(botSettings || { shopId }),
                aiConfig: {
                  ...(botSettings?.aiConfig || { keys: [] }),
                  keys: [...keys, newKey],
                },
              };
              setBotSettings(updated);
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Plus className="h-4 w-4" /> Thêm Key
          </button>
        </div>

        {/* Key list */}
        <div className="space-y-3">
          {keys.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-white/10 rounded-[2rem]">
              <ShieldCheck className="h-12 w-12 mx-auto text-neutral-700 mb-3" />
              <p className="text-sm text-neutral-600">Chưa có API Key nào. Bấm "Thêm Key" để bắt đầu.</p>
              <p className="text-[10px] text-neutral-700 mt-1">Beta MVP yêu cầu tự mang API Key</p>
            </div>
          ) : keys.map((k: any, idx: number) => (
            <div key={k.id} className={cn(
              "relative bg-black/40 border p-5 rounded-2xl transition-all",
              k.isActive ? "border-purple-500/30 bg-purple-500/[0.03]" : "border-white/5 hover:border-white/20"
            )}>
              {k.isActive && <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-3">
                  {/* Row 1: Provider + Name + Status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <select value={k.provider} onChange={(e) => {
                      const newKeys = [...keys];
                      newKeys[idx] = { ...newKeys[idx], provider: e.target.value };
                      handleAutoSave({ ...botSettings, aiConfig: { ...botSettings.aiConfig, keys: newKeys } });
                    }}
                      className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold text-white uppercase outline-none">
                      {PROVIDERS.map(p => <option key={p.id} value={p.id} className="bg-zinc-900">{p.label}</option>)}
                    </select>
                    <input value={k.name} onChange={(e) => {
                      const newKeys = [...keys];
                      newKeys[idx] = { ...newKeys[idx], name: e.target.value };
                      setBotSettings({ ...botSettings, aiConfig: { ...botSettings.aiConfig, keys: newKeys } });
                    }}
                      placeholder="Tên gợi nhớ"
                      className="bg-transparent border-b border-transparent focus:border-purple-500/30 text-sm font-medium text-white outline-none px-1" />
                    <span className={cn("text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border",
                      k.status === "active" ? "bg-green-500/10 border-green-500/20 text-green-500" :
                      k.status === "error" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-neutral-800 border-white/5 text-neutral-500")}>
                      {k.status}
                    </span>
                  </div>

                  {/* Row 2: Key input */}
                  <div className="flex gap-2">
                    <input type="password" value={k.key} onChange={(e) => {
                      const newKeys = [...keys];
                      newKeys[idx] = { ...newKeys[idx], key: e.target.value };
                      setBotSettings({ ...botSettings, aiConfig: { ...botSettings.aiConfig, keys: newKeys } });
                    }}
                      placeholder="Paste API Key..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:border-purple-500/50" />
                    <button onClick={() => handleTestKey(k.id, k.provider, k.key)}
                      disabled={testingId === k.id || !k.key}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold transition-all disabled:opacity-30">
                      {testingId === k.id ? "..." : <FlaskConical className="h-4 w-4" />}
                    </button>
                  </div>
                  {testResults[k.id] && <p className="text-[10px] text-zinc-500">{testResults[k.id]}</p>}
                </div>

                {/* Actions */}
                <div className="flex md:flex-col items-center gap-2">
                  <button onClick={() => {
                    const newKeys = [...keys];
                    newKeys[idx] = { ...newKeys[idx], isActive: !k.isActive };
                    handleAutoSave({ ...botSettings, aiConfig: { ...botSettings.aiConfig, keys: newKeys } });
                  }} disabled={saving}
                    className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border flex items-center gap-1.5",
                      k.isActive ? "bg-green-500 text-black border-green-500" : "bg-white/5 border-white/10 text-neutral-500 hover:text-white")}>
                    {k.isActive ? <><CheckCircle2 className="h-3 w-3" /> Active</> : "Activate"}
                  </button>
                  <button onClick={() => {
                    if (confirm("Xoá key này?")) {
                      const newKeys = keys.filter((_: any, i: number) => i !== idx);
                      handleAutoSave({ ...botSettings, aiConfig: { ...botSettings.aiConfig, keys: newKeys } });
                    }
                  }} className="p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => handleAutoSave(botSettings)} disabled={saving}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save All Keys"}
          </button>
        </div>
      </div>

      {/* Section 2: Default AI Config */}
      <div className="rounded-[2.5rem] border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-transparent p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Default AI Config</h3>
            <p className="text-sm text-neutral-400">Model mặc định cho chat. Bot config có thể override cái này.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Chat Provider</label>
            <select value={defaultChatProvider} onChange={(e) => setDefaultChatProvider(e.target.value)}
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none">
              {PROVIDERS.filter(p => CHAT_MODELS[p.id]?.length > 0).map(p => (
                <option key={p.id} value={p.id} className="bg-zinc-900">{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Chat Model</label>
            <select value={defaultChatModel} onChange={(e) => setDefaultChatModel(e.target.value)}
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none">
              {chatModels.map(m => <option key={m} value={m} className="bg-zinc-900">{m}</option>)}
            </select>
          </div>
        </div>

        <button onClick={saveDefaults} disabled={saving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl text-xs font-bold transition-all">
          {saving ? "Saving..." : "Save Defaults"}
        </button>
      </div>

      {/* Section 3: Usage Today */}
      <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 space-y-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-green-400" />
          <h3 className="text-xl font-bold">Today's Usage</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-neutral-600">DB Queries</span>
            <p className="text-lg font-bold text-white">{dbQueries}</p>
          </div>
          <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-neutral-600">Vector Searches</span>
            <p className="text-lg font-bold text-white">{vectorSearches}</p>
          </div>
          <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-neutral-600">Active Keys</span>
            <p className="text-lg font-bold text-white">{keys.filter((k: any) => k.isActive).length}/{keys.length}</p>
          </div>
          <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-neutral-600">Embedding Provider</span>
            <p className="text-lg font-bold text-white capitalize">
              {botSettings?.aiConfig?.embeddingProvider || "gemini"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

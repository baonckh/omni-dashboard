"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit, MessageSquare, BookOpen, Save, Plus, Trash2,
  Bot, Sparkles, ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fetchBot, saveBot } from "@/lib/api";

import { useShopId } from "@/lib/use-shop";
import { Card, Field, TONES } from "./components/shared";
import { KnowledgeSection } from "./components/KnowledgeSection";
import { MultiChatSection } from "./components/MultiChatSection";

const TABS = [
  { id: "persona", label: "Persona", icon: BrainCircuit },
  { id: "knowledge", label: "Knowledge", icon: BookOpen },
  { id: "test", label: "Test", icon: MessageSquare },
];

export default function BotConfigPage({ params }: { params: Promise<{ botId: string }> }) {
  const { botId } = React.use(params);
  const shopId = useShopId();
  const [tab, setTab] = useState("persona");
  const [saving, setSaving] = useState(false);
  const [p, setP] = useState<any>({
    shopId, id: botId, botName: "AI Assistant", persona: "Nhân viên tư vấn",
    tone: "friendly", language: "vi", greeting: "Chào bạn! 👋",
    rules: ["Luôn trả lời tiếng Việt", "Không bịa giá", "Thu thập SĐT"],
    scenarios: [], stages: [],
  });

  useEffect(() => {
    fetchBot(shopId, botId).then((d) => d && setP(d)).catch(() => {});
  }, [shopId, botId]);

  const update = (partial: any) => setP({ ...p, ...partial });
  const handleSave = async () => {
    setSaving(true);
    try { await saveBot(shopId, botId, p); } catch (e) { console.error(e); }
    setSaving(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/app/bots" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ChevronLeft className="h-5 w-5 text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{p.botName || "Bot Config"}</h1>
            <p className="text-xs text-zinc-500">ID: {botId.slice(0, 8)}</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl text-sm font-bold transition-all"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl w-fit">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              tab === t.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-zinc-400 hover:text-white"
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {tab === "persona" && (
          <motion.div key="persona" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-5">
            {/* Left: Bot Info */}
            <Card title="Bot Info" icon={Bot}>
              <Field label="Bot Name" value={p.botName} onChange={(v: string) => update({ botName: v })} />
              <div>
                <label className="text-[10px] text-zinc-500 font-medium mb-1 block">Tone</label>
                <select value={p.tone} onChange={(e) => update({ tone: e.target.value })}
                  className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                >
                  {TONES.map((t: any) => (
                    <option key={t.value} value={t.value} className="bg-zinc-900">{t.label}</option>
                  ))}
                </select>
              </div>
              <Field label="Persona" value={p.persona} onChange={(v: string) => update({ persona: v })} multiline rows={2} />
              <Field label="Greeting" value={p.greeting} onChange={(v: string) => update({ greeting: v })} />
            </Card>

            {/* Right: Rules */}
            <Card title="Rules" icon={Sparkles}>
              <div className="space-y-2">
                {p.rules?.map((rule: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <span className="flex-1 text-sm text-zinc-300">{rule}</span>
                    <button onClick={() => update({ rules: p.rules.filter((_: any, j: number) => j !== i) })}
                      className="text-zinc-600 hover:text-red-400 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button onClick={() => update({ rules: [...(p.rules || []), ""] })}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Add Rule
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {tab === "knowledge" && (
          <motion.div key="knowledge" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <KnowledgeSection />
          </motion.div>
        )}

        {tab === "test" && (
          <motion.div key="test" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <MultiChatSection botId={botId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

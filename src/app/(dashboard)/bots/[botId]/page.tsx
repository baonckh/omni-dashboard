"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit, Sparkles, MessageSquare, Users, FileText, Save, Plus, Trash2,
  BookOpen, Target, Shield, Bot, Eye, GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchBot, saveBot } from "@/lib/api";

// Components
import { Card, Field, SectionHeader, SHOP_ID, TONES, DEFAULT_STAGES } from "./components/shared";
import { KnowledgeSection } from "./components/KnowledgeSection";
import { MultiChatSection } from "./components/MultiChatSection";
import { AgentWorkspaceSection } from "./components/AgentWorkspaceSection";

// Tab Rules Engine vừa tạo
import { BotPersonaTab } from "@/components/BotPersonaTab";

// ============================================================
const SECTIONS = [
  { id: "knowledge", label: "Knowledge", icon: BookOpen, color: "text-amber-500" },
  { id: "stages", label: "Sales Stages", icon: Target, color: "text-cyan-500" },
  { id: "persona", label: "AI Persona", icon: BrainCircuit, color: "text-purple-500" },
  { id: "rules", label: "Proxy Rules", icon: Shield, color: "text-pink-500" },
  { id: "chat", label: "Playground Test", icon: MessageSquare, color: "text-blue-500" },
  { id: "workspace", label: "Agent Workspace", icon: Users, color: "text-green-500" },
  { id: "guide", label: "Sales Guide", icon: FileText, color: "text-orange-500" },
];

export default function BotConfigPage({ params }: { params: Promise<{ botId: string }> }) {
  const { botId } = React.use(params);
  const [activeSection, setActiveSection] = useState("knowledge");

  return (
    <div className="flex h-[calc(100vh-100px)] gap-0">
      {/* Sidebar */}
      <div className="w-52 border-r border-white/5 pr-3 space-y-1 shrink-0">
        <div className="mb-5">
          <h1 className="text-base font-bold bg-gradient-to-r from-white via-blue-300 to-purple-400 bg-clip-text text-transparent">Bot Config</h1>
          <p className="text-[10px] text-neutral-500 mt-1 uppercase font-mono tracking-wider">ID: {botId.slice(0, 8)}</p>
        </div>
        
        {SECTIONS.map((s) => (
          <button 
            key={s.id} 
            onClick={() => setActiveSection(s.id)} 
            className={cn("w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all", activeSection === s.id ? "bg-white text-black" : "text-neutral-500 hover:text-white hover:bg-white/5")}
          >
            <s.icon className={cn("h-3.5 w-3.5", activeSection === s.id ? "text-black" : s.color)} />
            {s.label}
          </button>
        ))}
        
        <div className="mt-5 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl relative group cursor-pointer overflow-hidden">
           <div className="absolute inset-0 bg-indigo-500/20 w-0 group-hover:w-full transition-all duration-500 ease-out" />
           <p className="text-[10px] text-indigo-300 relative z-10 leading-relaxed font-semibold">
              <Bot className="h-3 w-3 text-indigo-400 inline mr-1 mb-0.5" /> Kiểm tra Rules & Test tại Playground!
           </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pl-5 pb-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeSection} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.12 }}>
            {activeSection === "knowledge" && <KnowledgeSection />}
            {activeSection === "stages" && <StagesSection botId={botId} />}
            {activeSection === "persona" && <PersonaSection botId={botId} />}
            {activeSection === "rules" && <RulesSection botId={botId} />}
            {activeSection === "chat" && <MultiChatSection botId={botId} />}
            {activeSection === "workspace" && <AgentWorkspaceSection />}
            {activeSection === "guide" && <SalesGuideSection botId={botId} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================
// STAGES SECTION
// ============================================================
function StagesSection({ botId }: { botId: string }) {
  const [stages, setStages] = useState(DEFAULT_STAGES);
  const [saving, setSaving] = useState(false);
  useEffect(() => { fetchBot(SHOP_ID, botId).then((p) => { if (p?.stages?.length) setStages(p.stages); }).catch(() => {}); }, [botId]);

  const addStage = () => setStages([...stages, { order: stages.length + 1, name: "", description: "", prompt: "" }]);
  const removeStage = (i: number) => setStages(stages.filter((_, idx) => idx !== i).map((st, idx) => ({ ...st, order: idx + 1 })));
  const updateStage = (i: number, field: string, val: string) => { const s = [...stages]; s[i] = { ...s[i], [field]: val }; setStages(s); };

  const handleSave = async () => {
    setSaving(true);
    try { 
      const e = await fetchBot(SHOP_ID, botId); 
      await saveBot(SHOP_ID, botId, { ...(e || { shopId: SHOP_ID }), stages }); 
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-5 pb-8">
      <SectionHeader title="Sales Stages Configuration" subtitle="Config các bước bán hàng — AI sẽ tự nhận biết stage và hành xử phù hợp" icon={Target} />
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500">{stages.length} stages</p>
        <div className="flex gap-2">
          <button onClick={addStage} className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10"><Plus className="h-3 w-3" /> Thêm</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600 rounded-xl text-xs font-bold hover:bg-cyan-500 disabled:opacity-50"><Save className="h-3 w-3" /> {saving ? "..." : "Lưu"}</button>
        </div>
      </div>
      <div className="space-y-3">
        {stages.map((stage, i) => (
          <div key={i} className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl group hover:bg-white/[0.04]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold text-white", i < 5 ? ["bg-blue-500", "bg-purple-500", "bg-cyan-500", "bg-green-500", "bg-orange-500"][i] : "bg-neutral-600")}>{stage.order}</div>
                <GripVertical className="h-3.5 w-3.5 text-neutral-700 cursor-grab" />
              </div>
              <button onClick={() => removeStage(i)} className="opacity-0 group-hover:opacity-100 p-1 text-red-500/50 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tên stage" value={stage.name} onChange={(v) => updateStage(i, "name", v)} placeholder="VD: Chào hỏi" />
              <Field label="Mô tả" value={stage.description} onChange={(v) => updateStage(i, "description", v)} placeholder="VD: Giới thiệu" />
            </div>
            <Field label="Prompt AI" value={stage.prompt} onChange={(v) => updateStage(i, "prompt", v)} placeholder="Hướng dẫn AI..." multiline rows={2} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PERSONA SECTION
// ============================================================
type Persona = { 
  shopId: string; 
  id?: string; 
  isDefault?: boolean; 
  botName: string; 
  persona: string; 
  tone: string; 
  language: string; 
  greeting: string; 
  rules: string[]; 
  scenarios: any[]; 
  stages: any[];
  enableDualModel?: boolean;
};

function PersonaSection({ botId }: { botId: string }) {
  const [p, setP] = useState<Persona>({ shopId: SHOP_ID, id: botId, botName: "Vera", persona: "Nhân viên tư vấn", tone: "friendly", language: "vi", greeting: "Chào bạn! 👋", rules: ["Luôn trả lời tiếng Việt", "Không bịa giá", "Thu thập SĐT"], scenarios: [], stages: [] });
  const [saving, setSaving] = useState(false);
  useEffect(() => { fetchBot(SHOP_ID, botId).then((d) => d && setP(d)).catch(() => {}); }, [botId]);
  
  const handleSave = async () => { setSaving(true); try { await saveBot(SHOP_ID, botId, p); alert("Đã cập nhật Identity Bot"); } catch (e) { console.error(e); } finally { setSaving(false); } };
  
  const addRule = () => setP({ ...p, rules: [...p.rules, ""] });
  const removeRule = (i: number) => setP({ ...p, rules: p.rules.filter((_, idx) => idx !== i) });
  const updateRule = (i: number, val: string) => { const r = [...p.rules]; r[i] = val; setP({ ...p, rules: r }); };

  return (
    <div className="space-y-5 pb-8">
      <div className="flex items-center justify-between">
           <SectionHeader title="AI Persona Setup" subtitle="Cấu hình hệ thống nhận diện, thông điệp mở đầu và Core Rules cho Agent" icon={BrainCircuit} />
           <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-bold uppercase mr-2">Trạng thái Default Bot</span>
              <button 
                onClick={() => setP({...p, isDefault: !p.isDefault})} 
                className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all", p.isDefault ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-white/5 text-neutral-400 hover:bg-white/10")}
              >
                 {p.isDefault ? "🔥 Bot Mặc Định" : "Tùy chọn"}
              </button>
           </div>
      </div>

      {/* Optimization Banner */}
      <div className="p-5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-[2rem] flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                  <Sparkles className="h-6 w-6" />
              </div>
              <div>
                  <h4 className="font-bold text-white">Dual-Model Saver (Tiết kiệm &gt;60% phí)</h4>
                  <p className="text-xs text-neutral-400">Kết hợp Router Model & Generator Model để tối ưu hóa chi phí token.</p>
              </div>
          </div>
          <button 
            onClick={() => setP({...p, enableDualModel: !p.enableDualModel})}
            className={cn("relative w-14 h-8 rounded-full transition-colors", p.enableDualModel ? "bg-emerald-500" : "bg-white/10")}
          >
              <div className={cn("absolute top-1 left-1 h-6 w-6 bg-white rounded-full transition-transform shadow-lg", p.enableDualModel ? "translate-x-6" : "translate-x-0")} />
          </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Card title="Thông tin Bot" icon={BrainCircuit}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tên Bot" value={p.botName} onChange={(v) => setP({ ...p, botName: v })} placeholder="Vera" />
              <div><label className="text-[10px] text-neutral-500 font-medium mb-1 block">Giọng điệu</label><select value={p.tone} onChange={(e) => setP({ ...p, tone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">{TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
            </div>
            <Field label="Tính cách / Vai trò" value={p.persona} onChange={(v) => setP({ ...p, persona: v })} multiline />
            <Field label="Lời chào đầu tin (Greeting)" value={p.greeting} onChange={(v) => setP({ ...p, greeting: v })} multiline />
          </Card>
          <Card title="Quy tắc (Core AI Rules hạn chế ảo tưởng)" icon={Shield} action={<button onClick={addRule} className="p-1 bg-white/5 rounded-lg hover:bg-white/10"><Plus className="h-3 w-3" /></button>}>
            <div className="space-y-1.5">
              {p.rules.map((r, i) => (
                <div key={i} className="flex gap-2"><span className="text-xs text-neutral-600 mt-2.5 w-4 shrink-0">{i + 1}.</span><input value={r} onChange={(e) => updateRule(i, e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" /><button onClick={() => removeRule(i)} className="p-1.5 text-red-500/50 hover:text-red-500"><Trash2 className="h-3 w-3" /></button></div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card title="Preview Lời chào" icon={Eye}>
            <div className="bg-black/40 rounded-2xl p-4 space-y-3">
              <div className="flex gap-3"><div className="h-7 w-7 rounded-lg bg-white text-black flex items-center justify-center shrink-0"><Bot className="h-3.5 w-3.5" /></div><div className="bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl rounded-tl-none text-xs">{p.greeting || "..."}</div></div>
            </div>
          </Card>
          <button onClick={handleSave} disabled={saving} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold disabled:opacity-50 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95"><Save className="h-5 w-5" /> {saving ? "Đang Cập nhật Identity..." : "Lưu Thay Đổi Identity"}</button>
          
          <button onClick={async () => {
             if(window.confirm("Cảnh báo: Xóa bot AI này? Mọi lịch sử và rules sẽ mất.")) {
                try {
                   const { deleteBot } = await import('@/lib/api');
                   await deleteBot(SHOP_ID, botId);
                   window.location.href = '/bots';
                } catch(e) { console.error(e); }
             }
          }} className="w-full py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl text-xs font-bold transition-all mt-4 border border-red-500/20">
             Xóa Bỏ Agent Này
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// RULES SECTION GỌI COMPONENT
// ============================================================
function RulesSection({ botId }: { botId: string }) {
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    fetchBot(SHOP_ID, botId).then(d => setData(d || { shopId: SHOP_ID, botName: "AI Proxy", scenarios: [] }));
  }, [botId]);

  const handleSaveWrapper = async () => {
    try {
      await saveBot(SHOP_ID, botId, data);
      alert("Đã lưu Bộ Rules Proxy thành công 😎");
    } catch (e) {
      console.error(e);
      alert("Lỗi quá trình giao tiếp gRPC Engine.");
    }
  };

  return (
    <div className="py-2 animate-in fade-in zoom-in-95 duration-500">
       {data ? (
         <BotPersonaTab data={data} onChange={setData} onSave={handleSaveWrapper} />
       ) : (
         <div className="p-8 text-neutral-500">Đang quét kịch bản...</div>
       )}
    </div>
  );
}

// ============================================================
// SALES GUIDE
// ============================================================
function SalesGuideSection({ botId }: { botId: string }) {
  const [stages, setStages] = useState(DEFAULT_STAGES);
  useEffect(() => { fetchBot(SHOP_ID, botId).then((p) => { if (p?.stages?.length) setStages(p.stages); }).catch(() => {}); }, [botId]);

  return (
    <div className="space-y-5 pb-8">
      <SectionHeader title="Sales Onboarding Guide" subtitle="Quy trình onboard cho nhân sự thật — hiểu cách Đại sứ AI hoạt động và luân chuyển giao" icon={FileText} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card title="Visual Flow - Các giai đoạn tương tác Của Bot" icon={Target}>
            {stages.map((stage, i) => (
              <div key={i}>
                <div className="flex gap-3 py-2">
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0", i < 5 ? ["bg-blue-500", "bg-purple-500", "bg-cyan-500", "bg-green-500", "bg-orange-500"][i] : "bg-neutral-600")}>{stage.order}</div>
                  <div><p className="text-sm font-bold">{stage.name}</p><p className="text-xs text-neutral-500 mt-0.5">{stage.description}</p></div>
                </div>
                {i < stages.length - 1 && <div className="ml-4 h-3 border-l-2 border-dashed border-white/10" />}
              </div>
            ))}
          </Card>
        </div>
        <div className="space-y-4">
          <Card title="Khi nào AI chuyển Human Agent?" icon={Shield} compact>
            <div className="space-y-1.5 text-xs">
              {["😤 Khách bực mất kiên nhẫn hoặc spam", "🔄 Lệnh Rule thất bại 3 lần", "💰 Khách hàng yêu cầu đại lý thương lượng", "⚠️ Thu thập dữ liệu pháp lý"].map((t, i) => (
                <div key={i} className="p-2 bg-white/[0.02] rounded-lg text-neutral-400 text-[10px]">{t}</div>
              ))}
            </div>
          </Card>
          <Card title="Checklist" icon={Target} compact>
            <div className="space-y-1.5">
              {["Xem thẻ Thread Inbox", "Đọc Insight Khách Hàng", "Phản hồi qua Boxchat"].map((t, i) => (
                <div key={i} className="flex items-center gap-2 p-1.5 bg-white/[0.02] rounded-lg text-[10px] text-neutral-400"><div className="h-3.5 w-3.5 rounded border border-white/20 shrink-0" />{t}</div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

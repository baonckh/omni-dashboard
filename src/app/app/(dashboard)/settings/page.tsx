"use client";

import React, { useEffect, useState } from "react";
import { 
  Bell, 
  Send, 
  Mail, 
  Save, 
  ShieldCheck, 
  Zap,
  CheckCircle2,
  AlertCircle,
  Code2,
  Copy,
  Smartphone,
  Globe,
  ExternalLink,
  Plus,
  Trash2,
  Antenna
} from "lucide-react";
import { useShopId } from "@/lib/use-shop";
import { 
  fetchAlertConfig, 
  saveAlertConfig, 
  testAlert, 
  fetchBotSettings, 
  updateBotSettings,


  APIKey, 
  BotSetting 
} from "@/lib/api";
import { ShimmerButton } from "@/components/ui/shimmer-button";

import { cn } from "@/lib/utils";
import { Cpu } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [config, setConfig] = useState<any>(null);
  const [botSettings, setBotSettings] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const shopId = useShopId();
  const EMBED_CODE = `<script 
  src="https://cdn.omni-ai.com/widget.js" 
  data-shop-id="${shopId}"
  async
></script>`;

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const [alertData, settingsData] = await Promise.all([
        fetchAlertConfig(shopId),
        fetchBotSettings(shopId)
      ]);
      setConfig(alertData);
      setBotSettings(settingsData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === "notifications") {
        await saveAlertConfig(shopId, config);
      } else if (activeTab === "ai-providers") {
        await updateBotSettings(shopId, botSettings);
      }
      alert("Cấu hình đã được lưu thành công! ✅");
    } catch (err) {
      alert("Lỗi khi lưu cấu hình ❌");
    } finally {
      setSaving(false);
    }
  };

  const handleAutoSave = async (updatedSettings: any) => {
    setSaving(true);
    try {
      await updateBotSettings(shopId, updatedSettings);
      setBotSettings(updatedSettings);
    } catch (err) {
      console.error("Auto-save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Đã copy mã nhúng! 📋");
  };

  if (loading) return <div className="p-10 text-neutral-500">Loading settings...</div>;

  return (
    <div className="max-w-5xl space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Settings & Integrations</h1>
           <p className="text-neutral-400">Quản lý thông báo và cấu hình mã nhúng AI Chat.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 relative">
           {saving && (
             <div className="absolute -top-10 right-0 text-[10px] font-bold text-purple-400 animate-pulse flex items-center gap-1.5">
               <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-ping" /> Synchronizing...
             </div>
           )}
           <button 
             onClick={() => setActiveTab("notifications")}
             className={cn(
               "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
               activeTab === "notifications" ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white"
             )}
           >
             Notifications
           </button>
           <button 
             onClick={() => setActiveTab("integrations")}
             className={cn(
               "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
               activeTab === "integrations" ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white"
             )}
           >
             Integrations
           </button>
           <button 
             onClick={() => setActiveTab("ai-providers")}
             className={cn(
               "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
               activeTab === "ai-providers" ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white"
             )}
           >
             AI Providers
           </button>

        </div>
      </div>

      {activeTab === "notifications" ? (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Telegram Alert Section */}
            <div className="bg-black/40 border border-white/5 p-8 rounded-[2rem] space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Send className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold">Telegram</h3>
                <div className="ml-auto">
                    <input 
                      type="checkbox" 
                      checked={config?.telegramEnabled}
                      onChange={(e) => setConfig({...config, telegramEnabled: e.target.checked})}
                      className="w-10 h-5 appearance-none bg-neutral-800 checked:bg-blue-600 rounded-full cursor-pointer transition-colors relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5.5 before:transition-all"
                    />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase">Bot Token</label>
                    <input 
                      type="password"
                      value={config?.telegramToken || ""}
                      onChange={(e) => setConfig({...config, telegramToken: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase">Chat ID</label>
                    <input 
                      type="text"
                      value={config?.telegramChatId || ""}
                      onChange={(e) => setConfig({...config, telegramChatId: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
              </div>
            </div>

            {/* Email Section */}
            <div className="bg-black/40 border border-white/5 p-8 rounded-[2rem] space-y-6 opacity-60">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-xl">
                    <Mail className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold">Email Report</h3>
              </div>
              <p className="text-sm text-neutral-500 italic">Tính năng gửi báo cáo Lead hàng ngày qua Email đang được phát triển.</p>
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 p-8 rounded-[2rem] flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-2xl">
                  <Bell className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Notification Bell</h3>
                  <p className="text-sm text-neutral-500">Hiển thị thông báo Lead trên thanh Header.</p>
                </div>
            </div>
            <input 
                type="checkbox" 
                checked={config?.dashboardEnabled}
                onChange={(e) => setConfig({...config, dashboardEnabled: e.target.checked})}
                className="w-10 h-5 appearance-none bg-neutral-800 checked:bg-green-600 rounded-full cursor-pointer transition-colors relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5.5 before:transition-all"
              />
          </div>

          <div className="flex items-center gap-4">
              <ShimmerButton onClick={handleSave}>Lưu cấu hình</ShimmerButton>
              <button 
                onClick={() => testAlert(shopId)}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase transition-all"
              >
                Test Connection
              </button>
          </div>
        </div>
      ) : activeTab === "ai-providers" ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/20 p-8 rounded-[2.5rem] space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-500/20">
                      <Cpu className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">AI API Management</h3>
                      <p className="text-sm text-neutral-400">Quản lý đa nền tảng, đa API Keys để tối ưu hóa chi phí và độ tin cậy.</p>
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
                      status: "pending"
                    };
                    setBotSettings({
                      ...(botSettings || { shopId } as any),
                      aiConfig: {
                        ...(botSettings?.aiConfig || { keys: [] }),
                        keys: [...(botSettings?.aiConfig?.keys || []), newKey]
                      }
                    });
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Plus className="h-4 w-4" /> Thêm Key Mới
                </button>
              </div>

              <div className="space-y-4">
                {botSettings?.aiConfig?.keys?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {botSettings.aiConfig.keys.map((k: any, idx: number) => (
                      <div key={k.id} className={cn(
                        "relative bg-black/40 border p-6 rounded-3xl group transition-all duration-300",
                        k.isActive ? "border-purple-500/40 bg-purple-500/[0.03] shadow-[0_0_20px_rgba(168,85,247,0.05)]" : "border-white/5 hover:border-white/20"
                      )}>
                        {/* Status Pulse */}
                        {k.isActive && (
                          <div className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded-lg border border-white/10">
                                <span className="text-[10px] font-black text-purple-400 uppercase tracking-tighter">Provider</span>
                                <select 
                                  value={k.provider}
                                  onChange={(e) => {
                                    const keys = [...(botSettings?.aiConfig?.keys || [])];
                                    if (keys[idx]) {
                                      keys[idx].provider = e.target.value;
                                      setBotSettings({...botSettings, aiConfig: {...(botSettings?.aiConfig || {}), keys}});
                                    }
                                  }}
                                  className="bg-transparent border-none text-[10px] font-bold text-white uppercase tracking-wider focus:outline-none"
                                >
                                  <option value="openai" className="bg-neutral-900">OpenAI</option>
                                  <option value="gemini" className="bg-neutral-900">Gemini</option>
                                  <option value="voyage" className="bg-neutral-900">Voyage AI</option>
                                  <option value="openrouter" className="bg-neutral-900">OpenRouter</option>
                                </select>
                              </div>

                              <input 
                                value={k.name}
                                onChange={(e) => {
                                  const keys = [...(botSettings?.aiConfig?.keys || [])];
                                  if (keys[idx]) {
                                    keys[idx].name = e.target.value;
                                    setBotSettings({...botSettings, aiConfig: {...(botSettings?.aiConfig || {}), keys}});
                                  }
                                }}
                                placeholder="Tên gợi nhớ (VD: Marketing Key)"
                                className="flex-1 bg-white/5 border border-transparent focus:border-purple-500/30 text-sm font-bold text-white focus:outline-none rounded-xl px-3 py-1.5 transition-all"
                              />

                              <div className={cn(
                                "text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border",
                                k.status === "active" ? "bg-green-500/10 border-green-500/20 text-green-500" : 
                                k.status === "error" ? "bg-red-500/10 border-red-500/20 text-red-500" : 
                                "bg-neutral-800 border-white/5 text-neutral-500"
                              )}>
                                {k.status}
                              </div>
                            </div>

                            <div className="relative group/key">
                              <input 
                                type="password"
                                value={k.key}
                                onChange={(e) => {
                                  const keys = [...(botSettings?.aiConfig?.keys || [])];
                                  if (keys[idx]) {
                                    keys[idx].key = e.target.value;
                                    setBotSettings({...botSettings, aiConfig: {...(botSettings?.aiConfig || {}), keys}});
                                  }
                                }}
                                placeholder="Dán API Key vào đây..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-xs font-mono focus:outline-none focus:border-purple-500/50 transition-all group-hover/key:border-white/20"
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/key:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => handleSave()}
                                  className="p-1.5 bg-purple-500 hover:bg-purple-400 text-white rounded-lg transition-colors shadow-lg shadow-purple-500/20"
                                  title="Lưu ngay"
                                >
                                  <Save className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex md:flex-col justify-end items-center gap-3">
                            <button 
                              onClick={() => {
                                const keys = [...(botSettings?.aiConfig?.keys || [])];
                                if (keys[idx]) {
                                  keys[idx].isActive = !keys[idx].isActive; // Toggle support
                                  handleAutoSave({...botSettings, aiConfig: {...(botSettings?.aiConfig || {}), keys}});
                                }
                              }}
                              disabled={saving}
                              className={cn(
                                "flex-1 md:w-28 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border flex items-center justify-center gap-1.5",
                                k.isActive ? "bg-green-500 text-black border-green-500" : "bg-white/5 border-white/10 text-neutral-500 hover:text-white hover:bg-white/10",
                                saving && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              {k.isActive ? (
                                <><CheckCircle2 className="h-3 w-3" /> Active</>
                              ) : "Activate"}
                            </button>
                            
                            <button 
                              onClick={() => {
                                if (window.confirm("Xóa API Key này?")) {
                                  const keys = (botSettings?.aiConfig?.keys || []).filter((_: any, i: number) => i !== idx);
                                  handleAutoSave({...botSettings, aiConfig: {...(botSettings?.aiConfig || {}), keys}});
                                }
                              }}
                              disabled={saving}
                              className="p-2.5 bg-white/5 text-neutral-600 border border-white/5 rounded-xl hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-black/20 border border-dashed border-white/5 rounded-[2rem]">
                    <p className="text-sm text-neutral-600">Chưa có API Key nào. Hãy thêm một cái để bắt đầu!</p>
                  </div>
                )}
              </div>
           </div>

           <div className="flex items-center gap-4">
              <ShimmerButton onClick={handleSave}>Lưu & Cập nhật danh sách Keys</ShimmerButton>
           </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
           {/* Web Embed Section */}
           <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                    <Globe className="h-6 w-6 text-white" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold">Web Chat Widget</h3>
                    <p className="text-sm text-neutral-400">Nhúng AI vào Website hoặc Landing Page của bạn.</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <p className="text-sm text-neutral-300">Copy đoạn code này và dán vào cuối thẻ `&lt;body&gt;` của website:</p>
                 <div className="relative group">
                    <pre className="bg-black/60 p-6 rounded-2xl border border-white/10 text-blue-400 text-sm font-mono overflow-x-auto">
                       {EMBED_CODE}
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(EMBED_CODE)}
                      className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white text-neutral-400 hover:text-black rounded-xl transition-all"
                    >
                       <Copy className="h-4 w-4" />
                    </button>
                 </div>
              </div>
           </div>

           {/* Channels Guide */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2rem] space-y-4">
                 <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-pink-500" />
                    <h4 className="font-bold">TikTok Shop Integration</h4>
                 </div>
                 <p className="text-xs text-neutral-500 leading-relaxed">
                    1. Đăng nhập TikTok Seller Center.<br/>
                    2. Tìm mục **App & Service Control**.<br/>
                    3. Subscribe Webhook URL của hệ thống OmniAI.<br/>
                    4. Hoàn tất kết nối tại menu **Channels**.
                 </p>
                 <button className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest pt-2">
                    Xem hướng dẫn chi tiết <ExternalLink className="h-3 w-3" />
                 </button>
              </div>

              <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2rem] space-y-4">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-400" />
                    <h4 className="font-bold">Shopee Integration</h4>
                 </div>
                 <p className="text-xs text-neutral-500 leading-relaxed">
                    1. Truy cập Shopee Open Platform.<br/>
                    2. Kết nối Shop của bạn với App ID `OMNI-AI-PRO`.<br/>
                    3. Grant permission cho mục Chat & Webhook.<br/>
                    4. Token sẽ tự động được gia hạn mỗi 365 ngày.
                 </p>
                 <button className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest pt-2">
                    Xem hướng dẫn chi tiết <ExternalLink className="h-3 w-3" />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

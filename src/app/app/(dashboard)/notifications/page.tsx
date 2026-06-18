"use client";

import React, { useEffect, useState } from "react";
import { Bell, Send, Mail, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useShopId } from "@/lib/use-shop";
import { fetchAlertConfig, saveAlertConfig, testAlert, fetchNotifications } from "@/lib/api";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const shopId = useShopId();
  const [tab, setTab] = useState<"history" | "channels">("history");
  const [config, setConfig] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchAlertConfig(shopId).then(setConfig),
      fetchNotifications(shopId).then(d => setNotifications(Array.isArray(d) ? d : d?.notifications || [])),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAlertConfig(shopId, config);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const levelIcon = (level: string) => {
    switch (level?.toUpperCase()) {
      case "SUCCESS": return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "WARNING": return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "ERROR": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  if (loading) return <div className="p-10 text-neutral-500">Loading notifications...</div>;

  return (
    <div className="max-w-5xl space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bell className="h-8 w-8 text-amber-400" />
          Notifications
        </h1>
        <p className="text-neutral-400 mt-1">Xem lịch sử thông báo và cấu hình kênh nhận thông báo.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
        <button onClick={() => setTab("history")}
          className={cn("px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
            tab === "history" ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white")}>
          History
        </button>
        <button onClick={() => setTab("channels")}
          className={cn("px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
            tab === "channels" ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white")}>
          Channels
        </button>
      </div>

      {tab === "history" ? (
        /* Notification History */
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Notification History</h3>
            <button className="text-[10px] text-blue-400 hover:underline flex items-center gap-1">
              <CheckCheck className="h-3 w-3" /> Mark all read
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="py-16 text-center text-neutral-600">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {notifications.map((n: any, i: number) => (
                <div key={n.id || i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                  <div className="mt-0.5">{levelIcon(n.level)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{n.title}</p>
                    {n.content && <p className="text-xs text-neutral-400 mt-0.5">{n.content}</p>}
                    {n.metadata && Object.keys(n.metadata).length > 0 && (
                      <div className="flex gap-2 mt-1.5 flex-wrap">
                        {Object.entries(n.metadata).map(([k, v]) => (
                          <span key={k} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-500">
                            {k}: {String(v)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {n.createdAt && (
                    <span className="text-[10px] text-neutral-600 shrink-0">
                      {new Date(n.createdAt).toLocaleString("vi-VN")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Notification Channels */
        <div className="space-y-6">
          {/* Telegram */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Telegram</h3>
                  <p className="text-sm text-neutral-400">Nhận thông báo Lead và sự kiện qua Telegram.</p>
                </div>
              </div>
              <input type="checkbox" checked={config?.telegramEnabled}
                onChange={(e) => setConfig({ ...config, telegramEnabled: e.target.checked })}
                className="w-10 h-5 appearance-none bg-neutral-800 checked:bg-blue-600 rounded-full cursor-pointer transition-colors relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5.5 before:transition-all" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase">Bot Token</label>
                <input type="password" value={config?.telegramToken || ""}
                  onChange={(e) => setConfig({ ...config, telegramToken: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase">Chat ID</label>
                <input type="text" value={config?.telegramChatId || ""}
                  onChange={(e) => setConfig({ ...config, telegramChatId: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Email Report - disabled */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 space-y-6 opacity-60">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-600 rounded-2xl">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Email Report</h3>
                <p className="text-sm text-neutral-400 italic">Tính năng gửi báo cáo Lead hàng ngày qua Email đang được phát triển.</p>
              </div>
            </div>
          </div>

          {/* Dashboard Bell Toggle */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-600 rounded-2xl shadow-lg shadow-green-500/20">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Notification Bell</h3>
                <p className="text-sm text-neutral-400">Hiển thị thông báo Lead trên thanh Header.</p>
              </div>
            </div>
            <input type="checkbox" checked={config?.dashboardEnabled}
              onChange={(e) => setConfig({ ...config, dashboardEnabled: e.target.checked })}
              className="w-10 h-5 appearance-none bg-neutral-800 checked:bg-green-600 rounded-full cursor-pointer transition-colors relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5.5 before:transition-all" />
          </div>

          <div className="flex items-center gap-4">
            <ShimmerButton onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Config"}
            </ShimmerButton>
            <button onClick={() => testAlert(shopId)}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase transition-all">
              Test Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

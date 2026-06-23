"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { User, Shield, Users, Mail, Crown, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const { t } = useLang();

  return (
    <div className="max-w-5xl space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <User className="h-8 w-8 text-blue-400" />
          Account Settings
        </h1>
        <p className="text-neutral-400 mt-1">{t("settings.subtitle")}</p>
      </div>

      {/* Section 1: Profile */}
      <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Profile</h3>
            <p className="text-sm text-neutral-400">Thông tin cá nhân và gói dịch vụ.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Name</label>
            <p className="text-white font-medium">{user?.name || "—"}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Email</label>
            <p className="text-white font-medium flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-neutral-500" />
              {user?.email || "—"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Current Plan</label>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-400" />
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-bold uppercase",
                user?.plan === "pro" ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" :
                user?.plan === "starter" ? "bg-blue-500/20 text-blue-400 border border-blue-500/20" :
                "bg-zinc-500/20 text-zinc-400 border border-zinc-500/20"
              )}>
                {user?.plan === "pro" ? "Pro (Beta MVP)" : user?.plan === "starter" ? "Starter" : user?.plan || "—"}
              </span>
              <a href="/app/billing" className="text-[10px] text-blue-400 hover:underline ml-2">Usage & Billing →</a>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Team Members (future) */}
      <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-600 rounded-2xl shadow-lg shadow-green-500/20">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Team Members</h3>
              <p className="text-sm text-neutral-400">Thêm nhân viên để cùng quản lý bot và hội thoại.</p>
            </div>
          </div>
          <button disabled
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-neutral-500 cursor-not-allowed flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Invite Member
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {(user?.name || "?").charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{user?.name || "—"}</p>
              <p className="text-[10px] text-neutral-500">{user?.email || "—"}</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase flex items-center gap-1">
              <Shield className="h-3 w-3" /> Owner
            </span>
          </div>
        </div>

        <p className="text-[11px] text-neutral-600 italic border-t border-white/5 pt-4">
          Tính năng team member sẽ cho phép thêm nhân viên trực chat, phân quyền, và quản lý bot theo nhóm.
        </p>
      </div>
    </div>
  );
}

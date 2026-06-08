"use client";

import { useSession } from "next-auth/react";
import { Sidebar } from "./Sidebar";
import { NotificationBell } from "./NotificationBell";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user;
  const shopId = user?.shopId || "N/A";
  const userName = user?.name || user?.email || "User";
  const userEmail = user?.email || "";

  return (
    <div className="flex bg-[#050505] text-white min-h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto bg-gradient-to-br from-black to-[#0a0a0a]">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="text-white font-medium">OmniAI</span>
            <span className="text-neutral-600">/</span>
            <span>Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationBell />
            
            {/* Shop Badge */}
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-neutral-400">{shopId}</span>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left leading-tight">
                <p className="text-xs font-medium text-white">{userName}</p>
                {userEmail && <p className="text-[10px] text-neutral-500">{userEmail}</p>}
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

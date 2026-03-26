"use client";

import React, { useEffect, useState } from "react";
import { Bell, Zap, Calendar, User } from "lucide-react";
import { fetchNotifications } from "@/lib/api";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const shopId = "test_shop";

  useEffect(() => {
    loadNotifications();
    const timer = setInterval(loadNotifications, 30000); // Poll every 30s
    return () => clearInterval(timer);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications(shopId);
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.length); // Simple mock unread
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setUnreadCount(0);
        }}
        className="p-2 hover:bg-white/5 rounded-full transition-colors relative"
      >
        <Bell className="h-5 w-5 text-neutral-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-black" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
               <h4 className="font-bold text-sm">Notifications</h4>
               <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Recent</span>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
               {notifications.length > 0 ? (
                 notifications.map((n, i) => (
                   <div key={i} className="p-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer group">
                      <div className="flex items-start gap-3">
                         <div className={cn(
                           "mt-1 p-1.5 rounded-lg shrink-0",
                           n.level === "SUCCESS" ? "bg-green-500/10 text-green-500" :
                           n.level === "WARNING" ? "bg-yellow-500/10 text-yellow-500" :
                           "bg-blue-500/10 text-blue-500"
                         )}>
                            {n.level === "SUCCESS" ? <Zap className="h-3 w-3" /> : <Bell className="h-3 w-3" />}
                         </div>
                         <div className="space-y-1">
                            <p className="text-sm font-bold group-hover:text-blue-400 transition-colors">{n.title}</p>
                            <p className="text-xs text-neutral-400 line-clamp-2">{n.content}</p>
                            {n.metadata && n.metadata["Khách hàng"] && (
                              <div className="flex items-center gap-1 mt-2 text-[10px] text-neutral-500 bg-white/5 px-2 py-0.5 rounded-md w-fit">
                                 <User className="h-2.5 w-2.5" />
                                 {n.metadata["Khách hàng"]}
                              </div>
                            )}
                         </div>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="p-10 text-center text-neutral-600 text-sm">
                    No new notifications
                 </div>
               )}
            </div>
            
            <div className="p-3 bg-white/[0.02] text-center">
               <button className="text-[10px] text-neutral-500 hover:text-white transition-colors uppercase font-bold tracking-widest">
                  View All Activity
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

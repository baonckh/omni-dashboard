"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { useLang } from "@/lib/i18n";
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  Settings,
  Menu,
  X,
  MessageSquareCode,
  Zap,
  CreditCard,
  Bot,
  Package,
  LogOut,
  Key,
  Bell,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", href: "/app/overview", icon: LayoutDashboard },
  { name: "Inbox", href: "/app/inbox", icon: MessageSquareCode },
  { name: "Channels", href: "/app/channels", icon: Zap },
  { name: "Products", href: "/app/products", icon: Package },
  { name: "Leads", href: "/app/leads", icon: Users },
  { name: "AI Bots", href: "/app/bots", icon: Bot },
  { name: "API Keys", href: "/app/keys", icon: Key },
  { name: "Usage & Billing", href: "/app/billing", icon: CreditCard },
  { name: "Settings", href: "/app/settings", icon: Settings },
  { name: "Notifications", href: "/app/notifications", icon: Bell },
  { name: "Shops", href: "/app/shops", icon: Store },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLang();

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center px-6 gap-3">
        <div className="bg-white rounded-lg p-1.5 shrink-0">
          <Zap className="h-6 w-6 text-black fill-black" />
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-xl text-white tracking-tight truncate"
          >
            Omni<span className="text-neutral-500">AI</span>
          </motion.span>
        )}
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white hover:bg-white/5",
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-black" : "text-neutral-400 group-hover:text-white")} />
              {!isCollapsed && (
                <motion.span
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="font-medium truncate"
                >
                  {item.name}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mb-1">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">{t("nav.logout")}</motion.span>
          )}
        </button>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 border-t border-white/5 text-neutral-500 hover:text-white items-center justify-center transition-colors hidden md:flex"
      >
        {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </button>
    </>
  );

  return (
    <>
      {/* Mobile hamburger — visible only on small screens */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 p-2 rounded-xl bg-black/80 border border-white/10 text-white md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-black/95 border-r border-white/10 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-4 h-16">
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-lg p-1.5"><Zap className="h-5 w-5 text-black fill-black" /></div>
                <span className="font-bold text-lg text-white">Omni<span className="text-neutral-500">AI</span></span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-neutral-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                      isActive ? "bg-white text-black font-medium" : "text-neutral-400 hover:text-white hover:bg-white/5")}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 pb-4">
              <button onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-neutral-500 hover:text-red-400 hover:bg-red-500/5">
                <LogOut className="h-5 w-5" /> {t("nav.logout")}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        className={cn(
          "hidden md:flex flex-col h-screen border-r border-white/10 bg-black/90 backdrop-blur-xl transition-all duration-300 ease-in-out",
        )}
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}

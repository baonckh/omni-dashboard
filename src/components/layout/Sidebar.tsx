"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Inbox", href: "/inbox", icon: MessageSquareCode },
  { name: "Products", href: "/products", icon: Package },
  { name: "Channels", href: "/channels", icon: Zap },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Insights", href: "/insights", icon: BrainCircuit },
  { name: "AI Bots", href: "/bots", icon: Bot },
  { name: "Usage & Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className={cn(
        "relative flex flex-col h-screen border-r border-white/10 bg-black/90 backdrop-blur-xl transition-all duration-300 ease-in-out",
      )}
    >
      {/* Header / Logo */}
      <div className="flex h-16 items-center px-6 gap-3">
        <div className="bg-white rounded-lg p-1.5">
          <Zap className="h-6 w-6 text-black fill-black" />
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-xl text-white tracking-tight"
          >
            Omni<span className="text-neutral-500">AI</span>
          </motion.span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white hover:bg-white/5",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-black" : "text-neutral-400 group-hover:text-white")} />
              {!isCollapsed && (
                <motion.span
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="font-medium"
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

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 border-t border-white/5 text-neutral-500 hover:text-white flex items-center justify-center transition-colors"
      >
        {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </button>
    </motion.aside>
  );
}

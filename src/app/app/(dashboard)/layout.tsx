"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLang } from "@/lib/i18n";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { t } = useLang();
  const checked = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      window.location.href = "/login";
      return;
    }
    if (!session?.user?.backendToken || checked.current) return;
    checked.current = true;

    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${session.user.backendToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.onboarding_complete === true) {
          setReady(true);
        } else {
          // All users go to onboarding - no exceptions
          window.location.replace("/onboarding");
        }
      })
      .catch(() => {
        // Backend down? Show dashboard anyway
        setReady(true);
      });
  }, [status, session]);

  // Full-screen loading overlay - prevents ANY dashboard flash
  if (!ready) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-neutral-500 font-medium">{t("dashboard.loading")}</p>
        </div>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

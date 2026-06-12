"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [decision, setDecision] = useState<"loading" | "onboarding" | "dashboard">("loading");
  const checked = useRef(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      console.log("[AUTH] Unauthenticated → /login");
      router.replace("/login");
      return;
    }
    if (!session?.user?.backendToken) return;
    if (checked.current) return;
    checked.current = true;

    const token = session.user.backendToken;
    console.log("[AUTH] Checking onboarding status...");

    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const complete = data.onboarding_complete === true;
        console.log("[AUTH] Onboarding:", complete ? "✅ done" : "❌ needs onboarding");
        if (complete) {
          setDecision("dashboard");
        } else {
          setDecision("onboarding");
          router.replace("/onboarding");
        }
      })
      .catch((err) => {
        console.error("[AUTH] Failed to check onboarding:", err);
        setDecision("dashboard"); // fallback: show dashboard
      });
  }, [status, session, router]);

  if (status === "loading" || decision === "loading") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-neutral-500 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || decision === "onboarding") {
    return null; // Don't render anything, redirect is happening
  }

  return <>{children}</>;
}

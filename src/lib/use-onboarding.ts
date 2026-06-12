"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Check if user needs to complete onboarding
export function useOnboardingGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;
    const complete = session?.user?.onboardingComplete;
    if (complete === false) {
      router.replace("/onboarding");
    }
  }, [status, session, router]);

  return { loading: status === "loading" };
}

// Mark onboarding as complete (call from deploy step or skip-all)
export async function completeOnboarding(): Promise<boolean> {
  try {
    const session = await import("next-auth/react").then(m => m.getSession());
    const token = session?.user?.backendToken;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const res = await fetch(`${API_BASE}/onboarding/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

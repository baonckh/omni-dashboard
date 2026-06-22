"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

let onboardingCache: boolean | null = null;

async function fetchOnboardingStatus(token: string): Promise<boolean> {
  // Return cached result if already checked (prevents race conditions)
  if (onboardingCache !== null) return onboardingCache;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const data = await res.json();
    onboardingCache = data.onboarding_complete === true;
    return onboardingCache;
  } catch (err) {
    console.error("[ONBOARDING] fetch error:", err);
    return false;
  }
}

// Clear cache after completing onboarding
export function clearOnboardingCache() {
  onboardingCache = null;
}

// Check if user needs to complete onboarding
export function useOnboardingGuard() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const checked = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.backendToken) return;
    if (checked.current) return;
    checked.current = true;

    console.log("[ONBOARDING] Session:", {
      onboardingComplete: session.user.onboardingComplete,
      email: session.user.email,
      shopId: session.user.shopId,
    });

    // Always verify with backend API (session may be stale for existing users)
    fetchOnboardingStatus(session.user.backendToken).then((complete) => {
      console.log("[ONBOARDING] Backend check:", { complete });
      if (complete) {
        // Update session to reflect backend state
        update().then(() => {
          console.log("[ONBOARDING] Session updated");
        });
      } else {
        console.log("[ONBOARDING] Redirecting to /onboarding");
        router.replace("/onboarding");
      }
    });
  }, [status, session, router, update]);

  return { loading: status === "loading" };
}

// Mark onboarding as complete — verifies backend before returning
export async function completeOnboarding(): Promise<boolean> {
  try {
    const session = await import("next-auth/react").then(m => m.getSession());
    const token = session?.user?.backendToken;
    console.log("[ONBOARDING] Completing onboarding...");
    const res = await fetch(`${API_BASE}/onboarding/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      console.error("[ONBOARDING] Complete failed:", res.status);
      return false;
    }
    // Verify backend reflects the change
    onboardingCache = null; // clear cache
    if (token) {
      const verified = await fetchOnboardingStatus(token);
      if (!verified) {
        console.error("[ONBOARDING] Backend still reports incomplete after POST");
        return false;
      }
    }
    console.log("[ONBOARDING] Complete + verified");
    return true;
  } catch (err) {
    console.error("[ONBOARDING] Complete error:", err);
    return false;
  }
}

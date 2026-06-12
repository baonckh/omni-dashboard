"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useOnboardingGuard } from "@/lib/use-onboarding";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { loading } = useOnboardingGuard();

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("[AUTH] Unauthenticated, redirecting to /login");
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-neutral-500 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  console.log("[AUTH] Authenticated, rendering children");
  return <>{children}</>;
}

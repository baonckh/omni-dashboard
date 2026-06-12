"use client";

import { useSession } from "next-auth/react";

export function useShopId(): string {
  const { data: session } = useSession();
  return session?.user?.shopId || "";
}

export function useShops() {
  const { data: session } = useSession();
  return session?.user?.shops || [];
}

export function useCurrentShop() {
  const { data: session } = useSession();
  return session?.user?.shopId || "";
}

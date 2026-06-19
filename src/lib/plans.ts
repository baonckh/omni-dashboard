// ── Plan definitions — ALL from MongoDB via API, NO hardcoded fallback ──

export type PlanTier = "free" | "starter" | "pro" | "enterprise";

export interface PlanLimits {
  maxShops: number;
  maxBots: number;
  maxProducts: number;
  maxConversationsPerMonth: number;
  analyticsDays: number;
  features: string[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
let cachedPlans: Record<string, PlanLimits> | null = null;
let cachePromise: Promise<Record<string, PlanLimits>> | null = null;

export async function fetchPlans(): Promise<Record<string, PlanLimits>> {
  if (cachedPlans) return cachedPlans;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    const res = await fetch(`${API_BASE}/panel-api/plans`);
    const data = await res.json();
    const plans: Record<string, PlanLimits> = {};
    if (data && Array.isArray(data.plans)) {
      for (const p of data.plans) {
        const key = p.id || p._id || p.name?.toLowerCase();
        if (key) {
          plans[key] = {
            maxShops: p.maxShops ?? 0,
            maxBots: p.maxBots ?? 0,
            maxProducts: p.maxProducts ?? 0,
            maxConversationsPerMonth: p.maxConversations ?? 0,
            analyticsDays: p.analyticsDays ?? 0,
            features: p.features ?? [],
          };
        }
      }
    }
    cachedPlans = plans;
    return plans;
  })();

  return cachePromise;
}

export async function getPlan(plan?: string): Promise<PlanLimits> {
  const plans = await fetchPlans();
  return plans[plan || "free"] || { maxShops: 0, maxBots: 0, maxProducts: 0, maxConversationsPerMonth: 0, analyticsDays: 0, features: [] };
}

// ponytail: no fallback — limits come from backend admin panel only
export function getPlanSync(_plan?: string): PlanLimits {
  return { maxShops: 0, maxBots: 0, maxProducts: 0, maxConversationsPerMonth: 0, analyticsDays: 0, features: [] };
}

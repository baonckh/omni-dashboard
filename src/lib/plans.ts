// ── Plan definitions — sync fallback (API-driven optional) ──

export type PlanTier = "beta" | "free" | "starter" | "pro" | "enterprise";

export interface PlanLimits {
  maxShops: number;
  maxBots: number;
  maxProducts: number;
  maxConversationsPerMonth: number;
  analyticsDays: number;
  features: string[];
}

const DEFAULT_PLANS: Record<string, PlanLimits> = {
  beta: { maxShops: 2, maxBots: 3, maxProducts: 100, maxConversationsPerMonth: 500, analyticsDays: 7, features: ["multi_agent", "inbox", "product_import_csv", "basic_insights", "leads"] },
  free: { maxShops: 2, maxBots: 3, maxProducts: 100, maxConversationsPerMonth: 500, analyticsDays: 7, features: ["multi_agent", "inbox", "product_import_csv", "basic_insights", "leads"] },
  starter: { maxShops: 3, maxBots: 10, maxProducts: 500, maxConversationsPerMonth: 3000, analyticsDays: 90, features: ["multi_agent", "inbox", "product_import_csv", "insights", "leads", "telegram_notifications", "email_support", "custom_persona"] },
  pro: { maxShops: 999, maxBots: 999, maxProducts: 9999, maxConversationsPerMonth: 999999, analyticsDays: 999, features: ["multi_agent", "inbox", "product_import_csv", "insights", "leads", "telegram_notifications", "webhook", "custom_persona", "ai_provider_choice", "priority_support"] },
  enterprise: { maxShops: 9999, maxBots: 9999, maxProducts: 99999, maxConversationsPerMonth: 999999, analyticsDays: 999, features: ["multi_agent", "inbox", "product_import_csv", "insights", "leads", "telegram_notifications", "webhook", "custom_persona", "ai_provider_choice", "priority_support", "api_access", "dedicated_support"] },
};

// Sync fallback (used by components that need sync calls)
export function getPlan(plan?: string): PlanLimits {
  return DEFAULT_PLANS[plan || "free"] || DEFAULT_PLANS.free;
}

export function hasFeature(plan: string | undefined, feature: string): boolean {
  return getPlan(plan).features.includes(feature);
}

export function canCreateShop(plan: string | undefined, currentShops: number): boolean {
  return currentShops < getPlan(plan).maxShops;
}

// Async version (fetches from DB via API, falls back to defaults)
export async function fetchPlanLimits(plan?: string): Promise<PlanLimits> {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const res = await fetch(`${API_BASE}/panel-api/plans`);
    const data = await res.json();
    if (data && Array.isArray(data.plans)) {
      for (const p of data.plans) {
        if (p.id === plan || p._id === plan || p.name?.toLowerCase() === plan) {
          return {
            maxShops: p.maxShops ?? 2, maxBots: p.maxBots ?? 3, maxProducts: p.maxProducts ?? 100,
            maxConversationsPerMonth: p.maxConversations ?? 500, analyticsDays: p.analyticsDays ?? 7,
            features: p.features ?? [],
          };
        }
      }
    }
  } catch { /* fallback */ }
  return getPlan(plan);
}

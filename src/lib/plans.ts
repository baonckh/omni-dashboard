// ── Plan definitions — ALL from MongoDB via API, NO hardcoded fallback ──

export type PlanTier = "beta" | "free" | "starter" | "pro" | "enterprise";

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

// ponytail: fallback limits when backend/API is offline — matches seed plans
const FALLBACK_LIMITS: Record<string, PlanLimits> = {
  beta:    { maxShops: 5, maxBots: 10, maxProducts: 500, maxConversationsPerMonth: 5000, analyticsDays: 30, features: ["multi_agent", "inbox", "product_import_csv", "basic_insights", "leads"] },
  free:    { maxShops: 2, maxBots: 3, maxProducts: 100, maxConversationsPerMonth: 500, analyticsDays: 7, features: ["multi_agent", "inbox", "product_import_csv", "basic_insights", "leads"] },
  starter: { maxShops: 3, maxBots: 10, maxProducts: 500, maxConversationsPerMonth: 3000, analyticsDays: 90, features: ["multi_agent", "inbox", "product_import_csv", "insights", "leads", "telegram_notifications", "email_support", "custom_persona"] },
  pro:     { maxShops: 999, maxBots: 999, maxProducts: 9999, maxConversationsPerMonth: 999999, analyticsDays: 999, features: ["multi_agent", "inbox", "product_import_csv", "insights", "leads", "telegram_notifications", "webhook", "custom_persona", "ai_provider_choice", "priority_support"] },
  enterprise: { maxShops: 9999, maxBots: 9999, maxProducts: 99999, maxConversationsPerMonth: 999999, analyticsDays: 999, features: ["multi_agent", "inbox", "product_import_csv", "insights", "leads", "telegram_notifications", "webhook", "custom_persona", "ai_provider_choice", "priority_support", "api_access", "dedicated_support"] },
};

export function getPlanSync(plan?: string): PlanLimits {
  return FALLBACK_LIMITS[plan || "free"] || FALLBACK_LIMITS.free;
}

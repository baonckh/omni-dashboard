// ── Plan definitions & permission framework ──

export type PlanTier = "free" | "starter" | "pro" | "enterprise";

export interface PlanLimits {
  maxShops: number;
  maxBots: number;
  maxProducts: number;
  maxConversationsPerMonth: number;
  analyticsDays: number;
  features: string[];
}

export const PLANS: Record<PlanTier, PlanLimits> = {
  free: {
    maxShops: 2,
    maxBots: 3,
    maxProducts: 100,
    maxConversationsPerMonth: 500,
    analyticsDays: 7,
    features: [
      "multi_agent",
      "inbox",
      "product_import_csv",
      "basic_insights",
      "leads",
    ],
  },
  starter: {
    maxShops: 3,
    maxBots: 10,
    maxProducts: 500,
    maxConversationsPerMonth: 3000,
    analyticsDays: 90,
    features: [
      "multi_agent",
      "inbox",
      "product_import_csv",
      "insights",
      "leads",
      "telegram_notifications",
      "email_support",
      "custom_persona",
      "custom_rules",
    ],
  },
  pro: {
    maxShops: 999,
    maxBots: 999,
    maxProducts: 9999,
    maxConversationsPerMonth: 999999,
    analyticsDays: 999,
    features: [
      "multi_agent",
      "inbox",
      "product_import_csv",
      "insights",
      "leads",
      "telegram_notifications",
      "webhook",
      "custom_persona",
      "custom_rules",
      "ai_provider_choice",
      "product_sync",
      "priority_support",
      "unlimited_shops",
      "unlimited_ai",
    ],
  },
  enterprise: {
    maxShops: 9999,
    maxBots: 9999,
    maxProducts: 99999,
    maxConversationsPerMonth: 999999,
    analyticsDays: 999,
    features: [
      "multi_agent",
      "inbox",
      "product_import_csv",
      "insights",
      "leads",
      "telegram_notifications",
      "webhook",
      "custom_persona",
      "custom_rules",
      "ai_provider_choice",
      "product_sync",
      "priority_support",
      "unlimited_shops",
      "unlimited_ai",
      "api_access",
      "custom_integration",
      "dedicated_support",
      "sla",
    ],
  },
};

export function getPlan(plan?: string): PlanLimits {
  return PLANS[(plan as PlanTier) || "free"] || PLANS.free;
}

export function hasFeature(plan: string | undefined, feature: string): boolean {
  return getPlan(plan).features.includes(feature);
}

export function canCreateShop(plan: string | undefined, currentShops: number): boolean {
  return currentShops < getPlan(plan).maxShops;
}

export function canCreateProduct(plan: string | undefined, currentCount: number): boolean {
  return currentCount < getPlan(plan).maxProducts;
}

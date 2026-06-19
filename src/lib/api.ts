import { getSession } from "next-auth/react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

/** Gets auth headers with backend JWT token */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  try {
    const session = await getSession();
    if (session?.user?.backendToken) {
      headers["Authorization"] = `Bearer ${session.user.backendToken}`;
    }
  } catch {
    // Not authenticated - proceed without token
  }

  return headers;
}

/** Handles API response, redirects to login on 401 */
async function handleResponse(res: Response) {
  if (res.status === 401) {
    // Token expired or invalid - redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }
  return res.json();
}

// === GENERIC API METHODS ===

export const api = {
  async get(endpoint: string, params?: Record<string, any>) {
    const url = new URL(`${API_BASE}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    const headers = await getAuthHeaders();
    const res = await fetch(url.toString(), { headers });
    return handleResponse(res);
  },

  async post(endpoint: string, body: any, params?: Record<string, any>) {
    const url = new URL(`${API_BASE}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    const headers = await getAuthHeaders();
    const res = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async put(endpoint: string, body: any, params?: Record<string, any>) {
    const url = new URL(`${API_BASE}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    const headers = await getAuthHeaders();
    const res = await fetch(url.toString(), {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async post_form(endpoint: string, formData: FormData) {
    const headers = await getAuthHeaders();
    delete headers["Content-Type"]; // Let browser set multipart boundary
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });
    return handleResponse(res);
  },

  async delete(endpoint: string, params?: Record<string, any>) {
    const url = new URL(`${API_BASE}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    const headers = await getAuthHeaders();
    const res = await fetch(url.toString(), { method: "DELETE", headers });
    return handleResponse(res);
  },
};

// === SPECIFIC API METHODS (updated to use `api.*`) ===

export async function fetchLeads(shopId: string) {
  return api.get(`/admin/leads/${shopId}`);
}

export async function updateLeadStatus(leadId: string, status: string) {
  return api.post(`/admin/leads/status`, { id: leadId, status });
}

export async function fetchInsights(shopId: string) {
  return api.get(`/admin/insights/${shopId}`);
}

export async function fetchChannels(shopId: string) {
  return api.get(`/admin/channels/${shopId}`);
}

export async function getConnectUrl(platform: string, shopId: string) {
  return api.get(`/admin/channels/connect?platform=${platform}&shopId=${shopId}`);
}

// === ALERTS ===

export async function fetchAlertConfig(shopId: string) {
  return api.get(`/admin/alerts/${shopId}/config`);
}

export async function saveAlertConfig(shopId: string, config: any) {
  return api.post(`/admin/alerts/${shopId}/config`, config);
}

export async function fetchNotifications(shopId: string) {
  return api.get(`/admin/alerts/${shopId}/notifications`);
}

export async function testAlert(shopId: string) {
  return api.post(`/admin/alerts/${shopId}/test`, {});
}

// === INBOX ===

export async function fetchThreads(shopId: string) {
  return api.get(`/admin/inbox/${shopId}/threads`);
}

export async function fetchMessages(threadId: string) {
  return api.get(`/admin/inbox/threads/${threadId}/messages`);
}

export async function sendReply(threadId: string, content: string) {
  return api.post(`/admin/inbox/threads/${threadId}/reply`, { content });
}

export async function updateThreadStatus(threadId: string, status: string) {
  return api.put(`/admin/inbox/threads/${threadId}/status`, { status });
}

// === ANALYTICS ===

export async function fetchAnalytics(shopId: string) {
  return api.get(`/admin/analytics/${shopId}`);
}

// === PERSONA ===

export async function fetchBots(shopId: string) {
  return api.get(`/admin/persona/${shopId}/list`);
}

export async function fetchBot(shopId: string, botId: string) {
  return api.get(`/admin/persona/${shopId}/${botId}`);
}

export async function saveBot(shopId: string, botId: string | null, persona: any) {
  if (botId) {
    return api.put(`/admin/persona/${shopId}/${botId}`, persona);
  }
  return api.post(`/admin/persona/${shopId}`, persona);
}

export async function deleteBot(shopId: string, botId: string) {
  return api.delete(`/admin/persona/${shopId}/${botId}`);
}

// === PLAYGROUND CHAT ===

export async function playgroundChat(data: {
  shopId: string;
  botId?: string;
  senderId: string;
  message: string;
  platform?: string;
  provider?: string;
  model?: string;
}) {
  return api.post(`/admin/chat/playground`, data);
}

// === KNOWLEDGE BASE ===

export async function ingestKnowledge(shopId: string, data: { title: string; content: string; source: string; config?: any }) {
  return api.post(`/admin/knowledge/${shopId}/ingest`, data);
}

export async function ingestWebKnowledge(shopId: string, data: { url: string; recursive: boolean; config?: any }) {
  return api.post(`/admin/knowledge/${shopId}/ingest-web`, data);
}

export async function listKnowledgeDocs(shopId: string) {
  return api.get(`/admin/knowledge/${shopId}/documents`);
}

export async function deleteKnowledgeDoc(shopId: string, docId: string) {
  return api.delete(`/admin/knowledge/${shopId}/documents/${docId}`);
}

export async function updateKnowledgeDoc(shopId: string, docId: string, data: any) {
  return api.put(`/admin/knowledge/${shopId}/documents/${docId}`, data);
}

// === PRODUCTS ===

export async function listProducts(shopId: string) {
  const data = await api.get(`/admin/products/${shopId}?shop_id=${shopId}`);
  if (!data) return { products: [], count: 0 };
  return data;
}

export async function getProduct(shopId: string, productId: string) {
  return api.get(`/admin/products/${shopId}/${productId}?shop_id=${shopId}`);
}

export async function createProduct(shopId: string, data: any) {
  return api.post(`/admin/products/${shopId}?shop_id=${shopId}`, data);
}

export async function updateProduct(shopId: string, productId: string, data: any) {
  return api.put(`/admin/products/${shopId}/${productId}?shop_id=${shopId}`, data);
}

export async function deleteProduct(shopId: string, productId: string) {
  await api.delete(`/admin/products/${shopId}/${productId}?shop_id=${shopId}`);
  return true;
}

// === POLICIES ===

export async function listPolicies(shopId: string) {
  return api.get(`/admin/policies?shop_id=${shopId}`);
}

export async function testKey(shopId: string, provider: string, key: string) {
  return api.post(`/admin/knowledge/${shopId}/test-key`, { provider, key });
}

export async function confirmProducts(shopId: string, products: any[], replace?: boolean) {
  return api.post(`/admin/products/confirm`, { shop_id: shopId, products, replace });
}

export async function createPolicy(shopId: string, title: string, content: string, tags?: string[]) {
  return api.post(`/admin/policies?shop_id=${shopId}`, { title, content, tags });
}

export async function getUsageStats(shopId: string, from?: string, to?: string) {
  const params: Record<string, string> = {};
  if (from) params.from = from;
  if (to) params.to = to;
  return api.get(`/admin/billing/${shopId}/usage`, params);
}

// === BOT SETTINGS ===

export interface APIKey {
  id: string;
  name: string;
  provider: string;
  key: string;
  isActive: boolean;
  status: string;
}

export interface BotSetting {
  id?: string;
  shopId: string;
  themeColor: string;
  botName: string;
  botAvatar: string;
  welcomeMessage: string;
  position: string;
  customCss: string;
  aiConfig: {
    keys: APIKey[];
  };
}

export async function fetchBotSettings(shopId: string): Promise<BotSetting> {
  const DEFAULT_SETTINGS: BotSetting = {
    shopId,
    themeColor: "#3B82F6",
    botName: "OmniAI Assistant",
    botAvatar: "",
    welcomeMessage: "Xin chào! Tôi có thể giúp gì cho bạn?",
    position: "right",
    customCss: "",
    aiConfig: { keys: [] },
  };

  try {
    const data = await api.get(`/admin/settings/${shopId}/bot`);
    return data || DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateBotSettings(shopId: string, settings: BotSetting) {
  return api.post(`/admin/settings/${shopId}/bot`, settings);
}

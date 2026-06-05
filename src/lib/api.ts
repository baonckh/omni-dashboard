const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

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
    const res = await fetch(url.toString());
    return res.json();
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
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
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
    const res = await fetch(url.toString(), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  async post_form(endpoint: string, formData: FormData) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      body: formData,
    });
    return res.json();
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
    const res = await fetch(url.toString(), { method: "DELETE" });
    return res.json();
  },
};

// === SPECIFIC API METHODS ===

export async function fetchLeads(shopId: string) {
  const res = await fetch(`${API_BASE}/admin/leads/${shopId}`);
  return res.json();
}

export async function updateLeadStatus(leadId: string, status: string) {
  const res = await fetch(`${API_BASE}/admin/leads/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: leadId, status }),
  });
  return res.json();
}

export async function fetchInsights(shopId: string) {
  const res = await fetch(`${API_BASE}/admin/insights/${shopId}`);
  return res.json();
}

export async function fetchChannels(shopId: string) {
  const res = await fetch(`${API_BASE}/admin/channels/${shopId}`);
  return res.json();
}

export async function getConnectUrl(platform: string, shopId: string) {
  const res = await fetch(`${API_BASE}/admin/channels/connect?platform=${platform}&shopId=${shopId}`);
  return res.json();
}

// === ALERT & NOTIFICATIONS ===

export async function fetchAlertConfig(shopId: string) {
  const res = await fetch(`${API_BASE}/admin/alerts/${shopId}/config`);
  return res.json();
}

export async function saveAlertConfig(shopId: string, config: any) {
  const res = await fetch(`${API_BASE}/admin/alerts/${shopId}/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  return res.json();
}

export async function fetchNotifications(shopId: string) {
  const res = await fetch(`${API_BASE}/admin/alerts/${shopId}/notifications`);
  return res.json();
}

export async function testAlert(shopId: string) {
  const res = await fetch(`${API_BASE}/admin/alerts/${shopId}/test?shopId=${shopId}`, {
    method: "POST",
  });
  return res.json();
}

// === UNIFIED INBOX ===

export async function fetchThreads(shopId: string) {
  const res = await fetch(`${API_BASE}/admin/inbox/${shopId}/threads`);
  return res.json();
}

export async function fetchMessages(threadId: string) {
  const res = await fetch(`${API_BASE}/admin/inbox/threads/${threadId}/messages`);
  return res.json();
}

export async function sendReply(threadId: string, content: string) {
  const res = await fetch(`${API_BASE}/admin/inbox/threads/${threadId}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

export async function updateThreadStatus(threadId: string, status: string) {
  const res = await fetch(`${API_BASE}/admin/inbox/threads/${threadId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

// === ANALYTICS ===

export async function fetchAnalytics(shopId: string) {
  const res = await fetch(`${API_BASE}/admin/analytics/${shopId}`);
  return res.json();
}

// === PERSONA ===

export async function fetchBots(shopId: string) {
  const res = await fetch(`${API_BASE}/admin/persona/${shopId}/list`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchBot(shopId: string, botId: string) {
  const res = await fetch(`${API_BASE}/admin/persona/${shopId}/${botId}`);
  if (!res.ok) return null;
  return res.json();
}

export async function saveBot(shopId: string, botId: string, persona: any) {
  const url = botId ? `${API_BASE}/admin/persona/${shopId}/${botId}` : `${API_BASE}/admin/persona/${shopId}`;
  const method = botId ? "PUT" : "POST";
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(persona),
  });
  return res.json();
}

export async function deleteBot(shopId: string, botId: string) {
  const res = await fetch(`${API_BASE}/admin/persona/${shopId}/${botId}`, { method: "DELETE" });
  return res.json();
}

// === PLAYGROUND CHAT ===

export async function playgroundChat(data: { shopId: string; botId?: string; senderId: string; message: string; platform?: string; provider?: string; model?: string }) {
  const res = await fetch(`${API_BASE}/admin/chat/playground`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// === KNOWLEDGE BASE ===

export async function ingestKnowledge(shopId: string, data: { title: string; content: string; source: string; config?: any }) {
  const res = await fetch(`${API_BASE}/admin/knowledge/${shopId}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function ingestWebKnowledge(shopId: string, data: { url: string; recursive: boolean; config?: any }) {
  const res = await fetch(`${API_BASE}/admin/knowledge/${shopId}/ingest-web`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function listKnowledgeDocs(shopId: string) {
  const res = await fetch(`${API_BASE}/admin/knowledge/${shopId}/documents`);
  if (!res.ok) return [];
  return res.json();
}

export async function deleteKnowledgeDoc(shopId: string, docId: string) {
  const res = await fetch(`${API_BASE}/admin/knowledge/${shopId}/documents/${docId}`, { method: "DELETE" });
  return res.json();
}

export async function updateKnowledgeDoc(shopId: string, docId: string, data: { title: string; content: string; source: string; config?: any }) {
  const res = await fetch(`${API_BASE}/admin/knowledge/${shopId}/documents/${docId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// === PRODUCTS ===

export async function listProducts(shopId: string) {
  const res = await fetch(`${API_BASE}/admin/products/${shopId}?shop_id=${shopId}`);
  if (!res.ok) return { products: [], count: 0 };
  return res.json();
}

export async function getProduct(shopId: string, productId: string) {
  const res = await fetch(`${API_BASE}/admin/products/${shopId}/${productId}?shop_id=${shopId}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createProduct(shopId: string, data: {
  name: string;
  product_code?: string;
  price: number;
  category?: string;
  description?: string;
  stock?: number;
  images?: string[];
}) {
  const res = await fetch(`${API_BASE}/admin/products/${shopId}?shop_id=${shopId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProduct(shopId: string, productId: string, data: Partial<{
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
}>) {
  const res = await fetch(`${API_BASE}/admin/products/${shopId}/${productId}?shop_id=${shopId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProduct(shopId: string, productId: string) {
  const res = await fetch(`${API_BASE}/admin/products/${shopId}/${productId}?shop_id=${shopId}`, {
    method: "DELETE",
  });
  return res.ok || res.status === 204;
}

// === POLICIES ===

export async function listPolicies(shopId: string) {
  const res = await fetch(`${API_BASE}/admin/policies?shop_id=${shopId}`);
  if (!res.ok) return [];
  return res.json();
}


export async function testKey(shopId: string, provider: string, key: string) {
  const res = await fetch(`${API_BASE}/admin/knowledge/${shopId}/test-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, key }),
  });
  return res.json();
}

export async function getUsageStats(shopId: string, from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  
  const res = await fetch(`${API_BASE}/admin/billing/${shopId}/usage?${params.toString()}`);
  return res.json();
}

// === BOT SETTINGS (AI KEYS & UI) ===

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
    aiConfig: { keys: [] }
  };

  try {
    const res = await fetch(`${API_BASE}/admin/settings/${shopId}/bot`);
    if (!res.ok) {
        console.warn(`Settings not found for shop ${shopId}, using defaults.`);
        return DEFAULT_SETTINGS;
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch bot settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateBotSettings(shopId: string, settings: BotSetting) {
  try {
    const res = await fetch(`${API_BASE}/admin/settings/${settings.shopId}/bot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    return res.json();
  } catch (error) {
    console.error("Failed to update bot settings:", error);
    throw error;
  }
}

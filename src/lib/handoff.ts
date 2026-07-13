// Handoff API calls — silent monitoring + staff handoff
import { api } from "@/lib/api";

export interface HandoffThread {
  id: string;
  shopId: string;
  platform: string;
  customerName: string;
  status: string;
  handoffState: string;
  handoffReason: string;
  staffId?: string;
  messages: Message[];
  updatedAt: string;
}

interface Message {
  role: string;
  senderType: string;
  content: string;
  createdAt: string;
}

export interface AISuggestion {
  id: string;
  threadId: string;
  suggestedReply: string;
  thought: string;
  confidence: number;
  wasUsed: boolean;
  staffEdited: boolean;
  editedReply?: string;
  createdAt: string;
}

/** Get threads needing human attention */
export async function fetchHandoffThreads(shopId: string): Promise<HandoffThread[]> {
  return api.get(`/admin/threads?handoff=needs_human&shopId=${shopId}`);
}

/** Claim a thread */
export async function claimThread(threadId: string, staffId: string): Promise<void> {
  return api.post(`/admin/threads/${threadId}/claim`, { staffId });
}

/** Release back to bot */
export async function releaseThread(threadId: string): Promise<void> {
  return api.post(`/admin/threads/${threadId}/release`, {});
}

/** Staff sends message */
export async function sendStaffMessage(threadId: string, message: string): Promise<void> {
  return api.post(`/admin/threads/${threadId}/message`, { message });
}

/** Get AI suggestions for a thread */
export async function fetchSuggestions(threadId: string): Promise<AISuggestion[]> {
  return api.get(`/admin/suggestions/${threadId}`);
}

/** Use/edit/ignore suggestion */
export async function actionSuggestion(suggestionId: string, action: "used" | "edited" | "ignored", editedReply?: string): Promise<void> {
  return api.put(`/admin/suggestions/${suggestionId}/action`, { action, editedReply });
}

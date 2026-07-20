import { NextRequest, NextResponse } from "next/server";

const OR_KEY = (process.env.OPENROUTER_API_KEY || "").trim();
const OR_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const respond = (body: object, status: number) => {
    const res = NextResponse.json(body, { status });
    res.headers.set("X-Request-ID", requestId);
    return res;
  };
  if (!OR_KEY) return respond({ error: "no key", requestId }, 500);
  const { prompt } = await req.json();
  if (!prompt) return respond({ error: "prompt required", requestId }, 400);
  try {
    const r = await fetch(OR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + OR_KEY,
        "HTTP-Referer": "https://omni-dashboard-tau.vercel.app",
        "X-Title": "OmniAI Tools",
      },
      body: JSON.stringify({ model: "deepseek/deepseek-v4-flash", messages: [{ role: "user", content: prompt }], max_tokens: 1000 }),
    });
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      console.error("OpenRouter reply:", JSON.stringify(data).slice(0, 500));
      return respond({ error: "AI returned empty", requestId, detail: data?.error?.message || "unknown" }, 502);
    }
    return respond({ result: text, requestId }, 200);
  } catch (e: any) {
    return respond({ error: e.message, requestId }, 502);
  }
}

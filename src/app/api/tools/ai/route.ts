import { NextRequest, NextResponse } from "next/server";

const OR_KEY = process.env.OPENROUTER_API_KEY || "";
const OR_URL = "https://openrouter.ai/api/v1/chat/completions";

// ponytail: single API route for all AI tools. Add streaming when traffic > 1k
export async function POST(req: NextRequest) {
  if (!OR_KEY) return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  const { prompt } = await req.json();
  if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });

  try {
    const r = await fetch(OR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + OR_KEY,
        "HTTP-Referer": "https://omni-dashboard-tau.vercel.app",
        "X-Title": "OmniAI Tools",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v4-flash",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      }),
    });
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      console.error("OpenRouter error:", JSON.stringify(data));
      return NextResponse.json({ error: "AI returned empty" }, { status: 502 });
    }
    return NextResponse.json({ result: text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}

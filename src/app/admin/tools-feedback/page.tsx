"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Feedback {
  id: string;
  tool: string;
  rating: "up" | "down";
  comment: string;
  userAgent: string;
  createdAt: string;
}

export default function AdminToolsFeedbackPage() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/v1/panel-api/tools/feedback")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setError("Failed to load"));
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Link href="/admin" className="text-sm text-zinc-500 hover:text-white mb-6 inline-block">← Back</Link>
      <h1 className="text-2xl font-extrabold mb-6">Tool Feedback</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {items.length === 0 && <p className="text-zinc-500">No feedback yet</p>}
      <div className="space-y-3">
        {items.map((f) => (
          <div key={f.id} className="rounded-xl border border-white/10 p-4 text-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${f.rating === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{f.rating}</span>
              <span className="text-zinc-400">{f.tool}</span>
              <span className="text-zinc-600 text-xs ml-auto">{new Date(f.createdAt).toLocaleString()}</span>
            </div>
            {f.comment && <p className="text-zinc-300 mt-1">{f.comment}</p>}
            <p className="text-zinc-600 text-xs mt-1 truncate">{f.userAgent}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

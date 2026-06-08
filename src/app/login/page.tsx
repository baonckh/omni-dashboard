"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bot, Eye, EyeOff } from "lucide-react";
import { signInWithGoogle } from "@/lib/firebase";
import { useLang } from "@/lib/i18n";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) { setError(t("auth.error.invalid")); setLoading(false); return; }
      router.push("/overview");
    } catch { setError(t("auth.error.server")); setLoading(false); }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true); setError("");
    try {
      const idToken = await signInWithGoogle();
      if (!idToken) { setGoogleLoading(false); return; }
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || t("auth.error.google")); setGoogleLoading(false); return; }
      const data = await res.json();
      const result = await signIn("credentials", {
        email: data.email, password: "__GOOGLE__", backendToken: data.token,
        shopId: data.shop_id, userId: data.user_id, name: data.name, redirect: false,
      });
      if (result?.error) { setError(t("auth.error.google")); setGoogleLoading(false); return; }
      router.push("/overview");
    } catch { setError(t("auth.error.google_conn")); setGoogleLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600"><Bot className="h-4 w-4 text-white" /></div>
          <span className="font-bold text-lg">Omni<span className="text-zinc-500">AI</span></span>
        </Link>

        <h1 className="text-xl font-extrabold text-center text-white mb-6">{t("auth.login.title")}</h1>

        {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>}

        <button onClick={handleGoogle} disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {googleLoading ? t("auth.login.loading") : t("auth.login.google")}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-zinc-600">{t("auth.login.divider")}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("auth.login.email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" autoFocus disabled={loading}
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("auth.login.password")}</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" disabled={loading}
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading || !email || !password}
            className="w-full py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-[0.98]">
            {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : t("auth.login.submit")}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          {t("auth.login.no_account")}{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">{t("auth.login.register")}</Link>
        </p>
      </div>
    </div>
  );
}

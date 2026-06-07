"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bot, Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) { setError("Sai email hoặc mật khẩu"); setLoading(false); return; }
      router.push("/overview");
    } catch { setError("Không thể kết nối đến server"); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg">Omni<span className="text-zinc-500">AI</span></span>
        </Link>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com" autoFocus disabled={loading}
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" disabled={loading}
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading || !email || !password}
            className="w-full py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-[0.98]"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}

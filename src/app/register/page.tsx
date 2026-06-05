"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bot, Eye, EyeOff, UserPlus, Mail, User } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
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
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Đăng ký thất bại");
        setLoading(false);
        return;
      }

      // Redirect to onboarding
      router.push("/onboarding");
    } catch {
      setError("Không thể kết nối đến server");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-600/15 to-transparent blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-80 h-80 bg-purple-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 mb-4">
            <Bot className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            Tạo tài khoản
          </h1>
          <p className="text-sm text-neutral-500 mt-1 font-medium">
            Đăng ký để bắt đầu dùng OmniAI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 font-medium">{error}</div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Tên</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên của bạn"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-neutral-700"
                autoFocus disabled={loading} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-neutral-700"
                disabled={loading} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Mật khẩu</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ít nhất 6 ký tự"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-neutral-700"
                disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading || !name || !email || !password || password.length < 6}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm">
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><UserPlus className="h-4 w-4" /> Đăng ký</>
            )}
          </button>

          <p className="text-center text-sm text-neutral-500 pt-2">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
              Đăng nhập
            </Link>
          </p>
        </form>

        <p className="text-center text-[10px] text-neutral-700 mt-6 font-medium uppercase tracking-widest">
          OmniAI • Hệ thống quản trị đa sàn
        </p>
      </div>
    </div>
  );
}

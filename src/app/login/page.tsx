"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bot, Eye, EyeOff, LogIn, Mail } from "lucide-react";

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
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] rounded-full" style={{ background: "radial-gradient(ellipse at center, rgba(37,99,235,0.12) 0%, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: "#2563EB" }}>
              <Bot className="h-4 w-4 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-white">Đăng nhập</h1>
          <p className="text-sm mt-1" style={{ color: "#A1A1AA" }}>Tiếp tục với OmniAI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#FCA5A5" }}>
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#A1A1AA" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" autoFocus disabled={loading}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 placeholder:text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFFFFF" }}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(37,99,235,0.5)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#A1A1AA" }}>Mật khẩu</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" disabled={loading}
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm transition-all duration-200 placeholder:text-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFFFFF" }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(37,99,235,0.5)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#52525B" }}
                onMouseOver={e => e.currentTarget.style.color = "#A1A1AA"}
                onMouseOut={e => e.currentTarget.style.color = "#52525B"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading || !email || !password}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
            onMouseOver={e => { if (!loading) e.currentTarget.style.backgroundColor = "#3B82F6"; }}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#2563EB"}
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "#A1A1AA" }}>
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-medium transition-colors" style={{ color: "#60A5FA" }} onMouseOver={e => e.currentTarget.style.color = "#93C5FD"} onMouseOut={e => e.currentTarget.style.color = "#60A5FA"}>
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập OmniAI — Quản lý CSKH đa sàn | Login",
  description: "Đăng nhập vào OmniAI để quản lý tin nhắn Facebook, Zalo, TikTok, Shopee, Instagram tập trung. AI tự động trả lời khách hàng 24/7.",
  robots: { index: true, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

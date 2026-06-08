import { cookies, headers } from "next/headers";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const headersList = await headers();
  const langCookie = cookieStore.get("lang")?.value;
  const geoCountry = headersList.get("x-vercel-ip-country") || "";
  const isVI = langCookie === "vi" || (!langCookie && geoCountry === "VN");

  return {
    title: isVI
      ? "Đăng nhập OmniAI — Quản lý CSKH đa sàn"
      : "Login | OmniAI — AI Omnichannel Platform",
    description: isVI
      ? "Đăng nhập vào OmniAI để quản lý tin nhắn Facebook, Zalo, TikTok, Shopee, Instagram tập trung. AI tự động trả lời khách hàng 24/7."
      : "Sign in to OmniAI to manage Facebook, Zalo, TikTok, Shopee, Instagram messages in one place. AI auto-replies 24/7.",
    robots: { index: true, follow: true },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

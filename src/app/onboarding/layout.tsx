import type { Metadata } from "next";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Thiết lập OmniAI — Cấu hình AI CSKH cho shop của bạn",
  description: "Thiết lập shop, sản phẩm và tính cách AI cho OmniAI. Cấu hình bot CSKH tự động trả lời khách hàng trên đa sàn.",
  robots: { index: false, follow: false },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

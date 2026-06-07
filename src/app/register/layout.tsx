import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký OmniAI — Dùng thử miễn phí | Tự động hóa CSKH đa sàn",
  description: "Đăng ký OmniAI miễn phí, không cần thẻ tín dụng. Tự động hóa chăm sóc khách hàng đa sàn với AI — kết nối Facebook, Zalo, TikTok, Shopee, Instagram trong 5 phút.",
  robots: { index: true, follow: true },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

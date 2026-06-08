import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảng giá OmniAI | Dùng thử miễn phí",
  description: "OmniAI pricing — Free, Starter, Pro. Dùng thử miễn phí cho chủ shop SME. Tự động hóa CSKH đa sàn với AI.",
  robots: { index: true, follow: true },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

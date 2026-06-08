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
      ? "Đăng ký OmniAI — Dùng thử miễn phí | Tự động hóa CSKH đa sàn"
      : "Register | OmniAI — Try Free | AI Customer Service Automation",
    description: isVI
      ? "Đăng ký OmniAI miễn phí, không cần thẻ tín dụng. Tự động hóa chăm sóc khách hàng đa sàn với AI — kết nối Facebook, Zalo, TikTok, Shopee, Instagram trong 5 phút."
      : "Register for OmniAI free — no credit card needed. Automate customer service across Facebook, Zalo, TikTok, Shopee, Instagram in 5 minutes.",
    robots: { index: true, follow: true },
  };
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

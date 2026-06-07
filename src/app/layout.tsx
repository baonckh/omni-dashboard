import type { Metadata } from "next";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/be-vietnam-pro/800.css";
import "@fontsource/be-vietnam-pro/900.css";
import SessionProvider from "@/components/SessionProvider";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OmniAI — AI Omnichannel Platform | Tự động hóa CSKH đa sàn",
    template: "%s | OmniAI",
  },
  description:
    "Tự động hóa chăm sóc khách hàng đa sàn với AI. Kết nối Facebook, Zalo, TikTok Shop, Shopee, Instagram — AI tự động trả lời 24/7.",
  openGraph: {
    title: "OmniAI — AI Omnichannel Platform",
    description:
      "Tự động hóa chăm sóc khách hàng đa sàn với AI. Kết nối Facebook, Zalo, TikTok Shop, Shopee, Instagram — AI tự động trả lời 24/7.",
    url: "https://omni-ai.com",
    siteName: "OmniAI",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniAI — AI Omnichannel Platform",
    description:
      "Tự động hóa chăm sóc khách hàng đa sàn với AI.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://omni-ai.com" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body
        className="font-sans antialiased selection:bg-white/20"
        suppressHydrationWarning
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-blue-600 focus:text-white focus:text-sm focus:font-bold">
          Skip to content
        </a>
        <SessionProvider>
          <LangProvider>{children}</LangProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

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
  title: "OmniAI — AI Omnichannel Platform",
  description: "Tự động hóa chăm sóc khách hàng đa sàn với AI. Kết nối Facebook, TikTok, Shopee, Zalo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body
        className="font-be-vietnam antialiased selection:bg-white/20"
        suppressHydrationWarning
      >
        <SessionProvider>
          <LangProvider>{children}</LangProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

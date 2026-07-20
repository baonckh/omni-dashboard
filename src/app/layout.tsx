import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Script from "next/script";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/be-vietnam-pro/800.css";
import "@fontsource/be-vietnam-pro/900.css";
import SessionProvider from "@/components/SessionProvider";
import { LangProvider, type Lang } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "OmniAI — AI Omnichannel Platform | Tự động hóa CSKH đa sàn", template: "%s | OmniAI" },
  description: "Tự động hóa chăm sóc khách hàng đa sàn với AI. Kết nối Facebook, Zalo, TikTok Shop, Shopee, Instagram — AI tự động trả lời 24/7.",
  openGraph: { title: "OmniAI — AI Omnichannel Platform", description: "Tự động hóa chăm sóc khách hàng đa sàn với AI.", url: "https://omni-dashboard-tau.vercel.app", siteName: "OmniAI", locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: "OmniAI — AI Omnichannel Platform", description: "Tự động hóa chăm sóc khách hàng đa sàn với AI." },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://omni-dashboard-tau.vercel.app", languages: { vi: "https://omni-dashboard-tau.vercel.app", en: "https://omni-dashboard-tau.vercel.app/en" } },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: "OmniAI", url: "https://omni-dashboard-tau.vercel.app", description: "AI Omnichannel customer service platform for Vietnamese SMEs", contactPoint: { "@type": "ContactPoint", email: "hello@omni-ai.com", contactType: "customer support" } },
    { "@type": "SoftwareApplication", name: "OmniAI", operatingSystem: "Web", applicationCategory: "BusinessApplication", description: "AI Omnichannel platform for SMEs. Connect Facebook, Zalo, TikTok, Shopee, Instagram.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const headersList = await headers();
  const langFromPrefix = headersList.get("x-lang") || "";
  const langCookie = cookieStore.get("lang")?.value;
  const geoCountry = headersList.get("x-vercel-ip-country") || "";
  let initialLang: Lang = "vi";
  if (langFromPrefix && (langFromPrefix === "vi" || langFromPrefix === "en")) initialLang = langFromPrefix as Lang;
  else if (langCookie === "vi" || langCookie === "en") initialLang = langCookie;
  else initialLang = geoCountry === "VN" ? "vi" : "en";

  return (
    <html lang={initialLang} className="dark" suppressHydrationWarning>
      <head />
      <body className="font-sans antialiased selection:bg-white/20" suppressHydrationWarning>
        <Script id="schema-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','" + process.env.NEXT_PUBLIC_GA_ID + "');" }} />
          </>
        )}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-blue-600 focus:text-white focus:text-sm focus:font-bold">Skip to content</a>
        <SessionProvider>
          <LangProvider initialLang={initialLang}>
            <nav className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto rounded-2xl border border-white/10 bg-black/70 backdrop-blur-2xl shadow-2xl h-14 flex items-center px-5">
              <a href="/" className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-white"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
                </div>
                <span className="font-bold text-base text-white">Omni<span className="text-zinc-500">AI</span></span>
              </a>
              <div className="ml-auto flex items-center gap-3 text-xs font-medium">
                <a href="/tools" className="text-zinc-400 hover:text-white transition-colors">Tools</a>
                <a href="/login" className="text-zinc-400 hover:text-white transition-colors">Đăng nhập</a>
                <a href="/register" className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors">Dùng thử</a>
              </div>
            </nav>
            <main id="main-content" className="pt-20">{children}</main>
            <footer className="border-t border-white/10 py-8 px-5 text-center text-xs text-zinc-600">
              <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p>&copy; 2026 OmniAI</p>
                <div className="flex items-center gap-4">
                  <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                  <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                  <a href="/tools" className="hover:text-white transition-colors">Tools</a>
                </div>
              </div>
            </footer>
          </LangProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

import { cookies, headers } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const headersList = await headers();

  const langCookie = cookieStore.get("lang")?.value || "(none)";
  const geoCountry = headersList.get("x-vercel-ip-country") || "(not detected)";
  const geoCity = headersList.get("x-vercel-ip-city") || "(unknown)";
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "(unknown)";
  const userAgent = headersList.get("user-agent") || "";

  const detectedLang = geoCountry === "VN" ? "vi" : "en";
  const finalLang = langCookie === "vi" || langCookie === "en" ? langCookie : detectedLang;

  return Response.json({
    geo: {
      country: geoCountry,
      city: geoCity,
      ip: ip?.split(",")[0]?.trim(),
    },
    cookies: {
      lang: langCookie,
    },
    language: {
      detected_from_geo: detectedLang,
      final_from_cookie_or_geo: finalLang,
    },
    note: "Nếu country=US dù bạn ở VN → ISP/VPN đang route qua Mỹ. Vẫn set EN đúng logic.",
  });
}

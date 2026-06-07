import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Check if lang cookie already exists
  const langCookie = request.cookies.get("lang")?.value;
  if (langCookie === "vi" || langCookie === "en") {
    return NextResponse.next();
  }

  // Detect country from Vercel header (added automatically on Vercel edge)
  const country = request.headers.get("x-vercel-ip-country") || "";
  const defaultLang = country === "VN" ? "vi" : "en";

  console.log(`[PROXY] IP country=${country}, lang=${defaultLang}`);

  // Set lang cookie (30 days)
  const response = NextResponse.next();
  response.cookies.set("lang", defaultLang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  return response;
}

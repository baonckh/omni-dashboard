import { NextResponse, NextRequest } from "next/server";

const LANGUAGES = ["vi", "en"];
const DEFAULT_LANG = "vi";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static/API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Detect lang from /en/ /vi/ prefix, strip it
  const maybeLang = pathname.split("/")[1];
  let lang = DEFAULT_LANG;
  let rest = pathname;

  if (LANGUAGES.includes(maybeLang)) {
    lang = maybeLang;
    rest = pathname.slice(3) || "/";
  } else {
    // No prefix: use cookie or geo
    const langCookie = request.cookies.get("lang")?.value;
    if (langCookie && LANGUAGES.includes(langCookie)) {
      lang = langCookie;
    } else {
      const country = request.headers.get("x-vercel-ip-country") || "";
      lang = country === "VN" ? "vi" : "en";
    }
  }

  // Rewrite if prefix was stripped, otherwise keep
  const res = rest === pathname
    ? NextResponse.next()
    : NextResponse.rewrite(new URL(rest, request.url));

  // Set lang cookie + header for SSR
  res.headers.set("x-lang", lang);
  res.cookies.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });

  return res;
}

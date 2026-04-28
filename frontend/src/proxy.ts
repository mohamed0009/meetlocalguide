import { NextResponse, type NextRequest } from "next/server";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

const CANONICAL_HOST = "meetlocalguide.com";
const WWW_HOST = `www.${CANONICAL_HOST}`;
const LOCALE_COOKIE = "mlg_locale";

function detectLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const ranges = header
    .split(",")
    .map((part) => {
      const [tag, q = "q=1"] = part.trim().split(";");
      const quality = Number(q.split("=")[1]) || 0;
      return { tag: tag.toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranges) {
    const primary = tag.split("-")[0] as Locale;
    if (SUPPORTED_LOCALES.includes(primary)) return primary;
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  // 1. Canonical host: www → apex
  const hostHeader = request.headers.get("host")?.toLowerCase();
  if (hostHeader === WWW_HOST) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = CANONICAL_HOST;
    return NextResponse.redirect(redirectUrl, 308);
  }

  // 2. Locale routing: ensure every public path is locale-prefixed
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (pathnameHasLocale) return NextResponse.next();

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;
  const locale =
    cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)
      ? cookieLocale
      : detectLocaleFromAcceptLanguage(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, static files, and SEO files
  matcher: [
    "/((?!_next/static|_next/image|api|favicon.ico|robots.txt|sitemap.xml|images|.*\\..*).*)",
  ],
};

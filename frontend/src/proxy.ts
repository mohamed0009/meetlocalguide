import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const CANONICAL_HOST = "meetlocalguide.com";
const WWW_HOST = `www.${CANONICAL_HOST}`;

export function proxy(request: NextRequest) {
  const hostHeader = request.headers.get("host")?.toLowerCase();

  if (hostHeader === WWW_HOST) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = CANONICAL_HOST;
    return NextResponse.redirect(redirectUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME } from "./src/helpers/auth-cookie-name";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/* has its own separate auth (a different password/cookie, checked by the admin
  // pages themselves via getServerSideProps) — it's an internal tool, not partner-facing, so
  // it must never be gated by the partner cookie check below.
  if (pathname.includes("/login") || pathname.startsWith("/api/") || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(COOKIE_NAME);
  if (!authCookie || authCookie.value !== "authenticated") {
    const loginPath = request.nextUrl.locale === "hr" ? "/hr/login" : "/login";
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/", // the negative-lookahead pattern above doesn't match the bare root path
  ],
};

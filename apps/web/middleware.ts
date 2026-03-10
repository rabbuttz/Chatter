import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DEMO_SESSION_COOKIE = "ichijiuke_demo_session";
const authRoutes = new Set(["/login", "/signup"]);
const protectedPrefixes = ["/dashboard", "/setup", "/settings", "/inbox"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(DEMO_SESSION_COOKIE)?.value);

  if (isProtectedPath(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("next", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  if (authRoutes.has(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/setup/:path*", "/settings/:path*", "/inbox/:path*", "/login", "/signup"],
};

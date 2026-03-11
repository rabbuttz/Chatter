import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  isDemoFallbackEnabled,
  isProductionPersistenceEnabled,
} from "@/lib/env";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-token";

const authRoutes = new Set(["/login", "/signup"]);
const protectedPrefixes = ["/dashboard", "/setup", "/settings", "/inbox"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

async function resolveHasSession(request: NextRequest) {
  const rawToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (!rawToken) {
    return false;
  }

  if (isDemoFallbackEnabled()) {
    return true;
  }

  if (!isProductionPersistenceEnabled()) {
    return false;
  }

  const payload = await verifySessionToken(rawToken);

  return Boolean(payload);
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = await resolveHasSession(request);

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
  matcher: [
    "/dashboard/:path*",
    "/setup/:path*",
    "/settings/:path*",
    "/inbox/:path*",
    "/login",
    "/signup",
  ],
};

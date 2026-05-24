import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "./lib/admin-session";

const PROTECTED_ADMIN_PATHS = ["/admin", "/admin/dashboard", "/admin/products", "/admin/orders", "/admin/delivery", "/admin/settings", "/admin/setup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAdminSession = Boolean(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isApiAdminPath = pathname.startsWith("/api/admin/");

  if (pathname === "/admin/login" && hasAdminSession) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (isAdminPath && pathname !== "/admin/login") {
    const needsProtection = PROTECTED_ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    if (needsProtection && !hasAdminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (pathname === "/admin") {
      return NextResponse.redirect(new URL(hasAdminSession ? "/admin/dashboard" : "/admin/login", request.url));
    }
  }

  if (isApiAdminPath && !hasAdminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};

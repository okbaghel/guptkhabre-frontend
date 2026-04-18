import { NextResponse } from "next/server";

export function middleware(req) {
  const isAdminAuthenticated = req.cookies.get("admin_auth")?.value === "1";
  const { pathname } = req.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAdminAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

// Apply only on admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
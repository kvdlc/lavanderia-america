import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientRoutes = pathname.startsWith("/cliente");
  const adminRoutes = pathname.startsWith("/admin");

  if (!clientRoutes && !adminRoutes) {
    return NextResponse.next();
  }

  // Check for Supabase auth cookies (sb-*-auth-token)
  const hasAuthCookie = request.cookies.getAll().some(
    (c) => c.name.includes("auth-token") || c.name.includes("supabase")
  );

  if (!hasAuthCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cliente/:path*"],
};

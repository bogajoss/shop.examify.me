import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token");
  const adminToken = request.cookies.get("admin-token");
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // Allow public access to login page
    if (pathname === "/admin/login") {
      if (adminToken) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Protect all other admin routes
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    return NextResponse.next();
  }

  // Protect dashboard and checkout routes (Student)
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/checkout")
  ) {
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === "/login") {
    if (authToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/login", "/admin/:path*"],
};

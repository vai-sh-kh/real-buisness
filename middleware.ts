import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import type { AdminSession } from "@/types";

const SESSION_OPTIONS = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect all /admin/* routes (except login)
  if (pathname.startsWith("/admin/")) {
    const response = NextResponse.next();

    // Read session from cookies
    const session = await getIronSession<AdminSession>(
      request,
      response,
      SESSION_OPTIONS
    );

    if (!session.isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

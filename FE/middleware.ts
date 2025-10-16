import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  console.log("Middleware check:", {
    pathname,
    role: token?.role,
    tokenExists: !!token,
  });

  // 🔒 CHẶN /dashboard cho người không phải ADMIN
  if (pathname.startsWith("/dashboard")) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

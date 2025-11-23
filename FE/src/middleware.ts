import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

  console.log("Middleware check:", {
    path: req.nextUrl.pathname,
    hasToken: !!token,
    role: token?.role || "none",
  });

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/dashboard") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

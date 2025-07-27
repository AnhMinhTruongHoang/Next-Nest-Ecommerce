import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Matches the pages config in `[...nextauth]`
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    "/playlist",
    "/track/upload",
    "/like",
    "/((?!api|_next/static|_next/image|favicon.ico|auth|verify|$).*)",
  ],
};

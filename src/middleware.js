import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && role !== "admin")
      return NextResponse.redirect(new URL("/", req.url));
    if (path.startsWith("/caretaker") && role !== "caretaker")
      return NextResponse.redirect(new URL("/", req.url));
  },
  { callbacks: { authorized: ({ token }) => !!token } }
);

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/caretaker/:path*"],
};

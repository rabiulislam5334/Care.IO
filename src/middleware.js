import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;

    // ❌ API route গুলোতে middleware redirect করবে না
    if (path.startsWith("/api")) {
      return NextResponse.next();
    }

    const role = req.nextauth.token?.role;

    // ১. অ্যাডমিন প্রোটেকশন
    if (path.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }

    // ২. কেয়ারটেকার প্রোটেকশন
    if (path.startsWith("/dashboard/caretaker") && role !== "caretaker") {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }

    // ৩. ইউজার প্রোটেকশন (অপশনাল)
    if (path.startsWith("/dashboard/user") && !role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};

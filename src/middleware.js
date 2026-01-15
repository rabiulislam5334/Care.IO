import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    // ১. অ্যাডমিন প্রোটেকশন
    if (path.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }

    // ২. কেয়ারটেকার প্রোটেকশন
    if (path.startsWith("/dashboard/caretaker") && role !== "caretaker") {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }

    // ৩. ইউজার প্রোটেকশন (অপশনাল: যদি চান ইউজার ছাড়া অন্য কেউ /dashboard/user এ আসবে না)
    if (path.startsWith("/dashboard/user") && !role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // টোকেন না থাকলে অটো লগইন পেজে পাঠাবে
    },
  }
);

export const config = {
  // আপনার বর্তমান URL স্ট্রাকচার অনুযায়ী পাথগুলো আপডেট করা হয়েছে
  matcher: ["/dashboard/:path*"],
};

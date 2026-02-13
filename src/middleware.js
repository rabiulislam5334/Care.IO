// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   function middleware(req) {
//     const path = req.nextUrl.pathname;

//     // ❌ API route গুলোতে middleware redirect করবে না
//     if (path.startsWith("/api")) {
//       return NextResponse.next();
//     }

//     const role = req.nextauth.token?.role;

//     // ১. অ্যাডমিন প্রোটেকশন
//     if (path.startsWith("/dashboard/admin") && role !== "admin") {
//       return NextResponse.redirect(new URL("/dashboard/user", req.url));
//     }

//     // ২. কেয়ারটেকার প্রোটেকশন
//     if (path.startsWith("/dashboard/caretaker") && role !== "caretaker") {
//       return NextResponse.redirect(new URL("/dashboard/user", req.url));
//     }

//     // ৩. ইউজার প্রোটেকশন (অপশনাল)
//     if (path.startsWith("/dashboard/user") && !role) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = req.nextUrl.pathname;

  // ❌ API route skip
  if (path.startsWith("/api")) {
    return NextResponse.next();
  }

  // 🔐 Not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = token.role;

  // 🛑 Admin protection
  if (path.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/user", req.url));
  }

  // 🛑 Caretaker protection
  if (path.startsWith("/dashboard/caretaker") && role !== "caretaker") {
    return NextResponse.redirect(new URL("/dashboard/user", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

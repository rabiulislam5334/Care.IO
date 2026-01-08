import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AnimationProvider from "@/components/AnimationProvider"; // আগে তৈরি করা AOS প্রোভাইডার
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// অ্যাসাইনমেন্ট অনুযায়ী মেটাডাটা আপডেট
export const metadata = {
  title: "Care.IO | Trusted Caregiving Services",
  description: "Reliable care services for children, elderly, and sick people.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-slate-50 text-slate-900`}
      >
        {/* Next-Auth সেশন প্রোভাইডার */}
        <AuthProvider>
          {/* AOS স্ক্রল অ্যানিমেশন প্রোভাইডার */}
          <AnimationProvider>
            {/* নোটিফিকেশন এর জন্য Toaster */}
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar></Navbar>
            <main className="min-h-screen">{children}</main>
            <Footer></Footer>
          </AnimationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

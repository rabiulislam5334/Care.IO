"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // আপনার ফোল্ডার স্ট্রাকচার (dashboard) হলে সরাসরি /admin বা /user চেক করুন
  const isDashboard =
    pathname.startsWith("/admin") || pathname.startsWith("/user");

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}

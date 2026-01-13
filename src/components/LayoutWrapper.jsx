"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // যেহেতু আপনি (dashboard) থেকে ব্র্যাকেট সরিয়ে দিয়েছেন,
  // তাই এখন পাথ /dashboard দিয়ে শুরু হচ্ছে কি না তা চেক করতে হবে।
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {/* যদি ইউআরএল /dashboard দিয়ে শুরু না হয়, তবেই নেভবার এবং ফুটার দেখাবে */}
      {!isDashboard && <Navbar />}

      <main className={!isDashboard ? "min-h-screen" : ""}>{children}</main>

      {!isDashboard && <Footer />}
    </>
  );
}

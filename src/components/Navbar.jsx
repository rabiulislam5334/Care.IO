"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Home,
  Info,
  PhoneCall,
  Briefcase,
} from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // যেহেতু এখন ফোল্ডারটির নাম 'dashboard', তাই চেক করার নিয়ম এটি:
  // এটি ড্যাশবোর্ড পেজগুলোতে মেইন নেভবার হাইড রাখবে
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) return null;

  // লগইন থাকলে ইউজারের রোল অনুযায়ী সঠিক ড্যাশবোর্ড লিঙ্ক (সংশোধিত)
  const dashboardLink =
    session?.user?.role === "admin"
      ? "/dashboard/admin"
      : session?.user?.role === "caretaker"
      ? "/dashboard/caretaker"
      : "/dashboard/user";

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Services", path: "/services", icon: <Briefcase size={18} /> },
    { name: "About", path: "/about", icon: <Info size={18} /> },
    { name: "Contact", path: "/contact", icon: <PhoneCall size={18} /> },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="w-11/12 mx-auto flex justify-between items-center h-20">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black text-blue-600 tracking-tighter flex items-center gap-2"
        >
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white italic shadow-lg shadow-blue-200">
            C
          </div>
          Care.IO
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 border-r border-slate-100 pr-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-bold transition-all text-sm flex items-center gap-1.5 ${
                  pathname === link.path
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <Link
                href={dashboardLink}
                className="flex items-center gap-2 font-bold text-blue-600 bg-blue-50 px-5 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="font-bold text-slate-600 px-4 py-2 hover:text-blue-600 transition-all text-sm"
              >
                Login
              </Link>
              <Link href="/register">
                <button className="bg-blue-600 text-white px-7 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95">
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 p-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className="block font-bold text-slate-600"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100">
            {status === "authenticated" ? (
              <Link
                href={dashboardLink}
                onClick={() => setIsOpen(false)}
                className="block font-bold text-blue-600"
              >
                Dashboard
              </Link>
            ) : (
              <div className="space-y-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block font-bold text-slate-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block font-bold text-blue-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

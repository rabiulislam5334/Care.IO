"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="w-11/12 mx-auto h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black text-blue-600 tracking-tighter"
        >
          Care.IO
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-all">
            Home
          </Link>
          <Link href="/services" className="hover:text-blue-600 transition-all">
            Services
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition-all">
            About Us
          </Link>

          {session ? (
            <div className="flex items-center gap-4 border-l pl-8 border-slate-200">
              <Link
                href={`/${session.user.role}`}
                className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition-all"
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <img
                src={session.user.image}
                className="w-10 h-10 rounded-full border-2 border-blue-600 p-0.5"
                alt="User"
              />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-full hover:bg-slate-50 transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            <Link href="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/services" onClick={() => setIsOpen(false)}>
              Services
            </Link>
            <hr />
            {session ? (
              <Link
                href={`/${session.user.role}`}
                className="font-bold text-blue-600"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register" className="font-bold text-blue-600">
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

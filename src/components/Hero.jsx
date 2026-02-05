"use client";
import { motion } from "framer-motion";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-white overflow-hidden">
      <div className="w-11/12 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest mb-6">
            Trusted by 5000+ Families
          </span>
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[1.1] mb-8">
            Quality Care <br />
            <span className="text-blue-600 font-outline">For Your Loves</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed font-medium">
            Find expert caregivers for children, elderly, and patients.
            Experience safe and reliable care right at your doorstep.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              Get Started
            </Link>
            <Link
              href="/services"
              className="border-2 border-slate-100 text-slate-800 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all"
            >
              Our Services
            </Link>
          </div>
        </motion.div>

        {/* Right Image/Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="w-full h-[600px] bg-blue-600 rounded-[3rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl">
            <img
              src="/homecare-why-choose-us.webp"
              alt="Caregiving"
              className="w-full h-full object-cover -rotate-3 hover:rotate-0 transition-transform duration-700"
            />
          </div>
          {/* Floating Card */}
          <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4 animate-bounce">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              ✓
            </div>
            <div>
              <p className="font-black text-slate-800 tracking-tight text-sm">
                Verified Caretakers
              </p>
              <p className="text-xs text-slate-400 font-bold">
                100% Secure System
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

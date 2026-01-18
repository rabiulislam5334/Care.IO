"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ৪-০-৪ সংখ্যাটির জন্য ফ্লোটিং অ্যানিমেশন
      gsap.to(".digit", {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.2,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-white p-6 overflow-hidden"
    >
      <div className="text-center relative z-10">
        {/* এনিমেটেড ৪-০-৪ টেক্সট */}
        <div className="flex justify-center items-center gap-4 mb-8">
          {["4", "0", "4"].map((digit, i) => (
            <span
              key={i}
              className="digit text-[8rem] md:text-[12rem] font-black text-blue-600 leading-none inline-block select-none"
              style={{ textShadow: "15px 15px 0px #eff6ff" }}
            >
              {digit}
            </span>
          ))}
        </div>

        {/* মেইন কন্টেন্ট */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            Lost in Care?
          </h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed text-lg">
            Oops! The page you're looking for has gone on a vacation. Don't
            worry, our caregivers are here to lead you back home.
          </p>

          {/* অ্যাকশন বাটনসমূহ */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all group"
            >
              <Home size={20} />
              Back to Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 border-2 border-slate-100 text-slate-800 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
          <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-60" />
        </div>
      </div>
    </div>
  );
}

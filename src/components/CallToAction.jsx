"use client";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20">
      <div className="w-11/12 mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative">
          Ready to give your family <br /> the care they deserve?
        </h2>
        <Link
          href="/register"
          className="bg-white text-blue-600 px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all inline-block shadow-lg"
        >
          Join Care.IO Today
        </Link>
      </div>
    </section>
  );
}

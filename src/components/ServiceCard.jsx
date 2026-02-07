"use client";
import { MapPin, ArrowRight, User, CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ServiceCard({ service, index }) {
  // সার্ভিস ডাটা না থাকলে এরর হ্যান্ডলিং
  if (!service) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500 flex flex-col h-full"
    >
      {/* ইমেজ সেকশন */}
      <div className="h-56 overflow-hidden relative">
        <img
          src={service.image || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070"} // ডিফল্ট ক্লিন ইমেজ
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={service.category || "Service"}
        />
        {/* লোকেশন ব্যাজ */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-full text-[10px] font-black uppercase shadow-sm flex items-center gap-2 border border-white/20">
          <MapPin size={12} className="text-rose-500" />
          {service.district || "Bangladesh"}
        </div>
      </div>

      {/* টেক্সট সেকশন */}
      <div className="p-8 flex flex-col flex-1">
        <div className="mb-6">
          <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight capitalize flex items-center gap-2 line-clamp-1">
            <CircleCheckBig size={18} className="text-blue-600 shrink-0" />
            {service.category || "General Care"}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 tracking-[0.15em] line-clamp-1">
            <User size={13} className="text-blue-400 shrink-0" />
            {service.userName || "Professional Caretaker"}
          </p>
        </div>

        {/* প্রাইস এবং বাটন */}
        <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Monthly Starts From</p>
            <p className="text-2xl font-black text-blue-600">
              ৳{service.monthlyRate || service.hourlyRate || "N/A"}
            </p>
          </div>
          <Link
            href={`/services/${service._id}`}
            aria-label="View Details"
            className="bg-slate-900 text-white h-14 w-14 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all hover:rotate-[-8deg] shadow-lg shadow-slate-200 group/btn active:scale-95"
          >
            <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
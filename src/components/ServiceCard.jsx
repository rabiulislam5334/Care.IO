"use client";
import { MapPin, ArrowRight, User, CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ServiceCard({ service, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500 flex flex-col h-full"
    >
      {/* ইমেজ সেকশন */}
      <div className="h-52 overflow-hidden relative">
        <img
          src={service.image || "https://placehold.co/600x400?text=No+Photo"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={service.category}
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm flex items-center gap-2">
          <MapPin size={12} className="text-rose-500" />
          {service.district || "Bangladesh"}
        </div>
      </div>

      {/* টেক্সট সেকশন */}
      <div className="p-7 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight capitalize flex items-center gap-2">
            <CircleCheckBig size={16} className="text-blue-600" />
            {service.category || "Care Service"}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 tracking-widest">
            <User size={12} className="text-blue-400" />
            {service.userName || "Care Expert"}
          </p>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase">Monthly</p>
            <p className="text-2xl font-black text-blue-600">
              ৳{service.monthlyRate || service.hourlyRate || "0"}
            </p>
          </div>
          <Link
            href={`/services/${service._id}`}
            className="bg-slate-900 text-white h-12 w-12 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all hover:rotate-[-10deg] shadow-lg shadow-slate-200"
          >
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
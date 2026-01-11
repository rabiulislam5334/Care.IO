"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  ShieldCheck,
  Star,
  ArrowRight,
} from "lucide-react";

// ধরি এটি আমাদের ডাটা (পরবর্তীতে ডাটাবেজ থেকে আসবে)
const serviceData = {
  1: {
    name: "Child Care",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1581578731522-745505146317?q=80&w=2070",
    desc: "Our child care experts are trained to provide a safe, nurturing, and engaging environment for your children while you are away.",
    features: [
      "Verified Caretakers",
      "Emergency Support",
      "First-Aid Trained",
      "Educational Activities",
    ],
  },
  2: {
    name: "Elderly Care",
    price: 700,
    image:
      "https://images.unsplash.com/photo-1516703095085-356c9273646d?q=80&w=2070",
    desc: "Specialized support for seniors, including medication management, mobility assistance, and companionship.",
    features: [
      "Patience & Empathy",
      "Health Monitoring",
      "Nutrition Planning",
      "24/7 Availability",
    ],
  },
};

export default function ServiceDetails({ params }) {
  const service = serviceData[params.id] || serviceData[1]; // fallback data

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section for Service */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src={service.image}
          className="w-full h-full object-cover"
          alt={service.name}
        />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex items-center">
          <div className="w-11/12 mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-white"
            >
              {service.name}
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="w-11/12 mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Content: Description & Features */}
        <div className="lg:col-span-2">
          <section className="mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-6">
              Service Overview
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              {service.desc}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-8">
              What's Included
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <span className="font-bold text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-10">
            <div className="text-center">
              <ShieldCheck className="mx-auto text-blue-600 mb-2" size={32} />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Safe & Secure
              </p>
            </div>
            <div className="text-center">
              <Star className="mx-auto text-amber-400 mb-2" size={32} />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Top Rated
              </p>
            </div>
            <div className="text-center">
              <Clock className="mx-auto text-green-500 mb-2" size={32} />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                On-Time Service
              </p>
            </div>
          </div>
        </div>

        {/* Right Content: Sticky Price Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sticky top-28 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100"
          >
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">
              Starting From
            </p>
            <h3 className="text-5xl font-black text-slate-900 mb-6">
              {service.price}{" "}
              <span className="text-lg text-slate-400 font-medium">
                BDT / Day
              </span>
            </h3>

            <ul className="space-y-4 mb-8">
              <li className="flex justify-between text-sm font-bold text-slate-600">
                <span>Verification Charge</span>
                <span>Included</span>
              </li>
              <li className="flex justify-between text-sm font-bold text-slate-600">
                <span>Support</span>
                <span>24/7</span>
              </li>
            </ul>

            <Link href={`/booking/${params.id}`}>
              <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                Book This Service <ArrowRight size={20} />
              </button>
            </Link>

            <p className="text-center text-xs text-slate-400 mt-6 font-medium">
              No hidden charges. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

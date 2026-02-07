"use client";
import { Search, CalendarCheck, Heart } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Search Expert",
    desc: "Find the perfect caretaker based on your location and needs.",
    icon: <Search className="text-blue-600" size={32} />,
    color: "bg-blue-50",
  },
  {
    title: "Book & Pay",
    desc: "Select dates and confirm your booking with secure payment.",
    icon: <CalendarCheck className="text-emerald-600" size={32} />,
    color: "bg-emerald-50",
  },
  {
    title: "Get Care",
    desc: "Our verified professional arrives at your door to provide care.",
    icon: <Heart className="text-rose-600" size={32} />,
    color: "bg-rose-50",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="w-11/12 max-w-7xl mx-auto text-center">
        {/* Header Section */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-1.5 w-10 bg-blue-600 rounded-full" />
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">Process</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            3 Simple Steps to <span className="text-blue-600 italic">Get Care</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-20 left-1/2 -translate-x-1/2 w-2/3 h-[2px] border-t-2 border-dashed border-slate-100 -z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 group"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white border border-slate-100 text-slate-400 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm group-hover:border-blue-500 group-hover:text-blue-600 transition-colors">
                0{i + 1}
              </div>

              {/* Icon Container */}
              <div className={`w-24 h-24 ${step.color} rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-100 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                {step.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">
                {step.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed px-4 text-sm md:text-base">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
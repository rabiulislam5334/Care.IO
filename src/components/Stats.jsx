"use client";
import { motion } from "framer-motion";
import { Users, Home, MapPin, ShieldCheck } from "lucide-react";

const stats = [
  { 
    label: "Active Caretakers", 
    value: "1,200+", 
    icon: <Users size={20} />,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  { 
    label: "Happy Families", 
    value: "5,000+", 
    icon: <Home size={20} />,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  { 
    label: "Cities Covered", 
    value: "15+", 
    icon: <MapPin size={20} />,
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  { 
    label: "Success Rate", 
    value: "99.9%", 
    icon: <ShieldCheck size={20} />,
    color: "text-rose-600",
    bg: "bg-rose-50"
  },
];

export default function Stats() {
  return (
    <section className="py-24 bg-white relative">
      <div className="w-11/12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.1,
                ease: "easeOut" 
              }}
              className="relative group text-center lg:text-left flex flex-col lg:flex-row items-center gap-5"
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-[10deg] shrink-0 shadow-sm`}>
                {stat.icon}
              </div>

              <div>
                <motion.h3 
                  className="text-3xl md:text-4xl font-black text-slate-900 leading-none mb-1"
                >
                  {stat.value}
                </motion.h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] whitespace-nowrap">
                  {stat.label}
                </p>
              </div>

              {/* Decorative Divider for Desktop */}
              {i !== stats.length - 1 && (
                <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 h-8 w-[1px] bg-slate-100" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
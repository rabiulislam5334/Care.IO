"use client";
import { ShieldCheck, Zap, Users, HeartHandshake, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Verified Experts",
    desc: "Every caretaker goes through a rigorous NID and background verification process.",
    icon: <ShieldCheck size={32} />,
    glow: "group-hover:text-blue-400",
    border: "hover:border-blue-500/30",
  },
  {
    title: "Quick Booking",
    desc: "Book a professional in less than 2 minutes with our instant matching system.",
    icon: <Zap size={32} />,
    glow: "group-hover:text-amber-400",
    border: "hover:border-amber-500/30",
  },
  {
    title: "Community Driven",
    desc: "Over 5,000 families trust us for their most sensitive caregiving needs.",
    icon: <Users size={32} />,
    glow: "group-hover:text-purple-400",
    border: "hover:border-purple-500/30",
  },
  {
    title: "Compassionate Care",
    desc: "We don't just provide service; we provide a hand to hold and a heart to care.",
    icon: <HeartHandshake size={32} />,
    glow: "group-hover:text-rose-400",
    border: "hover:border-rose-500/30",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-32 bg-[#0F172A] text-white overflow-hidden relative">
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      
      <div className="w-11/12 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-8 bg-blue-500" />
              <span className="text-blue-400 font-black uppercase text-[10px] tracking-[0.4em]">
                Why Choose Us
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
              We provide the <span className="text-blue-500">best care</span> <br /> for your loved ones
            </h2>
            
            <p className="text-slate-400 text-lg mb-12 max-w-md font-medium leading-relaxed">
              Care.IO is built on the foundation of trust, safety, and
              professional excellence. We ensure your family gets the dignity they deserve.
            </p>
            
            <button className="group flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all duration-300">
              Learn More About Us
              <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
            </button>
          </motion.div>

          {/* Right Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 ${f.border} transition-all duration-500 hover:-translate-y-2`}
              >
                <div className={`mb-6 text-slate-400 ${f.glow} transition-colors duration-300`}>
                  {f.icon}
                </div>
                <h4 className="text-xl font-black mb-3 text-white group-hover:text-blue-400 transition-colors">
                  {f.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
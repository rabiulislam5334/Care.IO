"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="w-11/12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-blue-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(37,99,235,0.3)]"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[80px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-[80px]" />
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <Sparkles size={14} className="text-yellow-300" />
              Start Your Journey
            </motion.div>

            <h2 className="text-4xl md:text-7xl font-black text-white mb-10 leading-[1.1] tracking-tighter">
              Ready to give your family <br className="hidden md:block" /> 
              the <span className="text-blue-200 italic">care</span> they deserve?
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link
                href="/register"
                className="group bg-white text-blue-600 px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-slate-50 transition-all inline-flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95"
              >
                Join Care.IO Today
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <p className="text-blue-100 font-bold text-sm sm:ml-4">
                Free to join. No hidden fees.
              </p>
            </div>
          </div>

          {/* Background Floating Icon (Optional) */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-10 right-10 text-white/5 hidden lg:block"
          >
            <Sparkles size={120} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Heart, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-slate-50">
        <div className="w-11/12 mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6"
          >
            We Care Like <span className="text-blue-600">Family</span>
          </motion.h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Care.IO is a mission-driven marketplace connecting verified
            caregivers with families in need of compassionate child, elderly,
            and patient care.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-32">
        <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: <ShieldCheck size={40} />,
              title: "Safety First",
              desc: "Rigorous NID and background verification for every caretaker.",
            },
            {
              icon: <Heart size={40} />,
              title: "Pure Compassion",
              desc: "We select caregivers who treat your loved ones with empathy.",
            },
            {
              icon: <Award size={40} />,
              title: "Quality Service",
              desc: "Expertise that ensures professional medical and emotional support.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-blue-50/50 text-center"
            >
              <div className="text-blue-600 flex justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

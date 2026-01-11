"use client";
import { motion } from "framer-motion";

const stats = [
  { label: "Active Caretakers", value: "1,200+" },
  { label: "Happy Families", value: "5,000+" },
  { label: "Cities Covered", value: "15+" },
  { label: "Success Rate", value: "99.9%" },
];

export default function Stats() {
  return (
    <section className="py-20 bg-white">
      <div className="w-11/12 mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <h3 className="text-4xl md:text-5xl font-black text-blue-600 mb-2">
                {stat.value}
              </h3>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

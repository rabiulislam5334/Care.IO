"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const services = [
  {
    id: 1,
    name: "Child Care",
    icon: "👶",
    desc: "Expert care for your little ones.",
    price: 500,
  },
  {
    id: 2,
    name: "Elderly Care",
    icon: "👵",
    desc: "Compassionate help for seniors.",
    price: 700,
  },
  {
    id: 3,
    name: "Sick Care",
    icon: "🏥",
    desc: "Professional nursing at home.",
    price: 1000,
  },
];

export default function ServicesSection() {
  return (
    <section className="py-32 bg-slate-50">
      <div className="w-11/12 mx-auto">
        <div className="text-center mb-20" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Our Specialized Services
          </h2>
          <p className="text-slate-500 font-medium">
            Choose the best care plan that fits your family needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -15 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 group transition-all"
            >
              <div className="text-5xl mb-8 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4">
                {service.name}
              </h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                {service.desc}
              </p>
              <div className="flex justify-between items-center border-t border-slate-50 pt-8">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Starts from
                  </p>
                  <p className="text-xl font-black text-blue-600">
                    {service.price} BDT
                  </p>
                </div>
                <Link
                  href={`/booking/${service.id}`}
                  className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-blue-600 transition-all"
                >
                  →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

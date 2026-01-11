"use client";
import { ShieldCheck, Zap, Users, HeartHandshake } from "lucide-react";

const features = [
  {
    title: "Verified Experts",
    desc: "Every caretaker goes through a rigorous NID and background verification process.",
    icon: <ShieldCheck size={32} className="text-blue-600" />,
  },
  {
    title: "Quick Booking",
    desc: "Book a professional in less than 2 minutes with our instant matching system.",
    icon: <Zap size={32} className="text-amber-500" />,
  },
  {
    title: "Community Driven",
    desc: "Over 5,000 families trust us for their most sensitive caregiving needs.",
    icon: <Users size={32} className="text-purple-600" />,
  },
  {
    title: "Compassionate Care",
    desc: "We don't just provide service; we provide a hand to hold and a heart to care.",
    icon: <HeartHandshake size={32} className="text-rose-500" />,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-32 bg-slate-900 text-white overflow-hidden">
      <div className="w-11/12 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div data-aos="fade-right">
            <span className="text-blue-400 font-bold uppercase text-xs tracking-[0.3em]">
              Why Choose Us
            </span>
            <h2 className="text-5xl font-black mt-6 mb-8 leading-tight">
              We provide the best <br /> care for your loved ones
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-md font-medium">
              Care.IO is built on the foundation of trust, safety, and
              professional excellence.
            </p>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">
              Learn More About Us
            </button>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            data-aos="fade-left"
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-lg p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="mb-6">{f.icon}</div>
                <h4 className="text-xl font-bold mb-3">{f.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

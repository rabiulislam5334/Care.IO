"use client";
import { Search, CalendarCheck, Heart } from "lucide-react";

const steps = [
  {
    title: "Search Expert",
    desc: "Find the perfect caretaker based on your location and needs.",
    icon: <Search className="text-blue-600" size={32} />,
  },
  {
    title: "Book & Pay",
    desc: "Select dates and confirm your booking with secure payment.",
    icon: <CalendarCheck className="text-green-600" size={32} />,
  },
  {
    title: "Get Care",
    desc: "Our verified professional arrives at your door to provide care.",
    icon: <Heart className="text-rose-600" size={32} />,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-32 bg-white">
      <div className="w-11/12 mx-auto text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-16">
          3 Simple Steps to Get Care
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="relative p-8">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

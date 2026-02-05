"use client";
import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import Link from "next/link";
import { ArrowRight, Loader2, LayoutGrid } from "lucide-react";

export default function FeaturedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/caretaker/all-services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data.slice(0, 4)); // প্রথম ৪টি কার্ড দেখাবে
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-20 flex justify-center items-center">
      <Loader2 className="animate-spin text-blue-600" size={30} />
    </div>
  );

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="w-11/12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LayoutGrid size={16} className="text-blue-600" />
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">Marketplace</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">
              Our Top Rated <br /> <span className="text-blue-600 italic">Caretakers</span>
            </h2>
          </div>
          <Link 
            href="/services" 
            className="group flex items-center gap-3 font-black text-slate-900 uppercase text-xs tracking-widest hover:text-blue-600 transition-all border-b-2 border-slate-200 pb-1"
          >
            See All Services <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, index) => (
            <ServiceCard key={s._id} service={s} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
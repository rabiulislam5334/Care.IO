"use client";
import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import Link from "next/link";
import { ArrowRight, Loader2, LayoutGrid, AlertCircle } from "lucide-react";

export default function FeaturedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // এরর স্টেট যোগ করা হয়েছে

  useEffect(() => {
    fetch("/api/caretaker/all-services")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // শুধু যারা Active বা যাদের সব ডাটা আছে তাদের ফিল্টার করতে পারেন চাইলে
          setServices(data.slice(0, 4)); 
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="py-32 flex flex-col justify-center items-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Market...</p>
    </div>
  );

  if (error) return (
    <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
      <AlertCircle size={40} className="text-rose-400" />
      <p>Unable to load caretakers at the moment.</p>
    </div>
  );

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="w-11/12 max-w-7xl mx-auto">
        {/* Header - No changes needed here, it's perfect */}
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
            className="group flex items-center gap-3 font-black text-slate-900 uppercase text-[10px] tracking-widest hover:text-blue-600 transition-all border-b-2 border-slate-200 pb-1"
          >
            See All Services <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* Grid - Empty state handling */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, index) => (
              <ServiceCard key={s._id || index} service={s} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold">No active services found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
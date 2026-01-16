"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

// আপনার দেওয়া location.json ইমপোর্ট করুন
import locationData from "../../../public/location.json";

export default function AdvancedServicesPage() {
  // ডাটাবেস থেকে আসা সার্ভিসগুলোর জন্য স্টেট
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফিল্টার এবং পেজিনেশন স্টেট
  const [selectedDivision, setSelectedDivision] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ১. ডাটাবেস থেকে সব সার্ভিস ফেচ করা (API Call)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // আপনার সার্ভিস লিস্ট পাওয়ার এপিআই এন্ডপয়েন্ট এখানে দিন
        const res = await fetch("/api/caretaker/all-services");
        const data = await res.json();
        if (Array.isArray(data)) {
          setServices(data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // ২. location.json থেকে ডায়নামিক বিভাগ ও জেলা লিস্ট তৈরি
  const divisions = useMemo(
    () => ["All", ...new Set(locationData.map((loc) => loc.region))],
    []
  );

  const districts = useMemo(() => {
    if (selectedDivision === "All") return ["All"];
    const filtered = locationData.filter(
      (loc) => loc.region === selectedDivision
    );
    return ["All", ...new Set(filtered.map((loc) => loc.district))];
  }, [selectedDivision]);

  // ৩. ফিল্টারিং লজিক (ডাটাবেস থেকে আসা ডাটার ওপর)
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchDivision =
        selectedDivision === "All" || s.region === selectedDivision;
      const matchDistrict =
        selectedDistrict === "All" || s.district === selectedDistrict;
      const matchName =
        s.category?.toLowerCase().includes(searchName.toLowerCase()) ||
        s.name?.toLowerCase().includes(searchName.toLowerCase());
      return matchDivision && matchDistrict && matchName;
    });
  }, [services, selectedDivision, selectedDistrict, searchName]);

  // ৪. পেজিনেশন লজিক
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const currentItems = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16">
      <div className="w-11/12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 uppercase italic flex items-center gap-3">
            Service Market <Sparkles className="text-blue-600" />
          </h1>
          <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-[0.3em]">
            Real-time expert directory
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 mb-10 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Navigation size={12} className="text-blue-600" /> Division
              </label>
              <select
                value={selectedDivision}
                onChange={(e) => {
                  setSelectedDivision(e.target.value);
                  setSelectedDistrict("All");
                  setCurrentPage(1);
                }}
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 font-bold outline-none cursor-pointer"
              >
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} className="text-blue-600" /> District
              </label>
              <select
                value={selectedDistrict}
                disabled={selectedDivision === "All"}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 font-bold outline-none disabled:opacity-50"
              >
                {districts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Search size={12} className="text-blue-600" /> Search Care
              </label>
              <input
                type="text"
                placeholder="Ex: Child Care, Nurse..."
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 font-bold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {currentItems.map((service) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={service._id}
                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500"
              >
                <div className="h-52 overflow-hidden relative bg-slate-100">
                  <img
                    src={
                      service.image ||
                      "https://placehold.co/400x300?text=No+Image"
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt=""
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase">
                    {service.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight">
                    {service.name || service.category}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 flex items-center gap-1">
                    <MapPin size={10} /> {service.district}, {service.region}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        Starting From
                      </p>
                      <p className="text-lg font-black text-slate-900">
                        ৳{service.monthlyRate || service.price}
                      </p>
                    </div>
                    <Link
                      href={`/services/${service._id}`}
                      className="bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
              No matching caretakers found
            </p>
          </div>
        )}

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-4 bg-white rounded-2xl border border-slate-100 disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-black text-slate-400 text-sm mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-4 bg-white rounded-2xl border border-slate-100 disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

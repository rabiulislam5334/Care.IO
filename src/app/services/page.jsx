"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Search,
  ArrowRight,
  Sparkles,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  CircleCheckBig,
} from "lucide-react";

// location.json ইমপোর্ট
import locationData from "../../../public/location.json";

export default function AdvancedServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফিল্টার এবং পেজিনেশন স্টেট
  const [selectedDivision, setSelectedDivision] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ১. ডাটাবেস থেকে ডাটা ফেচ করা
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
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

  // ২. ডায়নামিক লোকেশন ড্রপডাউন তৈরি
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

  // ৩. ফিল্টারিং লজিক (Name, Category, Region, District এর ভিত্তিতে)
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchDivision =
        selectedDivision === "All" || s.region === selectedDivision;
      const matchDistrict =
        selectedDistrict === "All" || s.district === selectedDistrict;
      const searchTerm = searchName.toLowerCase();
      const matchSearch =
        s.category?.toLowerCase().includes(searchTerm) ||
        s.userName?.toLowerCase().includes(searchTerm) ||
        s.district?.toLowerCase().includes(searchTerm);

      return matchDivision && matchDistrict && matchSearch;
    });
  }, [services, selectedDivision, selectedDistrict, searchName]);

  // ৪. পেজিনেশন
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const currentItems = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={50} />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Loading Market...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16">
      <div className="w-11/12 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-12 bg-blue-600 rounded-full" />
              <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">
                Available Caretakers
              </p>
            </div>
            <h1 className="text-5xl font-black text-slate-900 uppercase italic leading-none">
              Service <span className="text-blue-600">Market</span>
            </h1>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Total Found:{" "}
              <span className="text-slate-900">
                {filteredServices.length} Experts
              </span>
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 mb-10 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Navigation
                className="absolute left-5 top-7 text-blue-600"
                size={18}
              />
              <select
                value={selectedDivision}
                onChange={(e) => {
                  setSelectedDivision(e.target.value);
                  setSelectedDistrict("All");
                  setCurrentPage(1);
                }}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 font-bold outline-none appearance-none cursor-pointer"
              >
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Divisions" : d}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <MapPin
                className="absolute left-5 top-6 text-blue-600"
                size={18}
              />
              <select
                value={selectedDistrict}
                disabled={selectedDivision === "All"}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 font-bold outline-none disabled:opacity-50 appearance-none cursor-pointer"
              >
                {districts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist === "All" ? "All Districts" : dist}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search
                className="absolute left-5 top-7 text-blue-600"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name or category..."
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 font-bold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {currentItems.map((service) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={service._id}
                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500 flex flex-col"
              >
                {/* Image Section */}
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={
                      service.image ||
                      "https://placehold.co/600x400?text=No+Photo"
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={service.userName}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm flex items-center gap-2">
                    <MapPin size={12} className="text-red-400" />
                    {service.district}, {service.region}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-7 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight capitalize flex items-center gap-2">
                      <CircleCheckBig size={16} className="text-blue-600" />
                      {service.category}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 tracking-widest">
                      <User size={12} className="text-red-400" />{" "}
                      {service.userName || "Care Expert"}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase">
                        Monthly Rate
                      </p>
                      <p className="text-2xl font-black text-blue-600">
                        ৳{service.monthlyRate || "N/A"}
                      </p>
                    </div>
                    <Link
                      href={`/services/${service._id}`}
                      className="bg-slate-900 text-white h-12 w-12 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all hover:rotate-[-10deg] shadow-lg shadow-slate-200"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50"
          >
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-black uppercase text-sm tracking-widest">
              No matching caretakers found in this area
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-6">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo(0, 0);
              }}
              disabled={currentPage === 1}
              className="h-14 w-14 flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm disabled:opacity-20 hover:text-blue-600 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <span className="h-10 w-10 flex items-center justify-center bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-200">
                {currentPage}
              </span>
              <span className="text-slate-300 font-bold">/</span>
              <span className="text-slate-400 font-bold">{totalPages}</span>
            </div>
            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo(0, 0);
              }}
              disabled={currentPage === totalPages}
              className="h-14 w-14 flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm disabled:opacity-20 hover:text-blue-600 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

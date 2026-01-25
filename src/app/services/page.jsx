"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Search,
  ArrowRight,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  CircleCheckBig,
  RefreshCw,
} from "lucide-react";
import debounce from "lodash/debounce"; // ← debounce এর জন্য

import locationData from "../../../public/location.json";

export default function AdvancedServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [selectedDivision, setSelectedDivision] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [searchInput, setSearchInput] = useState(""); // raw input
  const [searchTerm, setSearchTerm] = useState(""); // debounced term
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/caretaker/all-services");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          });
          setServices(sorted);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    const interval = setInterval(fetchServices, 30000);
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  // Debounce search input (অপটিমাইজেশনের জন্য সবচেয়ে গুরুত্বপূর্ণ)
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value.toLowerCase().trim());
      setCurrentPage(1);
    }, 400), // 400ms পর সার্চ আপডেট হবে
    [],
  );

  // Search input handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value); // UI-তে তাৎক্ষণিক দেখাবে
    debouncedSearch(value); // debounce করে সার্চ করবে
  };

  // Divisions & Districts
  const divisions = useMemo(
    () => ["All", ...new Set(locationData.map((loc) => loc.region || ""))],
    [],
  );

  const districts = useMemo(() => {
    if (selectedDivision === "All") return ["All"];
    return [
      "All",
      ...new Set(
        locationData
          .filter((loc) => loc.region === selectedDivision)
          .map((loc) => loc.district || ""),
      ),
    ];
  }, [selectedDivision]);

  // Division change → reset district
  useEffect(() => {
    setSelectedDistrict("All");
    setCurrentPage(1);
  }, [selectedDivision]);

  // Optimized filtered services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      // Division
      const matchDivision =
        selectedDivision === "All" ||
        !s.region ||
        s.region === selectedDivision;

      // District
      const matchDistrict =
        selectedDistrict === "All" ||
        !s.district ||
        s.district === selectedDistrict;

      // Search - multiple fields, case-insensitive
      const matchSearch =
        !searchTerm ||
        (s.category || "").toLowerCase().includes(searchTerm) ||
        (s.userName || "").toLowerCase().includes(searchTerm) ||
        (s.district || "").toLowerCase().includes(searchTerm) ||
        (s.region || "").toLowerCase().includes(searchTerm) ||
        (s.userEmail || "").toLowerCase().includes(searchTerm);

      return matchDivision && matchDistrict && matchSearch;
    });
  }, [services, selectedDivision, selectedDistrict, searchTerm]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const currentItems = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDivision, selectedDistrict, searchTerm]);

  if (loading && services.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={50} />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Loading Caretakers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16">
      <div className="w-11/12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
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

          <div className="flex items-center gap-4">
            <button
              onClick={() => setRefreshTrigger((prev) => prev + 1)}
              className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors font-medium text-slate-700"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                Found:{" "}
                <span className="text-slate-900">
                  {filteredServices.length}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 md:p-6 rounded-[2.5rem] shadow-xl shadow-blue-900/5 mb-10 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Navigation
                className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600"
                size={18}
              />
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
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
                className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600"
                size={18}
              />
              <select
                value={selectedDistrict}
                disabled={selectedDivision === "All"}
                onChange={(e) => setSelectedDistrict(e.target.value)}
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
                className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600"
                size={18}
              />
              <input
                type="text"
                placeholder="Search name, category, location..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 font-bold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 text-center">
            {error}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[50vh]">
          <AnimatePresence mode="popLayout">
            {currentItems.length > 0 ? (
              currentItems.map((service) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  key={service._id}
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500 flex flex-col"
                >
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={
                        service.image ||
                        "https://placehold.co/600x400?text=No+Photo"
                      }
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={service.category || "Service"}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm flex items-center gap-2">
                      <MapPin size={12} className="text-red-400" />
                      {service.district || "N/A"}, {service.region || "N/A"}
                    </div>
                  </div>

                  <div className="p-7 flex flex-col flex-1">
                    <div className="mb-4">
                      <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight capitalize flex items-center gap-2">
                        <CircleCheckBig size={16} className="text-blue-600" />
                        {service.category || "Care Service"}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 tracking-widest">
                        <User size={12} className="text-red-400" />
                        {service.userName ||
                          service.serviceEmail?.split("@")[0] ||
                          "Care Expert"}
                      </p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">
                          Monthly
                        </p>
                        <p className="text-2xl font-black text-blue-600">
                          ৳{service.monthlyRate || service.hourlyRate || "—"}
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
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100"
              >
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-slate-300" />
                </div>
                <p className="text-slate-500 font-bold text-lg">
                  No matching caretakers found
                </p>
                <p className="text-slate-400 mt-2">
                  Try changing filters or refresh the list
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-6">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === 1}
              className="h-14 w-14 flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm disabled:opacity-40 hover:text-blue-600 transition-all"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="h-10 w-10 flex items-center justify-center bg-blue-600 text-white rounded-xl font-black shadow-md">
                {currentPage}
              </span>
              <span className="text-slate-500 font-bold">of {totalPages}</span>
            </div>

            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === totalPages}
              className="h-14 w-14 flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm disabled:opacity-40 hover:text-blue-600 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

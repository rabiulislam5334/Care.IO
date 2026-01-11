"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";

const allServices = [
  {
    id: 1,
    name: "Child Care",
    division: "Dhaka",
    district: "Mirpur",
    category: "Child",
    price: 500,
    image: "https://images.unsplash.com/photo-1581578731522-745505146317?w=600",
  },
  {
    id: 2,
    name: "Elderly Care",
    division: "Chittagong",
    district: "Pahartali",
    category: "Senior",
    price: 700,
    image: "https://images.unsplash.com/photo-1516703095085-356c9273646d?w=600",
  },
  {
    id: 3,
    name: "Sick Care",
    division: "Dhaka",
    district: "Gulshan",
    category: "Medical",
    price: 1000,
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600",
  },
  {
    id: 4,
    name: "Post-Surgery Care",
    division: "Sylhet",
    district: "Zindabazar",
    category: "Medical",
    price: 1200,
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600",
  },
];

const divisions = [
  "All",
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
];

export default function AdvancedServicesPage() {
  const [selectedDivision, setSelectedDivision] = useState("All");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchName, setSearchName] = useState("");

  // মাল্টি-লেভেল ফিল্টারিং লজিক
  const filteredServices = allServices.filter((s) => {
    const matchDivision =
      selectedDivision === "All" || s.division === selectedDivision;
    const matchDistrict = s.district
      .toLowerCase()
      .includes(searchDistrict.toLowerCase());
    const matchName = s.name.toLowerCase().includes(searchName.toLowerCase());
    return matchDivision && matchDistrict && matchName;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="w-11/12 mx-auto">
        {/* Advanced Filter Bar */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 mb-12 border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <SlidersHorizontal className="text-blue-600" size={24} />
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Search & Filter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Division Select */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-2">
                Division
              </label>
              <select
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 outline-none appearance-none"
              >
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* District Search */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-2">
                Area / District
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="e.g. Mirpur or Gulshan"
                  onChange={(e) => setSearchDistrict(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold outline-none"
                />
              </div>
            </div>

            {/* Service Name Search */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-2">
                Service Name
              </label>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search service..."
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <p className="mb-8 font-bold text-slate-500">
          Found <span className="text-blue-600">{filteredServices.length}</span>{" "}
          services in your criteria
        </p>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <AnimatePresence>
            {filteredServices.map((service) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={service.id}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={service.image}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                    <MapPin size={12} className="text-blue-600" />
                    <span className="text-[10px] font-black text-slate-800 uppercase">
                      {service.district}, {service.division}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-slate-900 mb-6">
                    {service.name}
                  </h3>
                  <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                    <p className="text-xl font-black text-blue-600">
                      {service.price} BDT
                    </p>
                    <Link
                      href={`/services/${service.id}`}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

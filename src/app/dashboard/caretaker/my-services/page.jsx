"use client";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, X, Save, Loader2, Clock, MapPin, Sparkles,
  UploadCloud, ShieldCheck, User, Search, Filter, Briefcase, Activity
} from "lucide-react";
import Swal from "sweetalert2";

export default function MyServices() {
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState(null);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm();

  const watchRegion = watch("region");
  const watchDistrict = watch("district");
  const watchCity = watch("city");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resServices, resLocations] = await Promise.all([
        fetch("/api/caretaker/service-details"),
        fetch("/location.json"),
      ]);
      const servicesData = await resServices.json();
      const locationsData = await resLocations.json();
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setLocations(Array.isArray(locationsData) ? locationsData : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ১. Stats Calculation
  const stats = useMemo(() => ({
    total: services.length,
    active: services.filter(s => s.status === "active").length,
    avgRate: services.length > 0 
      ? (services.reduce((acc, curr) => acc + (Number(curr.hourlyRate) || 0), 0) / services.length).toFixed(0) 
      : 0
  }), [services]);

  // ২. Search & Filter Logic
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = s.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterCategory === "All" || s.category === filterCategory;
      return matchesSearch && matchesFilter;
    });
  }, [services, searchTerm, filterCategory]);

  // ৩. Status Toggle Logic
  const toggleStatus = async (service) => {
    const newStatus = service.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/caretaker/service-details/${service._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setServices(services.map(s => s._id === service._id ? { ...s, status: newStatus } : s));
      }
    } catch (err) {
      Swal.fire("Error", "Status update failed", "error");
    }
  };

  // Location logic
  const uniqueRegions = useMemo(() => [...new Set(locations.map((l) => l.region))], [locations]);
  const filteredDistricts = useMemo(() => watchRegion ? [...new Set(locations.filter((l) => l.region === watchRegion).map((l) => l.district))] : [], [watchRegion, locations]);
  const filteredCities = useMemo(() => watchDistrict ? [...new Set(locations.filter((l) => l.district === watchDistrict).map((l) => l.city))] : [], [watchDistrict, locations]);
  const availableAreas = useMemo(() => locations.find((l) => l.city === watchCity && l.district === watchDistrict)?.covered_area || [], [watchCity, watchDistrict, locations]);

  const openModal = (service = null) => {
    setEditId(service?._id || null);
    setImageUrl(service?.image || "");
    if (service) {
      reset({ ...service, coveredAreas: service.coveredAreas || [] });
    } else {
      reset({ category: "Child Care", gender: "Male", availability: "Full Time", shift: "Day", status: "active", experience: "" });
      setImageUrl("");
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    if (!imageUrl) return Swal.fire("Required", "Upload a photo", "warning");
    try {
      const url = editId ? `/api/caretaker/service-details/${editId}` : "/api/caretaker/service-details";
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, image: imageUrl, status: data.status || "active" }),
      });
      if (!res.ok) throw new Error("Action failed");
      Swal.fire("Success", editId ? "Updated!" : "Added!", "success");
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Delete?", text: "Are you sure?", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`/api/caretaker/service-details/${id}`, { method: "DELETE" });
      if (res.ok) { fetchData(); Swal.fire("Deleted!", "", "success"); }
    } catch (err) { Swal.fire("Error", "Delete failed", "error"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={60} /></div>;

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pb-20 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-lg"><Sparkles size={32} /></div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic">Caretaker Dashboard</h1>
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Professional Care Portfolio</p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => openModal()} className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black uppercase flex items-center gap-2 shadow-xl hover:bg-blue-600 transition-all">
          <Plus size={20} /> Add New Service
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-slate-100 p-3 rounded-2xl text-slate-600"><Briefcase size={24}/></div>
          <div><p className="text-xs font-bold text-slate-400 uppercase">Total Services</p><h2 className="text-2xl font-black">{stats.total}</h2></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-2xl text-green-600"><Activity size={24}/></div>
          <div><p className="text-xs font-bold text-slate-400 uppercase">Active Now</p><h2 className="text-2xl font-black text-green-600">{stats.active}</h2></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 font-bold">৳</div>
          <div><p className="text-xs font-bold text-slate-400 uppercase">Avg Rate</p><h2 className="text-2xl font-black text-blue-600">৳{stats.avgRate}/hr</h2></div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search category..." 
            className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-600 font-bold"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center bg-white rounded-2xl border border-slate-100 px-4">
          <Filter className="text-slate-400 mr-2" size={18} />
          <select className="py-4 bg-transparent outline-none font-bold text-slate-600" onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Child Care">Child Care</option>
            <option value="Elderly Care">Elderly Care</option>
            <option value="Sick Care">Sick Care</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredServices.map((service) => (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={service._id} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-lg group">
              <div className="relative h-48 w-full rounded-[2rem] overflow-hidden mb-6">
                <img src={service.image} alt={service.category} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl font-black text-sm text-blue-600 shadow-sm">
                  ৳{service.hourlyRate}/hr
                </div>
                <button 
                  onClick={() => toggleStatus(service)}
                  className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-md ${
                    service.status === "active" ? "bg-green-500 text-white" : "bg-white text-slate-400"
                  }`}
                >
                  {service.status === "active" ? "● Active" : "○ Inactive"}
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-black text-slate-800 uppercase italic">{service.category}</h3>
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black">{service.experience || 0} YRS EXP</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Clock size={12} /> {service.availability}</span>
                  <span className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin size={12} /> {service.city}</span>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => openModal(service)} className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black uppercase text-xs hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"><Edit2 size={16} /> Edit</button>
                  <button onClick={() => handleDelete(service._id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal - Integrated New Fields */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                <h2 className="text-2xl font-black uppercase italic">{editId ? "Update" : "Setup"} Service</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white rounded-2xl"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <form id="service-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Image Upload Area */}
                  <div className="h-40 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 overflow-hidden relative group">
                    {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-slate-400 font-bold text-xs"><UploadCloud size={30}/><p>Upload Service Image</p></div>}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                      const file = e.target.files[0]; if (!file) return; setUploading(true);
                      const fd = new FormData(); fd.append("image", file);
                      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, { method: "POST", body: fd });
                      const d = await res.json(); if (d.success) setImageUrl(d.data.url); setUploading(false);
                    }} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Category</label>
                      <select {...register("category")} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none">
                        <option value="Child Care">Child Care</option><option value="Elderly Care">Elderly Care</option><option value="Sick Care">Sick Care</option>
                      </select>
                    </div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Experience (Years)</label>
                      <input type="number" {...register("experience")} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none" placeholder="e.g. 5" />
                    </div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Hourly Rate (৳)</label>
                      <input type="number" {...register("hourlyRate")} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none" />
                    </div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Initial Status</label>
                      <select {...register("status")} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none">
                        <option value="active">Active</option><option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  {/* Location Inputs (Keep your existing location logic here) */}
                </form>
              </div>
              <div className="p-8 bg-slate-50/50 border-t flex gap-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 font-black uppercase tracking-widest text-slate-400">Cancel</button>
                <button form="service-form" type="submit" disabled={isSubmitting || uploading} className="flex-[2] py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase flex items-center justify-center gap-3 shadow-xl">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />} {editId ? "Update Profile" : "Save Profile"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
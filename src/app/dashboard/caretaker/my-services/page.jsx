"use client";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Loader2,
  Clock,
  MapPin,
  Sparkles,
  UploadCloud,
  ShieldCheck,
  User,
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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const watchRegion = watch("region");
  const watchDistrict = watch("district");
  const watchCity = watch("city");

  // ডাটা লোড করা
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resSrv, resLoc] = await Promise.all([
        fetch("/api/caretaker/service-details"),
        fetch("/location.json"),
      ]);
      const srvData = await resSrv.json();
      const locData = await resLoc.json();

      setServices(Array.isArray(srvData) ? srvData : []);
      setLocations(locData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // লোকেশন ফিল্টারিং লজিক
  const uniqueRegions = useMemo(
    () => [...new Set(locations.map((l) => l.region))],
    [locations],
  );
  const filteredDistricts = useMemo(
    () => [
      ...new Set(
        locations
          .filter((l) => l.region === watchRegion)
          .map((l) => l.district),
      ),
    ],
    [watchRegion, locations],
  );
  const filteredCities = useMemo(
    () => [
      ...new Set(
        locations
          .filter((l) => l.district === watchDistrict)
          .map((l) => l.city),
      ),
    ],
    [watchDistrict, locations],
  );
  const availableAreas = useMemo(
    () =>
      locations.find(
        (l) => l.city === watchCity && l.district === watchDistrict,
      )?.covered_area || [],
    [watchCity, watchDistrict, locations],
  );

  // মডাল কন্ট্রোল
  const openModal = (service = null) => {
    if (service) {
      setEditId(service._id);
      setImageUrl(service.image || "");
      reset(service); // Edit মোডে সব ডাটা ফিল্ডে বসে যাবে
    } else {
      setEditId(null);
      setImageUrl("");
      reset({
        category: "Child Care",
        gender: "Male",
        availability: "Full Time",
        shift: "Day",
        nidNumber: "",
        emergencyContact: "",
        hourlyRate: "",
        monthlyRate: "",
      });
    }
    setIsModalOpen(true);
  };

  // সাবমিট লজিক
  const onSubmit = async (data) => {
    if (!imageUrl) return Swal.fire("Error", "Please upload a photo!", "error");
    try {
      const res = await fetch("/api/caretaker/service-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, image: imageUrl }),
      });
      if (res.ok) {
        Swal.fire(
          "Success",
          editId ? "Service Updated!" : "New Service Added!",
          "success",
        );
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      Swal.fire("Error", "Action failed", "error");
    }
  };

  const handleDelete = async (category) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this service profile?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(
          `/api/caretaker/service-details?category=${category}`,
          { method: "DELETE" },
        );
        if (res.ok) {
          Swal.fire("Deleted!", "Service removed.", "success");
          fetchData();
        }
      } catch (err) {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={50} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-lg shadow-blue-200">
            <Sparkles size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic">
              My Services
            </h1>
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
              Manage your professional care portfolio
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-wider flex items-center gap-2 shadow-xl hover:bg-blue-600 transition-all"
        >
          <Plus size={20} /> Add New Service
        </motion.button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {services.map((service) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={service._id}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-xl hover:shadow-2xl transition-all group"
            >
              <div className="relative h-48 w-full rounded-[2rem] overflow-hidden mb-6">
                <img
                  src={service.image}
                  alt={service.category}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl font-black text-sm text-blue-600">
                  ৳{service.hourlyRate}/hr
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-800 uppercase italic">
                  {service.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Clock size={12} /> {service.availability}
                  </span>
                  <span className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <MapPin size={12} /> {service.city}
                  </span>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => openModal(service)}
                    className="flex-1 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black uppercase text-xs hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.category)}
                    className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* MODERN MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black uppercase italic text-slate-800">
                    {editId ? "Update" : "Setup New"} Service
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                    Fill in the professional details below
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 hover:bg-white rounded-2xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8">
                <form
                  id="service-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Photo Upload Area */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Service Identity Photo
                    </label>
                    <div className="h-48 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 overflow-hidden relative group">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300">
                          <UploadCloud size={40} />
                          <span className="text-xs font-bold mt-2">
                            Upload Image
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setUploading(true);
                          const formData = new FormData();
                          formData.append("image", file);
                          const res = await fetch(
                            `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                            { method: "POST", body: formData },
                          );
                          const data = await res.json();
                          if (data.success) setImageUrl(data.data.url);
                          setUploading(false);
                        }}
                      />
                      {uploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <Loader2 className="animate-spin text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Essential Info Section */}
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <User size={14} /> Essential Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                          Service Type
                        </label>
                        <select
                          {...register("category")}
                          className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
                        >
                          <option value="Child Care">Child Care</option>
                          <option value="Elderly Care">Elderly Care</option>
                          <option value="Sick Care">Sick Care</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                          Gender
                        </label>
                        <select
                          {...register("gender")}
                          className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                          Work Availability
                        </label>
                        <select
                          {...register("availability")}
                          className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
                        >
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                          Work Shift
                        </label>
                        <select
                          {...register("shift")}
                          className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
                        >
                          <option value="Day">Day Shift</option>
                          <option value="Night">Night Shift</option>
                          <option value="24 Hours">Live-in</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Security & Pricing Section */}
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <ShieldCheck size={14} /> Security & Pricing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                          NID Number
                        </label>
                        <input
                          type="text"
                          {...register("nidNumber")}
                          className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                          Emergency Contact
                        </label>
                        <input
                          type="tel"
                          {...register("emergencyContact")}
                          className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                          Hourly Rate (৳)
                        </label>
                        <input
                          type="number"
                          {...register("hourlyRate")}
                          className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                          Monthly Rate (৳)
                        </label>
                        <input
                          type="number"
                          {...register("monthlyRate")}
                          className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location Selection */}
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] space-y-6">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <MapPin size={14} /> Service Coverage
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select
                        {...register("region")}
                        className="p-4 bg-white rounded-2xl font-bold border-none outline-none"
                      >
                        <option value="">Region</option>
                        {uniqueRegions.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <select
                        {...register("district")}
                        className="p-4 bg-white rounded-2xl font-bold border-none outline-none"
                      >
                        <option value="">District</option>
                        {filteredDistricts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <select
                        {...register("city")}
                        className="p-4 bg-white rounded-2xl font-bold border-none outline-none"
                      >
                        <option value="">City</option>
                        {filteredCities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    {availableAreas.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                        {availableAreas.map((area) => (
                          <label
                            key={area}
                            className="flex items-center gap-2 p-3 bg-white rounded-xl cursor-pointer has-[:checked]:bg-blue-600 has-[:checked]:text-white transition-all shadow-sm"
                          >
                            <input
                              type="checkbox"
                              value={area}
                              {...register("coveredAreas")}
                              className="hidden"
                            />
                            <span className="text-[10px] font-black uppercase mx-auto">
                              {area}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-slate-50/50 border-t flex gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 bg-white text-slate-500 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  form="service-form"
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="flex-[2] py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  {editId
                    ? "Update Professional Profile"
                    : "Save Service Profile"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

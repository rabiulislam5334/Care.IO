"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Loader2,
  X,
  Save,
  ShieldCheck,
  UploadCloud,
  User,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import Swal from "sweetalert2";

export default function MyServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  const { register, handleSubmit, reset, setValue } = useForm();

  // ১. ডাটা লোড করা
  const fetchServices = async () => {
    setLoading(true);
    const res = await fetch("/api/caretaker/service-details");
    const data = await res.json();
    setServices(Array.isArray(data) ? data : data ? [data] : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ২. মডাল ওপেন লজিক
  const openEditModal = (service) => {
    setEditingService(service);
    setModalImageUrl(service.image); // বর্তমান ইমেজ সেট করা
    reset(service); // সব ফিল্ড প্রফিল করা
    setIsModalOpen(true);
  };

  // ৩. মডালের ভেতর নতুন ফটো আপলোড (ImgBB)
  const handleModalImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      if (data.success) {
        setModalImageUrl(data.data.url);
        Swal.fire({
          icon: "success",
          title: "Photo Updated!",
          timer: 1000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire("Error", "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // ৪. সব ডাটা সাবমিট (PATCH)
  const onUpdateSubmit = async (data) => {
    try {
      const res = await fetch(
        `/api/caretaker/service-details/${editingService._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, image: modalImageUrl }),
        },
      );

      if (res.ok) {
        Swal.fire(
          "Updated!",
          "Service details updated successfully.",
          "success",
        );
        setIsModalOpen(false);
        fetchServices();
      }
    } catch (error) {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-black text-slate-900 mb-10 uppercase italic tracking-tight">
        My Professional <span className="text-blue-600">Services</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6 group"
          >
            <div className="w-full sm:w-32 h-32 rounded-[2rem] overflow-hidden bg-slate-100 flex-shrink-0">
              <img
                src={service.image}
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                alt="service"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">
                  {service.category}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-2">
                {service.availability}
              </h3>
              <div className="grid grid-cols-2 mt-4 gap-2 border-t pt-4 border-slate-50">
                <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <DollarSign size={14} className="text-blue-600" /> ৳
                  {service.hourlyRate}/hr
                </p>
                <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Clock size={14} className="text-blue-600" /> {service.shift}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- ALL-IN-ONE UPDATE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl my-8 overflow-hidden relative">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                  <Edit size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase italic">
                  Update Service Profile
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-white p-2 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-all focus:ring-2 focus:ring-red-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onUpdateSubmit)}
              className="p-8 space-y-6"
            >
              {/* Photo Update Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md relative">
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="animate-spin text-white" size={20} />
                    </div>
                  )}
                  <img
                    src={modalImageUrl}
                    className="w-full h-full object-cover"
                    alt="preview"
                  />
                </div>
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-slate-200 p-4 rounded-2xl flex flex-col items-center hover:bg-white hover:border-blue-400 transition-all group">
                    <UploadCloud
                      className="text-slate-300 group-hover:text-blue-500 mb-1"
                      size={24}
                    />
                    <span className="text-[10px] font-black uppercase text-slate-500">
                      Change Professional Photo
                    </span>
                    <input
                      type="file"
                      onChange={handleModalImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Essential Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Service Category
                    </label>
                    <select
                      {...register("category")}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Child Care">Child Care</option>
                      <option value="Elderly Care">Elderly Care</option>
                      <option value="Sick Care">Sick Care</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Hourly Rate (৳)
                    </label>
                    <input
                      type="number"
                      {...register("hourlyRate")}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Availability
                    </label>
                    <select
                      {...register("availability")}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Shift
                    </label>
                    <select
                      {...register("shift")}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Day">Day Shift</option>
                      <option value="Night">Night Shift</option>
                      <option value="24 Hours">Live-in (24h)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact & Security */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    {...register("emergencyContact")}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    NID Number
                  </label>
                  <input
                    type="text"
                    {...register("nidNumber")}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 font-bold text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all uppercase text-xs tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 shadow-xl shadow-slate-200 flex items-center justify-center gap-2 transition-all uppercase text-xs tracking-[0.2em] disabled:opacity-50"
                >
                  <Save size={18} /> Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

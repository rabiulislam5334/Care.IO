"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Edit,
  Trash2,
  DollarSign,
  Loader2,
  X,
  Save,
  UploadCloud,
  Clock,
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
    try {
      setLoading(true);
      const res = await fetch("/api/caretaker/service-details");
      const data = await res.json();
      // API থেকে সিঙ্গেল অবজেক্ট আসলে তাকে অ্যারেতে রূপান্তর
      setServices(Array.isArray(data) ? data : data && data._id ? [data] : []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ২. এডিট মডাল ওপেন
  const openEditModal = (service) => {
    setEditingService(service);
    setModalImageUrl(service.image || "");
    reset(service); // ফর্মের ফিল্ডগুলো ডাটা দিয়ে পূর্ণ হবে
    setIsModalOpen(true);
  };

  // ৩. ইমেজ আপলোড (ImgBB)
  const handleModalImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body: formData },
      );
      const data = await res.json();
      if (data.success) {
        setModalImageUrl(data.data.url);
        Swal.fire({
          icon: "success",
          title: "Photo Uploaded",
          timer: 1000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire("Error", "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // ৪. ডাটা আপডেট (PATCH)
  const onUpdateSubmit = async (formData) => {
    try {
      // সাবমিট করার সময়ও _id বাদ দেওয়া নিরাপদ
      const { _id, ...cleanData } = formData;

      const res = await fetch(`/api/caretaker/service-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cleanData,
          image: modalImageUrl,
        }),
      });

      if (res.ok) {
        Swal.fire("Success", "Profile updated successfully!", "success");
        setIsModalOpen(false); // মডাল বন্ধ হবে
        reset(); // ফর্ম ক্লিয়ার হবে
        setModalImageUrl(""); // ইমেজ প্রিভিউ ক্লিয়ার হবে
        fetchServices(); // লিস্ট রিফ্রেশ হবে
      } else {
        const err = await res.json();
        throw new Error(err.message || "Failed to update");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // ৫. ডিলিট লজিক (প্রয়োজন হলে)
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      // এখানে আপনার ডিলিট এপিআই কল করবেন
      Swal.fire("Deleted!", "Service has been removed.", "success");
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
      <h1 className="text-3xl font-black text-slate-900 mb-10 uppercase italic">
        My Professional <span className="text-blue-600">Services</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.length > 0 ? (
          services.map((service) => (
            <div
              key={service._id}
              className="bg-white border p-6 rounded-[2.5rem] shadow-sm flex gap-6 items-center"
            >
              <img
                src={service.image}
                className="w-24 h-24 rounded-2xl object-cover"
                alt="service"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold">{service.category}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <DollarSign size={14} /> {service.hourlyRate}/hr
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center p-10 bg-slate-50 rounded-3xl border-2 border-dashed">
            No services found. Please add your service details.
          </div>
        )}
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h2 className="font-bold uppercase">Update Service</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onUpdateSubmit)}
              className="p-8 space-y-6"
            >
              {/* Photo Section */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <img
                  src={modalImageUrl}
                  className="w-20 h-20 rounded-xl object-cover border"
                  alt="preview"
                />
                <label className="flex-1">
                  <div className="border-2 border-dashed p-2 rounded-xl text-center text-xs cursor-pointer hover:bg-white transition">
                    {uploading ? "Uploading..." : "Change Photo"}
                    <input
                      type="file"
                      onChange={handleModalImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </label>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  {...register("hourlyRate")}
                  placeholder="Hourly Rate"
                  className="p-3 bg-slate-50 rounded-xl border"
                  type="number"
                />
                <select
                  {...register("category")}
                  className="p-3 bg-slate-50 rounded-xl border"
                >
                  <option value="Child Care">Child Care</option>
                  <option value="Elderly Care">Elderly Care</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  DollarSign,
  Briefcase,
  FileText,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  UploadCloud,
  Clock,
  User,
  MapPin,
  ShieldCheck,
  Phone,
  PlusCircle,
} from "lucide-react";
import Swal from "sweetalert2";

export default function ServiceSettings() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      category: "Child Care",
      gender: "Male",
      availability: "Full Time",
      shift: "Day",
      hourlyRate: "",
      monthlyRate: "",
      experience: "",
      nidNumber: "",
      emergencyContact: "",
      languages: [],
      region: "",
      district: "",
      city: "",
      coveredAreas: [],
    },
  });

  const watchRegion = watch("region");
  const watchDistrict = watch("district");
  const watchCity = watch("city");

  // ১. লোকেশন ডেটা লোড করা
  useEffect(() => {
    fetch("/location.json")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Location load error:", err));
  }, []);

  // ২. ডায়নামিক ফিল্টারিং লজিক (location.json এর ভিত্তিতে)
  const uniqueRegions = useMemo(
    () => [...new Set(locations.map((loc) => loc.region))],
    [locations]
  );
  const filteredDistricts = useMemo(
    () => [
      ...new Set(
        locations.filter((l) => l.region === watchRegion).map((l) => l.district)
      ),
    ],
    [watchRegion, locations]
  );
  const filteredCities = useMemo(
    () => [
      ...new Set(
        locations.filter((l) => l.district === watchDistrict).map((l) => l.city)
      ),
    ],
    [watchDistrict, locations]
  );
  const availableAreas = useMemo(() => {
    const cityData = locations.find(
      (l) => l.city === watchCity && l.district === watchDistrict
    );
    return cityData ? cityData.covered_area : [];
  }, [watchCity, watchDistrict, locations]);

  // ৩. বিদ্যমান ডাটা ফেচ করা
  useEffect(() => {
    fetch("/api/caretaker/service-details")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          reset(data);
          setImageUrl(data.image);
        }
        setLoading(false);
      });
  }, [reset]);

  // ৪. নতুন ফটো অ্যাড করার ফাংশন
  const handleNewImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setImageUrl(localPreview);

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.url);
        setValue("image", data.data.url);
        Swal.fire({
          icon: "success",
          title: "New Photo Added!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire("Error", "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/caretaker/service-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          image: imageUrl,
          updatedAt: new Date(), // ডাটাবেসে সময় ট্র্যাক করার জন্য
        }),
      });

      if (res.ok) {
        Swal.fire("Success", "আপনার প্রোফাইল ডাটাবেসে সেভ হয়েছে!", "success");
      } else {
        const errorData = await res.json();
        Swal.fire(
          "Error",
          errorData.message || "সেভ হতে সমস্যা হয়েছে",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "সার্ভারের সাথে কানেক্ট করা যাচ্ছে না", "error");
    }
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-4 space-y-8 pb-20"
    >
      {/* Header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
          <Sparkles size={30} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase italic leading-tight">
            Caretaker Setup
          </h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
            Identity • Pricing • Location
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo Section (New Layout) */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 mb-6">
            <ImageIcon size={14} /> Profile Picture
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-44 h-52 bg-slate-50 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl relative flex items-center justify-center">
              {uploading && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-500" />
                </div>
              )}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <div className="text-center p-4">
                  <PlusCircle className="mx-auto text-slate-200" size={40} />
                </div>
              )}
            </div>
            <label className="flex-1 w-full cursor-pointer group">
              <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2rem] group-hover:border-blue-500 group-hover:bg-blue-50/50 transition-all flex flex-col items-center">
                <UploadCloud
                  className="text-slate-300 group-hover:text-blue-500 mb-2"
                  size={32}
                />
                <span className="text-xs font-black uppercase text-slate-600">
                  Add New Professional Photo
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleNewImageUpload}
                  accept="image/*"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Essential Details (Category, Gender, Availability, Shift) */}
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
                <option value="Day">Day Shift (8AM - 8PM)</option>
                <option value="Night">Night Shift (8PM - 8AM)</option>
                <option value="24 Hours">Live-in (24h)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Pricing */}
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
                placeholder="123 456 7890"
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
                placeholder="017..."
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

        {/* Location Section */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <MapPin size={14} /> Service Coverage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <select
              {...register("region")}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Region</option>
              {uniqueRegions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
            <select
              {...register("district")}
              disabled={!watchRegion}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            >
              <option value="">District</option>
              {filteredDistricts.map((dis) => (
                <option key={dis} value={dis}>
                  {dis}
                </option>
              ))}
            </select>
            <select
              {...register("city")}
              disabled={!watchDistrict}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            >
              <option value="">City</option>
              {filteredCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <AnimatePresence>
            {availableAreas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100"
              >
                {availableAreas.map((area) => (
                  <label
                    key={area}
                    className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-blue-50 border border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-all"
                  >
                    <input
                      type="checkbox"
                      value={area}
                      {...register("coveredAreas")}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className="text-[10px] font-bold text-slate-600">
                      {area}
                    </span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={isSubmitting || uploading}
          type="submit"
          className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-colors"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          Save Professional Profile
        </motion.button>
      </form>
    </motion.div>
  );
}

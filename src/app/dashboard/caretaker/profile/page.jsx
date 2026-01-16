"use client";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Loader2,
  Edit3,
  Lock,
  Star,
  Briefcase,
  MapPin,
  CalendarDays,
} from "lucide-react";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ডাটা ফেচ করার ফাংশন
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setUserData(data);
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // API কল করার কমন ফাংশন
  const updateRequest = async (data) => {
    try {
      const res = await fetch("/api/user/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        Swal.fire("Success", "Information Updated!", "success");
        fetchProfile();
      } else {
        Swal.fire("Error", "Update failed", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    }
  };

  // প্রোফাইল এডিট করার ফাংশন
  const handleEditProfile = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Personal Info",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Full Name" value="${userData.name}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Address" value="${
          userData.address || ""
        }">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update Now",
      confirmButtonColor: "#0f172a",
      preConfirm: () => {
        return {
          name: document.getElementById("swal-input1").value,
          address: document.getElementById("swal-input2").value,
        };
      },
    });

    if (formValues) {
      updateRequest(formValues);
    }
  };

  // পাসওয়ার্ড চেঞ্জ করার ফাংশন
  const handleChangePassword = async () => {
    const { value: password } = await Swal.fire({
      title: "Security Update",
      input: "password",
      inputLabel: "New Password",
      inputPlaceholder: "Enter at least 6 characters",
      showCancelButton: true,
      confirmButtonText: "Change Password",
      confirmButtonColor: "#0f172a",
    });

    if (password) {
      if (password.length < 6) {
        return Swal.fire("Error", "Password too short!", "error");
      }
      updateRequest({ password });
    }
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      {/* Header Card */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 relative z-10 border-4 border-white shadow-inner">
          <User size={64} />
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>

        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
              {userData?.name}
            </h1>
            <span className="w-fit mx-auto md:mx-0 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShieldCheck size={12} className="inline mr-1 mb-0.5" /> Verified{" "}
              {userData?.role}
            </span>
          </div>
          <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 mt-2">
            <Mail size={16} /> {userData?.email}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full -mr-32 -mt-32"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 text-lg uppercase tracking-tight">
              Account Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Full Name
                </p>
                <p className="font-bold text-slate-700">{userData?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Address / Location
                </p>
                <p className="font-bold text-slate-700 flex items-center gap-1">
                  <MapPin size={14} className="text-rose-500" />{" "}
                  {userData?.address || "Not Provided"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Member Since
                </p>
                <p className="font-bold text-slate-700 flex items-center gap-1">
                  <CalendarDays size={14} className="text-blue-500" /> Jan 2026
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Current Role
                </p>
                <p className="font-bold text-slate-700 uppercase text-xs">
                  {userData?.role}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleEditProfile}
              className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Edit3 size={18} /> Update Info
            </button>
            <button
              onClick={handleChangePassword}
              className="flex-1 px-8 py-4 border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Lock size={18} /> Security
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-black text-blue-400 mb-6 uppercase tracking-widest text-xs">
                Performance
              </h3>

              {userData?.role === "caretaker" ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <Star
                        className="text-amber-400"
                        size={24}
                        fill="currentColor"
                      />
                      <span className="text-[10px] font-black uppercase opacity-60">
                        Rating
                      </span>
                    </div>
                    <p className="text-2xl font-black">4.9</p>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <Briefcase className="text-blue-400" size={24} />
                      <span className="text-[10px] font-black uppercase opacity-60">
                        Works
                      </span>
                    </div>
                    <p className="text-2xl font-black">12+</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm font-medium opacity-70 italic">
                    "Welcome to our premium caretaking community."
                  </p>
                  <div className="mt-6 bg-blue-500/20 p-4 rounded-2xl border border-blue-500/20">
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Status
                    </p>
                    <p className="text-lg font-black text-blue-400">
                      Active Member
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          </div>

          <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
            <p className="text-[10px] font-black text-blue-600 uppercase mb-2">
              Need Help?
            </p>
            <p className="text-xs text-blue-800 font-medium leading-relaxed">
              If you want to change your email or role, please contact the
              administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

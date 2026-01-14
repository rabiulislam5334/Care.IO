"use client";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Loader2,
  Briefcase,
  Star,
  Edit3,
  Lock,
} from "lucide-react";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = () => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // প্রোফাইল এডিট করার ফাংশন
  const handleEditProfile = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Update Profile",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${userData.name}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Address" value="${
          userData.address || ""
        }">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      confirmButtonColor: "#1e293b",
      preConfirm: () => {
        return {
          name: document.getElementById("swal-input1").value,
          address: document.getElementById("swal-input2").value,
        };
      },
    });

    if (formValues) {
      updateRequest({ name: formValues.name, address: formValues.address });
    }
  };

  // পাসওয়ার্ড চেঞ্জ করার ফাংশন
  const handleChangePassword = async () => {
    const { value: password } = await Swal.fire({
      title: "Change Password",
      input: "password",
      inputLabel: "Enter your new password",
      inputPlaceholder: "New Password",
      showCancelButton: true,
      confirmButtonText: "Update Password",
      confirmButtonColor: "#1e293b",
    });

    if (password) {
      if (password.length < 6) {
        return Swal.fire(
          "Error",
          "Password must be at least 6 characters",
          "error"
        );
      }
      updateRequest({ password: password });
    }
  };

  // API কল করার কমন ফাংশন
  const updateRequest = async (data) => {
    try {
      const res = await fetch("/api/user/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        Swal.fire("Success", "Updated Successfully!", "success");
        fetchProfile(); // ডাটা রিফ্রেশ করা
      } else {
        Swal.fire("Error", "Update failed", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    }
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Profile Header */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 relative z-10">
          <User size={64} />
        </div>
        <div className="flex-1 text-center md:text-left relative z-10">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            {userData?.name}
          </h1>
          <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 mt-1">
            <Mail size={16} /> {userData?.email}
          </p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
            <span
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                userData?.role === "admin"
                  ? "bg-rose-50 text-rose-600 border-rose-100"
                  : userData?.role === "caretaker"
                  ? "bg-purple-50 text-purple-600 border-purple-100"
                  : "bg-blue-50 text-blue-600 border-blue-100"
              }`}
            >
              <ShieldCheck size={12} className="inline mr-1" /> {userData?.role}
            </span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16"></div>
      </div>

      {/* Role Specific Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 text-lg">
            Account Details
          </h3>
          <ul className="space-y-4">
            <li className="flex justify-between text-sm">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Location
              </span>
              <span className="text-slate-700 font-black">
                {userData?.address || "Not Set"}
              </span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Joined
              </span>
              <span className="text-slate-700 font-black">Jan 2024</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
          {userData?.role === "admin" && (
            <>
              <h3 className="font-black text-blue-400 mb-4 uppercase tracking-widest text-xs">
                Admin Access
              </h3>
              <p className="text-2xl font-bold italic">"Full System Control"</p>
              <div className="mt-6 flex gap-4">
                <div className="bg-white/10 p-4 rounded-2xl flex-1 text-center border border-white/5">
                  <p className="text-[10px] opacity-60 uppercase font-black">
                    System Status
                  </p>
                  <p className="text-lg font-black text-emerald-400">Stable</p>
                </div>
              </div>
            </>
          )}
          {userData?.role === "caretaker" && (
            <>
              <h3 className="font-black text-purple-400 mb-4 uppercase tracking-widest text-xs">
                Caretaker Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl">
                  <Star
                    className="text-amber-400"
                    size={20}
                    fill="currentColor"
                  />
                  <p className="text-xl font-black">
                    4.9{" "}
                    <span className="text-[10px] opacity-50 font-normal ml-1 uppercase">
                      Rating
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl">
                  <Briefcase className="text-purple-400" size={20} />
                  <p className="text-xl font-black">
                    12{" "}
                    <span className="text-[10px] opacity-50 font-normal ml-1 uppercase">
                      Jobs Done
                    </span>
                  </p>
                </div>
              </div>
            </>
          )}
          {userData?.role === "user" && (
            <>
              <h3 className="font-black text-blue-400 mb-4 uppercase tracking-widest text-xs">
                Membership
              </h3>
              <p className="text-2xl font-bold italic">"Regular Customer"</p>
              <div className="mt-6 bg-white/10 p-4 rounded-2xl border border-white/5">
                <p className="text-xs opacity-70 leading-relaxed">
                  Need assistance? Our support team is available 24/7 for you.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={handleEditProfile}
          className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-sm hover:bg-slate-700 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <Edit3 size={18} /> Edit Profile
        </button>
        <button
          onClick={handleChangePassword}
          className="px-8 py-4 border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <Lock size={18} /> Change Password
        </button>
      </div>
    </div>
  );
}

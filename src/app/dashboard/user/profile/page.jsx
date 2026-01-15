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
  Sparkles,
} from "lucide-react";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleEditProfile = async () => {
    if (!userData) return;
    const { value: formValues } = await Swal.fire({
      title: "Update Profile",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${
          userData?.name || ""
        }">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Address" value="${
          userData?.address || ""
        }">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      confirmButtonColor: "#1e293b",
      preConfirm: () => ({
        name: document.getElementById("swal-input1").value,
        address: document.getElementById("swal-input2").value,
      }),
    });
    if (formValues) updateRequest(formValues);
  };

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
      if (password.length < 6)
        return Swal.fire(
          "Error",
          "Password must be at least 6 characters",
          "error"
        );
      updateRequest({ password });
    }
  };

  const updateRequest = async (data) => {
    try {
      const res = await fetch("/api/user/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        Swal.fire("Success", "Updated Successfully!", "success");
        fetchProfile();
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    }
  };

  const handleApplyCaretaker = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Apply as a Caretaker",
      html:
        `<select id="cat" class="swal2-input"><option>Child Care</option><option>Elderly Care</option></select>` +
        `<input id="exp" class="swal2-input" placeholder="Years of Experience">` +
        `<textarea id="bio" class="swal2-textarea" placeholder="Tell us about your skills"></textarea>`,
      showCancelButton: true,
      confirmButtonText: "Submit Application",
      confirmButtonColor: "#059669",
      preConfirm: () => ({
        category: document.getElementById("cat").value,
        experience: document.getElementById("exp").value,
        bio: document.getElementById("bio").value,
      }),
    });

    if (formValues) {
      const res = await fetch("/api/user/apply-caretaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      if (res.ok) {
        Swal.fire(
          "Submitted!",
          "Admin will review your request soon.",
          "success"
        );
        fetchProfile();
      }
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
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 relative z-10">
          <User size={64} />
        </div>
        <div className="flex-1 text-center md:text-left relative z-10">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            {userData?.name || "Guest User"}
          </h1>
          <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 mt-1">
            <Mail size={16} /> {userData?.email}
          </p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-blue-50 text-blue-600 border-blue-100">
              <ShieldCheck size={12} className="inline mr-1" /> {userData?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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
          </ul>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
          <h3 className="font-black text-blue-400 mb-4 uppercase tracking-widest text-xs">
            Membership
          </h3>
          <p className="text-2xl font-bold italic">
            "
            {userData?.role === "admin"
              ? "System Administrator"
              : "Regular Customer"}
            "
          </p>
          {userData?.isPendingCaretaker && (
            <div className="mt-4 p-3 bg-orange-500/20 border border-orange-500/30 rounded-xl">
              <p className="text-[10px] text-orange-400 font-black uppercase animate-pulse">
                Application Pending Review
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Profile Actions */}
      <div className="flex flex-col gap-4">
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

        {/* Dynamic Caretaker Apply Button */}
        {userData?.role === "user" && !userData?.isPendingCaretaker && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleApplyCaretaker}
              className="group px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-sm hover:bg-emerald-700 transition-all shadow-xl flex items-center gap-3"
            >
              <Sparkles
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              BECOME A CARETAKER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

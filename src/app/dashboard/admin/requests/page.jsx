"use client";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Info,
  UserCheck,
  UserX,
} from "lucide-react";
import Swal from "sweetalert2";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ডাটা ফেচ করার ফাংশন
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users?pending=true");
      const data = await res.json();
      // যারা কেবল এপ্লাই করেছে তাদের ফিল্টার করা
      setRequests(data.filter((u) => u.isPendingCaretaker));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Approve করার ফাংশন
  const handleApprove = async (userId, name) => {
    const confirm = await Swal.fire({
      title: `Approve ${name}?`,
      text: "This user will be promoted to Caretaker role.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      confirmButtonText: "Yes, Approve",
    });

    if (confirm.isConfirmed) {
      const res = await fetch("/api/admin/approve-caretaker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        Swal.fire("Success!", "User role updated to Caretaker.", "success");
        fetchRequests();
      }
    }
  };

  // Reject করার ফাংশন (নতুন যুক্ত করা হয়েছে)
  const handleReject = async (userId, name) => {
    const confirm = await Swal.fire({
      title: `Reject ${name}?`,
      text: "Their application will be removed, but they can apply again later.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Yes, Reject",
    });

    if (confirm.isConfirmed) {
      const res = await fetch("/api/admin/reject-caretaker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        Swal.fire("Rejected", "The application has been declined.", "info");
        fetchRequests();
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
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          Caretaker Applications{" "}
          <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
            {requests.length}
          </span>
        </h1>
        <p className="text-slate-500 font-medium">
          Manage and review users who want to join as professional caretakers.
        </p>
      </div>

      {requests.length > 0 ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  User Details
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Background
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">
                  Decision
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-6">
                    <p className="font-black text-slate-800 text-lg">
                      {user.name}
                    </p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase">
                        {user.caretakerDetails?.category || "General"}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1">
                      <CheckCircle size={14} className="text-emerald-500" />
                      {user.caretakerDetails?.experience} Years Exp.
                    </p>
                    <p className="text-xs text-slate-400 mt-2 max-w-xs italic line-clamp-2">
                      "{user.caretakerDetails?.bio}"
                    </p>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Approve Button */}
                      <button
                        onClick={() => handleApprove(user._id, user.name)}
                        className="p-2 md:px-4 md:py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
                        title="Approve User"
                      >
                        <UserCheck size={16} />{" "}
                        <span className="hidden md:inline">Approve</span>
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => handleReject(user._id, user.name)}
                        className="p-2 md:px-4 md:py-2 bg-rose-50 text-rose-600 rounded-xl font-black text-xs hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2"
                        title="Reject User"
                      >
                        <UserX size={16} />{" "}
                        <span className="hidden md:inline">Reject</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="text-slate-300" size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800">
            No Pending Requests
          </h3>
          <p className="text-slate-400 font-medium">
            You're all caught up! New applications will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  User,
  Check,
  X,
  Calendar, // ✅ এটি মিসিং ছিল
  Loader2
} from "lucide-react";

export default function CaretakerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. সঠিক API পাথ কল করা (আমরা একীভূত API /api/bookings ব্যবহার করবো)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/bookings"); // ✅ আপনার আগের দেওয়া একীভূত API
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setTasks(tasks.map((t) => (t._id === id ? { ...t, status: newStatus } : t)));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
      <p className="font-bold text-slate-500">Loading your tasks...</p>
    </div>
  );

  return (
    <div className="w-11/12 mx-auto py-10">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800">
          Job <span className="text-blue-600">Requests</span>
        </h2>
        <p className="text-slate-500 font-medium">Manage your service requests and schedule.</p>
      </header>

      {tasks.length === 0 ? (
        <div className="bg-white p-16 rounded-[2rem] text-center border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold italic">No tasks assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={task._id}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all"
            >
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800">{task.userName}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.userEmail}</p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest 
                  ${task.status === "pending" ? "bg-amber-100 text-amber-600" : 
                    task.status === "accepted" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                  {task.status}
                </span>
              </div>

              {/* Task Details */}
              <div className="space-y-3 text-slate-500 font-medium">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-blue-500" /> 
                  <span>Start Date: <b className="text-slate-700">{task.startDate}</b></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-blue-500" /> 
                  <span className="line-clamp-1">{task.address}</span>
                </div>
                {task.note && (
                   <div className="bg-slate-50 p-3 rounded-xl text-xs italic mt-2 border-l-4 border-blue-400">
                      "{task.note}"
                   </div>
                )}
              </div>

              {/* Earnings & Actions */}
              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Earnings (70%)</p>
                  <p className="text-xl font-black text-slate-800">৳{Math.floor((task.price || 0) * 0.7)}</p>
                </div>

                <div className="flex gap-2">
                  {task.status === "pending" ? (
                    <>
                      <button onClick={() => handleStatusUpdate(task._id, "accepted")} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-slate-200">
                        <Check size={20} />
                      </button>
                      <button onClick={() => handleStatusUpdate(task._id, "rejected")} className="bg-slate-100 text-slate-400 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <X size={20} />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-2 rounded-lg">
                       <CheckCircle size={14}/> {task.status === "accepted" ? "Accepted" : "Action Taken"}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
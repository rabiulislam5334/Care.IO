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
} from "lucide-react";

export default function CaretakerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. সঠিক API পাথ ব্যবহার করুন (/api/bookings)
  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  // ২. স্ট্যাটাস আপডেট করার ফাংশন
  const handleStatusUpdate = async (id, newStatus) => {
    const res = await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (res.ok) {
      setTasks(
        tasks.map((t) => (t._id === id ? { ...t, status: newStatus } : t)),
      );
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-bold">Loading your tasks...</div>
    );

  return (
    <div className="w-11/12 mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800">
          Job <span className="text-blue-600">Requests</span>
        </h2>
        <p className="text-slate-500 font-medium">
          Manage your service requests and schedule.
        </p>
      </header>

      {tasks.length === 0 ? (
        <div className="bg-white p-16 rounded-[2rem] text-center border border-slate-100">
          <p className="text-slate-400 font-bold italic">
            No tasks assigned to you yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={task._id}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800">
                      {task.userName}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {task.userEmail}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    task.status === "pending"
                      ? "bg-amber-100 text-amber-600"
                      : task.status === "accepted"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <div className="space-y-3 text-slate-500 font-medium">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-blue-500" />{" "}
                  <span>Start: {task.startDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-blue-500" />{" "}
                  <span>{task.address}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Your Earnings
                  </p>
                  <p className="text-xl font-black text-slate-800">
                    ৳{(task.price || 0) * 0.7}
                  </p>
                </div>

                <div className="flex gap-2">
                  {task.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(task._id, "accepted")}
                        className="bg-slate-900 text-white p-3 rounded-xl hover:bg-green-600 transition-all"
                        title="Accept"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(task._id, "rejected")}
                        className="bg-slate-100 text-slate-400 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        title="Reject"
                      >
                        <X size={20} />
                      </button>
                    </>
                  ) : (
                    <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold">
                      Details
                    </button>
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

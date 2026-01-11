"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, MapPin, Phone } from "lucide-react";

export default function CaretakerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/caretaker/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center font-bold">Loading your tasks...</div>
    );

  return (
    <div className="w-11/12 mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800">
          My Assigned Tasks
        </h2>
        <p className="text-slate-500">
          View and manage your caregiving schedule.
        </p>
      </header>

      {tasks.length === 0 ? (
        <div className="bg-white p-16 rounded-[2rem] text-center border border-slate-100">
          <p className="text-slate-400">No tasks assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              key={task._id}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl">
                  <Clock size={24} />
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                    task.status === "Pending"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-800 mb-2">
                {task.duration} Days Service
              </h3>

              <div className="space-y-3 text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />{" "}
                  <span>
                    {task.address}, {task.district}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} /> <span>{task.contact}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Earnings
                  </p>
                  <p className="text-xl font-black text-slate-800">
                    {task.totalCost * 0.7} BDT
                  </p>
                  {/* ধরি ৭০% কেয়ারটেকার পাবে */}
                </div>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Clock,
  CheckCircle2,
  XCircle,
  User,
} from "lucide-react";
import Swal from "sweetalert2";

export default function CaretakerTasks() {
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

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/caretaker/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      Swal.fire("Updated!", `Task ${status} successfully.`, "success");
      // রিফ্রেশ লিস্ট
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
        Active Tasks
      </h1>

      <div className="grid gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800">{task.userName}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {task.date}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(task._id, "accepted")}
                  className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-600 hover:text-white transition-all"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(task._id, "rejected")}
                  className="px-6 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-600 hover:text-white transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold italic">
              No tasks assigned yet!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

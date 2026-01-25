"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import Swal from "sweetalert2";

export default function CaretakerTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Search + filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Modal
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetch("/api/caretaker/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter + search logic
  const filteredTasks = useMemo(() => {
    let temp = [...tasks];

    if (statusFilter !== "all") {
      temp = temp.filter((t) => t.status === statusFilter);
    }

    if (search.trim() !== "") {
      const s = search.toLowerCase();
      temp = temp.filter(
        (t) =>
          t.userName.toLowerCase().includes(s) ||
          t.userEmail.toLowerCase().includes(s) ||
          t.address.toLowerCase().includes(s)
      );
    }

    return temp;
  }, [tasks, search, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const updateStatus = async (id, status) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to mark this task as ${status}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel",
      customClass: {
        popup: "rounded-2xl",
      },
    });

    if (!confirm.isConfirmed) return;

    try {
      setUpdatingId(id);

      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Failed!", data.error || data.message, "error");
        setUpdatingId(null);
        return;
      }

      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t))
      );

      Swal.fire("Updated!", `Task is now ${status}.`, "success");
      setUpdatingId(null);
    } catch (error) {
      Swal.fire("Error!", "Network error. Please try again.", "error");
      setUpdatingId(null);
    }
  };

  const statusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest";
    if (status === "pending")
      return `${base} bg-amber-100 text-amber-700`;
    if (status === "accepted")
      return `${base} bg-emerald-100 text-emerald-700`;
    if (status === "rejected")
      return `${base} bg-rose-100 text-rose-700`;
    if (status === "completed")
      return `${base} bg-slate-100 text-slate-700`;
    return `${base} bg-slate-100 text-slate-700`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
        Active Tasks
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl p-2">
          <Search size={18} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, address..."
            className="outline-none px-2 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border border-slate-100 rounded-xl px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tasks */}
      <div className="grid gap-4">
        {paginatedTasks.length > 0 ? (
          paginatedTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">
                    {task.userName}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {task.startDate}
                  </p>
                  <p className="mt-1">
                    <span className={statusBadge(task.status)}>
                      {task.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTask(task)}
                  className="px-5 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all"
                >
                  <Info size={14} className="inline mr-1" />
                  Details
                </button>

                <button
                  disabled={
                    task.status === "accepted" ||
                    task.status === "rejected" ||
                    updatingId === task._id
                  }
                  onClick={() => updateStatus(task._id, "accepted")}
                  className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${
                    task.status === "accepted" || task.status === "rejected"
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                  }`}
                >
                  <CheckCircle2 size={14} className="inline mr-1" />
                  {updatingId === task._id ? "Updating..." : "Accept"}
                </button>

                <button
                  disabled={
                    task.status === "accepted" ||
                    task.status === "rejected" ||
                    updatingId === task._id
                  }
                  onClick={() => updateStatus(task._id, "rejected")}
                  className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${
                    task.status === "accepted" || task.status === "rejected"
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white"
                  }`}
                >
                  <XCircle size={14} className="inline mr-1" />
                  {updatingId === task._id ? "Updating..." : "Reject"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold italic">
              No tasks found!
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-2 rounded-xl border border-slate-200"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="px-3 py-2 rounded-xl border border-slate-200">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-2 rounded-xl border border-slate-200"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 text-slate-500 font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-black text-slate-900 mb-3">
              Task Details
            </h2>

            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-bold text-slate-800">Name:</span>{" "}
                {selectedTask.userName}
              </p>
              <p>
                <span className="font-bold text-slate-800">Email:</span>{" "}
                {selectedTask.userEmail}
              </p>
              <p>
                <span className="font-bold text-slate-800">Address:</span>{" "}
                {selectedTask.address}
              </p>
              <p>
                <span className="font-bold text-slate-800">Start Date:</span>{" "}
                {selectedTask.startDate}
              </p>
              <p>
                <span className="font-bold text-slate-800">Note:</span>{" "}
                {selectedTask.note || "No note"}
              </p>
              <p>
                <span className="font-bold text-slate-800">Price:</span>{" "}
                ৳{selectedTask.amount || 0}
              </p>
              <p>
                <span className="font-bold text-slate-800">Status:</span>{" "}
                <span className={statusBadge(selectedTask.status)}>
                  {selectedTask.status}
                </span>
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

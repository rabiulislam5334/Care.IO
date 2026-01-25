"use client";
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Save,
  Loader2,
  Clock,
  Moon,
  Sun,
  Coffee,
  Info,
  CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";

// ডাটাবেস ফাঁকা থাকলে এই ডিফল্ট লিস্টটি দেখাবে
const initialDays = [
  { day: "Monday", active: true, startTime: "09:00", endTime: "18:00" },
  { day: "Tuesday", active: true, startTime: "09:00", endTime: "18:00" },
  { day: "Wednesday", active: true, startTime: "09:00", endTime: "18:00" },
  { day: "Thursday", active: true, startTime: "09:00", endTime: "18:00" },
  { day: "Friday", active: true, startTime: "09:00", endTime: "18:00" },
  { day: "Saturday", active: false, startTime: "00:00", endTime: "00:00" },
  { day: "Sunday", active: false, startTime: "00:00", endTime: "00:00" },
];

export default function SchedulePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState(initialDays); // শুরুতে ডিফল্ট ডাটা

  // ডাটাবেস থেকে সিডিউল লোড করা
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch("/api/caretaker/schedule");
        const data = await res.json();

        // যদি ডাটাবেসে সেভ করা শিডিউল থাকে তবেই সেট করবে
        if (data?.schedule && data.schedule.length > 0) {
          setSchedule(data.schedule);
        }
      } catch (err) {
        console.error("Load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  // স্ট্যাটাস টগল (Available/Off Day)
  const toggleDay = (index) => {
    const updated = [...schedule];
    updated[index].active = !updated[index].active;
    setSchedule(updated);
  };

  // টাইম আপডেট
  const updateTime = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  // ডাটা সেভ করা
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/caretaker/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Schedule Updated",
          text: "Your availability has been updated for clients!",
          timer: 2000,
          showConfirmButton: false,
          background: "#0f172a",
          color: "#fff",
        });
      } else {
        throw new Error(data.message || "Failed to save");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.message,
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">
          Syncing Calendar...
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20 animate-in fade-in duration-700">
      {/* --- HERO HEADER --- */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <CalendarCheck size={28} />
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              Duty Hours
            </h1>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-xs">
            Manage your weekly availability and shift timings for clients
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="relative z-10 w-full md:w-auto px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {saving ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Save
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
          )}
          {saving ? "Saving..." : "Update Schedule"}
        </button>
      </div>

      {/* --- SCHEDULE GRID --- */}
      <div className="grid grid-cols-1 gap-4">
        {schedule.map((item, index) => (
          <div
            key={item.day}
            className={`group p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col lg:flex-row items-center justify-between gap-6 ${
              item.active
                ? "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200"
                : "bg-slate-50 border-transparent opacity-60 grayscale-[0.5]"
            }`}
          >
            {/* Day and Status */}
            <div className="flex items-center gap-6 w-full lg:w-1/3">
              <label className="relative inline-flex items-center cursor-pointer scale-110">
                <input
                  type="checkbox"
                  checked={item.active}
                  onChange={() => toggleDay(index)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>

              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase italic leading-none">
                  {item.day}
                </h3>
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.15em] ${item.active ? "text-blue-600" : "text-slate-400"}`}
                >
                  {item.active ? "Currently Available" : "Rest Day"}
                </span>
              </div>
            </div>

            {/* Time Pickers */}
            <div
              className={`flex items-center gap-4 w-full lg:w-auto transition-all duration-700 ${item.active ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0 pointer-events-none"}`}
            >
              <div className="flex-1 flex items-center gap-3 bg-slate-100/50 px-6 py-4 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all">
                <Sun size={18} className="text-orange-400" />
                <input
                  type="time"
                  value={item.startTime}
                  onChange={(e) =>
                    updateTime(index, "startTime", e.target.value)
                  }
                  className="bg-transparent font-black text-slate-700 outline-none w-full cursor-pointer"
                />
              </div>

              <div className="h-[2px] w-6 bg-slate-200 hidden md:block"></div>

              <div className="flex-1 flex items-center gap-3 bg-slate-100/50 px-6 py-4 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all">
                <Moon size={18} className="text-indigo-500" />
                <input
                  type="time"
                  value={item.endTime}
                  onChange={(e) => updateTime(index, "endTime", e.target.value)}
                  className="bg-transparent font-black text-slate-700 outline-none w-full cursor-pointer"
                />
              </div>
            </div>

            {/* Shift Summary Tag */}
            <div className="hidden lg:block w-1/4 text-right">
              {item.active ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-[10px] uppercase">
                  <CheckCircle2 size={12} /> Flexible Shift
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-xl font-bold text-[10px] uppercase">
                  <Coffee size={12} /> Holiday
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- INFO NOTE --- */}
      <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-[2.5rem] flex items-start gap-4">
        <div className="bg-blue-600 p-2 rounded-xl text-white mt-1 shadow-lg shadow-blue-200">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="font-black uppercase text-blue-900 text-xs italic tracking-widest">
            Pro Tip
          </h4>
          <p className="text-[11px] font-bold text-blue-700 uppercase opacity-70 leading-relaxed">
            Keeping your schedule updated helps you get 3x more clients. Uncheck
            the days you are busy to avoid unnecessary booking requests.
          </p>
        </div>
      </div>
    </div>
  );
}

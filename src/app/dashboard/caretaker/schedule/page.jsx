"use client";
import { CalendarCheck, Info } from "lucide-react";

export default function SchedulePage() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
        <h1 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
          <CalendarCheck /> My Schedule
        </h1>
        <p className="opacity-60 text-xs mt-2 font-bold uppercase">
          Set your working days and hours
        </p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
        {days.map((day) => (
          <div
            key={day}
            className="flex justify-between items-center p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
          >
            <span className="font-black text-slate-700">{day}</span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                Available
              </span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-slate-800"
                defaultChecked
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

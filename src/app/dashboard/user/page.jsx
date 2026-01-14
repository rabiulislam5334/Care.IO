"use client";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Clock,
  CheckCircle,
  Calendar,
  User as UserIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // ইউজারের ডাটা ফেচ করা
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => setUserData(data));
  }, []);

  const stats = [
    {
      label: "Active Care",
      value: "01",
      icon: <Clock className="text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      label: "Completed",
      value: "12",
      icon: <CheckCircle className="text-emerald-500" />,
      bg: "bg-emerald-50",
    },
    {
      label: "Total Bookings",
      value: "13",
      icon: <Calendar className="text-blue-500" />,
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-8 p-2">
      {/* Welcome Header */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black">
            Hello, {userData?.name || "User"}! 👋
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Welcome back to your CareIO dashboard.
          </p>
          <Link href="/dashboard/admin/profile">
            <button className="mt-6 px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all flex items-center gap-2">
              View Profile <ArrowRight size={16} />
            </button>
          </Link>
        </div>
        {/* Background Blur Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5"
          >
            <div
              className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <h2 className="text-2xl font-black text-slate-800">
                {stat.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section (Placeholder) */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800">Recent Bookings</h3>
          <button className="text-sm font-bold text-blue-600 hover:underline">
            View All
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <LayoutDashboard className="text-slate-300" size={32} />
          </div>
          <p className="text-slate-500 font-bold">No recent bookings found.</p>
          <p className="text-slate-400 text-sm mt-1">
            When you hire a caretaker, they will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

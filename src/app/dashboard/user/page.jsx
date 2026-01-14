"use client";
import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle,
  Calendar,
  LayoutDashboard,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [userRes, bookingRes] = await Promise.all([
        fetch("/api/user/profile"),
        fetch("/api/user/bookings"),
      ]);
      const userData = await userRes.json();
      const bookingData = await bookingRes.json();

      setUserData(userData);
      setBookings(bookingData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const activeCount = bookings.filter((b) => b.status === "pending").length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-8 p-2">
      {/* Welcome Header */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black">Hello, {userData?.name}! 👋</h1>
          <p className="text-slate-400 mt-2 font-medium">
            You have {activeCount} active care requests.
          </p>
        </div>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Active Care",
            value: activeCount,
            icon: <Clock className="text-orange-500" />,
            bg: "bg-orange-50",
          },
          {
            label: "Completed",
            value: completedCount,
            icon: <CheckCircle className="text-emerald-500" />,
            bg: "bg-emerald-50",
          },
          {
            label: "Total Bookings",
            value: bookings.length,
            icon: <Calendar className="text-blue-500" />,
            bg: "bg-blue-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm"
          >
            <div
              className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">
                {stat.label}
              </p>
              <h2 className="text-2xl font-black text-slate-800">
                {stat.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings Table/List */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 mb-6">
          Recent Bookings
        </h3>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"
              >
                <div>
                  <p className="font-bold text-slate-800">
                    {booking.serviceName || "Care Service"}
                  </p>
                  <p className="text-xs text-slate-400">{booking.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    booking.status === "completed"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <LayoutDashboard
              className="mx-auto text-slate-200 mb-4"
              size={48}
            />
            <p className="text-slate-400 font-bold">No bookings yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Package, Clock, Loader2 } from "lucide-react";

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings") // এটি শুধুমাত্র লগইন করা ইউজারের ডাটা আনবে
      .then((res) => res.json())
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Welcome Back! 👋
          </h1>
          <p className="text-slate-500 font-medium">
            Here is what's happening with your care requests.
          </p>
        </div>
      </div>

      {/* User Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UserStatCard
          title="My Bookings"
          value={bookings.length}
          icon={<Package />}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <UserStatCard
          title="Active Care"
          value={bookings.filter((b) => b.status === "Approved").length}
          icon={<Calendar />}
          color="text-green-600"
          bg="bg-green-50"
        />
        <UserStatCard
          title="Pending"
          value={bookings.filter((b) => b.status === "Pending").length}
          icon={<Clock />}
          color="text-orange-600"
          bg="bg-orange-50"
        />
      </div>

      {/* Recent Bookings List */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          Recent Activities
        </h2>
        {bookings.length === 0 ? (
          <p className="text-slate-400 italic">No recent bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div
                key={booking._id}
                className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="font-bold text-slate-800">
                    Booking for {booking.duration} Days
                  </p>
                  <p className="text-xs text-slate-400">
                    {booking.date || "Recently booked"}
                  </p>
                </div>
                <span className="text-sm font-black text-blue-600">
                  {booking.totalCost} BDT
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserStatCard({ title, value, icon, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div
        className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
        {title}
      </p>
      <h2 className="text-3xl font-black text-slate-800 mt-1">{value}</h2>
    </div>
  );
}

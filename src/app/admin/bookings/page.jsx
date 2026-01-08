"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, []);

  const updateStatus = async (id, newStatus) => {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (res.ok) {
      toast.success(`Booking ${newStatus}`);
      // লোকাল স্টেট আপডেট করা যাতে রিলোড ছাড়া পরিবর্তন দেখা যায়
      setBookings(
        bookings.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    }
  };

  return (
    <div className="w-11/12 mx-auto py-10">
      <h2 className="text-3xl font-black text-slate-800 mb-8">
        Manage All Bookings
      </h2>

      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-slate-400 font-bold uppercase text-xs tracking-widest">
                User / Email
              </th>
              <th className="p-6 text-slate-400 font-bold uppercase text-xs tracking-widest">
                Service Details
              </th>
              <th className="p-6 text-slate-400 font-bold uppercase text-xs tracking-widest">
                Amount
              </th>
              <th className="p-6 text-slate-400 font-bold uppercase text-xs tracking-widest">
                Status
              </th>
              <th className="p-6 text-slate-400 font-bold uppercase text-xs tracking-widest">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.map((booking) => (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={booking._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="p-6 font-bold text-slate-700">
                  {booking.userEmail}
                </td>
                <td className="p-6">
                  <p className="font-bold text-slate-800">
                    {booking.duration} Days
                  </p>
                  <p className="text-xs text-slate-400">{booking.address}</p>
                </td>
                <td className="p-6 font-black text-blue-600">
                  {booking.totalCost} BDT
                </td>
                <td className="p-6">
                  <span
                    className={`px-4 py-1.6 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      booking.status === "Pending"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="p-6">
                  {booking.status === "Pending" && (
                    <button
                      onClick={() => updateStatus(booking._id, "Confirmed")}
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all shadow-lg"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

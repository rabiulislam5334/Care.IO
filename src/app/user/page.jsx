"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="p-10 text-center">Loading your care history...</div>;

  return (
    <div className="w-11/12 mx-auto">
      <h2 className="text-3xl font-black text-slate-800 mb-8">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="bg-white p-20 rounded-[2rem] text-center border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">No bookings found yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={booking._id}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl">
                  #
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800">
                    Booking for {booking.duration} Days
                  </h4>
                  <p className="text-slate-500 text-sm">
                    {booking.address}, {booking.district}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase">
                    Total Cost
                  </p>
                  <p className="text-xl font-black text-blue-600">
                    {booking.totalCost} BDT
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider ${
                    booking.status === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, Clock, MapPin } from "lucide-react";
import Swal from "sweetalert2";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (res.ok) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Status: ${newStatus}`,
        showConfirmButton: false,
        timer: 1500,
      });
      fetchBookings();
    }
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">
          Customer Bookings
        </h2>
        <div className="flex gap-2">
          <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
            Pending: {bookings.filter((b) => b.status === "Pending").length}
          </span>
          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
            Approved: {bookings.filter((b) => b.status === "Approved").length}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Customer & Address
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Duration & Cost
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Current Status
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="hover:bg-slate-50/50 transition-all"
              >
                <td className="px-8 py-5">
                  <p className="font-bold text-slate-800">{booking.userName}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {booking.address}, {booking.district}
                  </p>
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm font-bold text-slate-700">
                    {booking.duration} Days
                  </p>
                  <p className="text-blue-600 font-black text-sm">
                    {booking.totalCost} BDT
                  </p>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      booking.status === "Approved"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : booking.status === "Rejected"
                        ? "bg-rose-50 text-rose-600 border-rose-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}
                  >
                    {booking.status === "Approved" ? (
                      <CheckCircle size={12} />
                    ) : booking.status === "Rejected" ? (
                      <XCircle size={12} />
                    ) : (
                      <Clock size={12} />
                    )}
                    {booking.status}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      handleStatusUpdate(booking._id, e.target.value)
                    }
                    className="bg-slate-100 text-slate-600 text-[11px] font-black py-2 px-3 rounded-xl outline-none cursor-pointer hover:bg-slate-200 transition-all"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approve</option>
                    <option value="Rejected">Reject</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Loader2, MapPin, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5; // প্রতি পেজে কয়টি বুকিং দেখাবে

  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: 'price', direction: 'desc' });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // --- Sorting Logic ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    const aValue = a[sortConfig.key] || 0;
    const bValue = b[sortConfig.key] || 0;

    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // --- Pagination Logic ---
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">System Bookings</h2>
        <p className="text-xs font-bold text-slate-400">Total: {bookings.length}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Customer</th>
              
              {/* Price Sortable Header */}
              <th 
                className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center gap-1">
                  Payment <ArrowUpDown size={12} />
                </div>
              </th>
              
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentBookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <p className="font-bold text-slate-800">{booking.userName}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-bold">
                    <MapPin size={10} /> {booking.address}
                  </p>
                </td>
                <td className="px-8 py-5">
                  <p className="font-black text-slate-700">৳{booking.price}</p>
                  <span className={`text-[9px] font-black uppercase ${booking.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-rose-400'}`}>
                    {booking.paymentStatus || 'unpaid'}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      booking.status?.toLowerCase() === "approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                    {booking.status || "Pending"}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Pagination Controls --- */}
      <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
        <p className="text-xs font-bold text-slate-500 uppercase">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
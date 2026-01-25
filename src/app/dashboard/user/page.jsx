"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, MapPin, Clock, ChevronRight, Star, User,
  CheckCircle2, CreditCard, Loader2, AlertCircle, RefreshCcw
} from "lucide-react";
import Swal from "sweetalert2";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // ডাটা ফেচ করার ফাংশন
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Stripe Checkout Handler
  const handlePayment = async (booking) => {
    try {
      setProcessingId(booking._id);
      
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking._id,
          amount: booking.totalCost || booking.price,
          serviceName: booking.category || "Care Service",
        }),
      });

      const data = await res.json();
      
      if (data.url) {
        // পেমেন্ট পেজে যাওয়ার আগে একটি ছোট এনিমেশন বা মেসেজ দেওয়া যেতে পারে
        Swal.fire({
          title: 'Redirecting to Secure Payment...',
          html: 'Please do not close this window.',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => { Swal.showLoading() }
        }).then(() => {
          window.location.href = data.url;
        });
      } else {
        throw new Error(data.message || "Payment initiation failed");
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Could not connect to Stripe. Please try again!',
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading)
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
        <p className="text-slate-500 font-bold tracking-tight animate-pulse">
          Syncing your care history...
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-0 mb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
            My <span className="text-blue-600">Care</span> Bookings
          </h2>
          <p className="text-slate-500 font-medium mt-2 text-lg">
            Manage your requests, track status and make secure payments.
          </p>
        </div>
        <button 
          onClick={fetchBookings}
          className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-slate-200"
        >
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <AlertCircle size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-800">No care requests found!</h3>
          <p className="text-slate-400 mt-2 max-w-xs mx-auto">You haven't booked any caretaker yet. Start exploring our services.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <AnimatePresence>
            {bookings.map((booking, index) => {
              const status = booking.status?.toLowerCase();
              const isPaid = booking.paymentStatus?.toLowerCase() === "paid" || status === "paid";
              const isAccepted = status === "accepted";
              const isPending = status === "pending";

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={booking._id}
                  className="group bg-white p-2 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-500/5 transition-all"
                >
                  <div className="bg-white p-6 md:p-8 rounded-[2.8rem] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    
                    {/* Caretaker Info Section */}
                    <div className="flex items-center gap-6">
                      <div className="relative group-hover:scale-105 transition-transform duration-500">
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-[2.2rem] p-1 shadow-xl">
                          <div className="w-full h-full bg-white rounded-[1.9rem] overflow-hidden">
                            {booking.caretakerImage ? (
                              <img src={booking.caretakerImage} alt="Caretaker" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-400"><User size={40} /></div>
                            )}
                          </div>
                        </div>
                        {isPaid && (
                          <div className="absolute -top-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                            <CheckCircle2 size={16} className="text-white" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-2xl font-black text-slate-800 tracking-tight">{booking.caretakerName || "Expert Caretaker"}</h4>
                          <span className="flex items-center gap-1 text-amber-500 text-xs font-black bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                            <Star size={12} fill="currentColor" /> 5.0
                          </span>
                        </div>
                        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">{booking.category || "Professional Assistance"}</p>
                        <p className="text-slate-400 text-sm font-medium flex items-center gap-1.5"><MapPin size={16} className="text-slate-300" /> {booking.address}</p>
                      </div>
                    </div>

                    {/* Meta Info Section */}
                    <div className="flex flex-wrap items-center gap-8 lg:gap-12 w-full lg:w-auto px-6 py-6 lg:p-0 bg-slate-50 lg:bg-transparent rounded-[2rem]">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Start Date</p>
                        <div className="flex items-center gap-2 text-slate-800 font-bold"><Calendar size={18} className="text-blue-600" /> {booking.startDate}</div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Bill</p>
                        <div className="text-2xl font-black text-slate-900">৳{booking.totalCost || booking.price}</div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-col sm:items-end gap-3 min-w-[160px]">
                        <span className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-2 ${
                            isPending ? "bg-amber-50 text-amber-600 border-amber-100" : 
                            isPaid ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            "bg-blue-50 text-blue-600 border-blue-100"
                          }`}
                        >
                          {isPending ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                          {isPaid ? "Payment Verified" : status}
                        </span>

                        {isAccepted && !isPaid && (
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePayment(booking)}
                            disabled={processingId === booking._id}
                            className="w-full bg-slate-900 text-white px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 hover:bg-blue-600 transition-all"
                          >
                            {processingId === booking._id ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
                            Pay Securely Now
                          </motion.button>
                        )}
                        
                        <button className="text-slate-400 text-[10px] font-black hover:text-blue-600 flex items-center gap-1 uppercase tracking-widest transition-colors mx-auto sm:mr-0">
                          Booking Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
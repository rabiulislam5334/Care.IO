"use client";
import React, { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  ChevronRight,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingPage({ params }) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;

  const { data: session } = useSession();
  const router = useRouter();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form States
  const [startDate, setStartDate] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        // ?id= বাদ দিয়ে সরাসরি আইডি দিন
        const res = await fetch(`/api/caretaker/service-details/${serviceId}`);

        if (!res.ok) throw new Error("Failed to fetch service");

        const data = await res.json();
        setService(data);
      } catch (error) {
        console.error("Booking Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) fetchService();
  }, [serviceId]);
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!session) return alert("Please login to book!");

    setBookingLoading(true);
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          // এখানে নিশ্চিত করুন service.email এবং service.monthlyRate এ ডাটা আছে
          caretakerEmail: service?.email,
          userName: session.user.name,
          userEmail: session.user.email,
          startDate,
          address,
          note,
          price: service?.monthlyRate, // price ফিল্ডটি যোগ করুন
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => router.push("/dashboard/user"), 3000);
      } else {
        const data = await res.json();
        alert(data.error || "Something went wrong!");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setBookingLoading(false);
    }
  };
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="w-11/12 max-w-5xl mx-auto">
        <AnimatePresence>
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 rounded-[3rem] shadow-xl text-center border border-green-100"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Booking Requested!
              </h2>
              <p className="text-slate-500 font-medium">
                Your request has been sent to {service.userName}. Redirecting to
                dashboard...
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Left Column: Booking Form */}
              <div className="lg:col-span-3 space-y-8">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <Calendar className="text-blue-600" /> Complete Booking
                  </h1>

                  <form onSubmit={handleBooking} className="space-y-6">
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">
                        Expected Start Date
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full p-4 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-600"
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">
                        Service Address
                      </label>
                      <div className="relative">
                        <MapPin
                          className="absolute left-4 top-4 text-slate-400"
                          size={20}
                        />
                        <textarea
                          placeholder="Your full address where service is needed"
                          required
                          className="w-full p-4 pl-12 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-600 h-24"
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">
                        Special Notes (Optional)
                      </label>
                      <textarea
                        placeholder="Any specific requirements or medical conditions..."
                        className="w-full p-4 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-600 h-24"
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>

                    <button
                      disabled={bookingLoading}
                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                    >
                      {bookingLoading
                        ? "Processing..."
                        : "Confirm Booking Request"}{" "}
                      <ChevronRight size={20} />
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-2">
                <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-10 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />

                  <h2 className="text-xl font-black mb-8 border-b border-slate-800 pb-4">
                    Service Summary
                  </h2>

                  <div className="flex items-center gap-4 mb-8 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                    <img
                      src={service.image}
                      className="w-16 h-16 rounded-xl object-cover"
                      alt=""
                    />
                    <div>
                      <h3 className="font-black text-lg">{service.userName}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {service.category}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between font-bold text-slate-400">
                      <span>Monthly Charge</span>
                      <span className="text-white">৳{service.monthlyRate}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-400">
                      <span>Platform Fee</span>
                      <span className="text-white">৳0 (Free)</span>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                      <span className="font-black text-lg text-blue-400 uppercase">
                        Total
                      </span>
                      <span className="text-4xl font-black">
                        ৳{service.monthlyRate}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-600/10 border border-blue-600/20 p-4 rounded-2xl flex gap-3 items-start">
                    <ShieldCheck className="text-blue-400 shrink-0" size={20} />
                    <p className="text-[10px] font-bold text-blue-100 leading-relaxed uppercase tracking-wider">
                      Money-back guarantee. Pay only after the service provider
                      accepts your request.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { CreditCard, TrendingUp, Wallet, Loader2 } from "lucide-react";

export default function EarningPage() {
  const [data, setData] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    serviceFee: 0,
    history: [],
  });
  const [loading, setLoading] = useState(true);

// useEffect এর ভেতর নিচের কোডটি ব্যবহার করুন
useEffect(() => {
  const fetchEarnings = async () => {
    try {
      const res = await fetch("/api/user/bookings");
      const bookings = await res.json();

      if (!Array.isArray(bookings)) return;

      // Status check should be case-insensitive
      const completed = bookings.filter(b => 
        ["completed", "paid", "success"].includes(b.status?.toLowerCase())
      );

      // আপনার ডাটাবেসে ফিল্ডের নাম totalPrice হতে পারে, সেটি চেক করুন
      const total = completed.reduce((sum, item) => sum + (Number(item.totalPrice || item.price || 0)), 0);
      const fee = total * 0.1;

      setData({
        totalEarnings: total - fee,
        completedJobs: completed.length,
        serviceFee: fee,
        history: completed.slice(0, 10), // ১০টি হিস্ট্রি দেখান
      });
    } catch (err) {
      console.error("Failed to load earnings", err);
    } finally {
      setLoading(false);
    }
  };
  fetchEarnings();
}, []);

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  return (
    <div className="p-4 space-y-8">
      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">
            Net Earnings
          </p>
          <h1 className="text-5xl font-black tracking-tighter">
            ৳ {data.totalEarnings.toLocaleString()}
          </h1>
          <div className="mt-8 flex gap-4">
            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-xs font-bold">Real-time Balance</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
            Completed Jobs
          </p>
          <p className="text-3xl font-black text-slate-800">
            {data.completedJobs}
          </p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
            Service Fee (10%)
          </p>
          <p className="text-3xl font-black text-rose-500">
            ৳ {data.serviceFee.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent History */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest ml-2">
          Income History
        </h3>
        <div className="bg-white rounded-[2rem] border border-slate-100 divide-y divide-slate-50 overflow-hidden">
          {data.history.length > 0 ? (
            data.history.map((job) => (
              <div
                key={job._id}
                className="p-5 flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-800">
                      {job.category || "Service"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {job.date || "Completed"}
                    </p>
                  </div>
                </div>
                <p className="font-black text-emerald-600">+৳ {job.price}</p>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-slate-400 text-xs font-bold uppercase italic">
              No earnings yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

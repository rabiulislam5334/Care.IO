"use client";
import { useEffect, useState } from "react";
import { CreditCard, TrendingUp, Wallet, Loader2, ArrowUpRight } from "lucide-react";

export default function EarningPage() {
  const [data, setData] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    serviceFee: 0,
    history: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await fetch("/api/user/bookings");
        const bookings = await res.json();

        if (!Array.isArray(bookings)) return;

        // ✅ আপডেট করা ফিল্টার: status এর বদলে paymentStatus চেক করুন
        const paidBookings = bookings.filter(b => 
          b.paymentStatus?.toLowerCase() === "paid" || 
          b.status?.toLowerCase() === "completed"
        );

        // ✅ প্রাইস ক্যালকুলেশন (price বা totalPrice যেটাই থাকুক)
        const total = paidBookings.reduce((sum, item) => {
          const amount = Number(item.price || item.totalPrice || 0);
          return sum + amount;
        }, 0);

        const fee = total * 0.10; // ১০% সার্ভিস ফি

        setData({
          totalEarnings: total - fee,
          completedJobs: paidBookings.length,
          serviceFee: fee,
          history: paidBookings.slice(0, 10),
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
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">
            Net Earnings (After 10% Fee)
          </p>
          <h1 className="text-5xl font-black tracking-tighter">
            ৳ {data.totalEarnings.toLocaleString()}
          </h1>
          <div className="mt-8 flex gap-4">
            <div className="bg-emerald-500/20 px-4 py-2 rounded-xl backdrop-blur-md border border-emerald-500/20 flex items-center gap-2 text-emerald-400">
              <TrendingUp size={16} />
              <span className="text-xs font-bold">Balance Updated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Paid Jobs</p>
          <p className="text-3xl font-black text-slate-800">{data.completedJobs}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Service Fee</p>
          <p className="text-3xl font-black text-rose-500">-৳{data.serviceFee.toLocaleString()}</p>
        </div>
      </div>

      {/* Recent History */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest ml-2">Income History</h3>
        <div className="bg-white rounded-[2rem] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
          {data.history.length > 0 ? (
            data.history.map((job) => (
              <div key={job._id} className="p-5 flex justify-between items-center hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-800">{job.serviceName || "Care Service"}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{job.paymentStatus === 'paid' ? 'Verified Payment' : 'Success'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-600">+৳{job.price || job.totalPrice}</p>
                  <p className="text-[9px] text-slate-300 font-bold uppercase">{new Date(job.updatedAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 text-center">
              <CreditCard className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 text-xs font-bold uppercase italic">No verified earnings yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
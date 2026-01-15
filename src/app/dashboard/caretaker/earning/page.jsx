"use client";
import { CreditCard, TrendingUp, Wallet, ArrowUpRight } from "lucide-react";

export default function EarningPage() {
  return (
    <div className="p-4 space-y-8">
      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">
            Total Earnings
          </p>
          <h1 className="text-5xl font-black tracking-tighter">৳ ১২,৫০০.০০</h1>
          <div className="mt-8 flex gap-4">
            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-xs font-bold">+১৫% This Month</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
            Completed Jobs
          </p>
          <p className="text-3xl font-black text-slate-800">২৪</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
            Service Fee
          </p>
          <p className="text-3xl font-black text-slate-800">৳ ২,৪০০</p>
        </div>
      </div>

      {/* Recent History */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest ml-2">
          Recent Payouts
        </h3>
        <div className="bg-white rounded-[2rem] border border-slate-100 divide-y divide-slate-50">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-600">
                  <Wallet size={20} />
                </div>
                <div>
                  <p className="font-black text-sm text-slate-800">
                    Payment Received
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Jan {10 + i}, 2026
                  </p>
                </div>
              </div>
              <p className="font-black text-emerald-600">+৳ ২৫০০</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

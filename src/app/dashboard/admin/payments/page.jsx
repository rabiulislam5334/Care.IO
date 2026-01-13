"use client";
import { useEffect, useState } from "react";
import {
  CreditCard,
  Download,
  Search,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((res) => res.json())
      .then((data) => {
        setPayments(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
        <p className="text-slate-500 font-bold">Fetching Transactions...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <CreditCard className="text-blue-600" size={32} /> Payments
          </h1>
          <p className="text-slate-500 font-medium">
            Monitor all incoming transactions and revenue.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-slate-700 transition-all shadow-lg shadow-slate-200">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Stats Summary */}
      <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl shadow-blue-100 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-blue-100 font-bold text-sm uppercase tracking-widest mb-1">
            Total Revenue
          </p>
          <h2 className="text-4xl font-black">
            $
            {payments
              .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0)
              .toFixed(2)}
          </h2>
        </div>
        <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md relative z-10">
          <CreditCard size={40} />
        </div>
        {/* Decorative Circle */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-slate-800">Transaction History</h3>
          <div className="relative w-full md:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by email or ID..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                  User / Email
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                  Transaction ID
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                  Date
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                  Amount
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="hover:bg-slate-50/50 transition-all group"
                >
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800">
                      {payment.userName || "Customer"}
                    </p>
                    <p className="text-xs text-slate-400">{payment.email}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-1 rounded text-slate-600">
                      {payment.transactionId || payment._id}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 font-black text-slate-800">
                    ${payment.amount}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center">
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase border border-emerald-100">
                        <CheckCircle2 size={12} /> Success
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

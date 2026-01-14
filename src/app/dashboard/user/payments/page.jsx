"use client";
import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("/api/user/bookings");
        if (!res.ok) throw new Error("Failed to fetch payments");
        const data = await res.json();

        // শুধু 'paid' স্ট্যাটাস ওয়ালা বুকিংগুলো ফিল্টার করা
        const paidOnly = data.filter((item) => item.paymentStatus === "paid");
        setPayments(paidOnly);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-bold animate-pulse">
          Loading Transaction History...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-rose-500 gap-2">
        <AlertCircle size={40} />
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-800">Payment History</h1>
        <p className="text-slate-500 font-medium">
          View and manage your recent care transactions.
        </p>
      </div>

      {payments.length > 0 ? (
        <div className="grid gap-4">
          {payments.map((pay, index) => (
            <div
              key={pay._id || index}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row items-center justify-between shadow-sm hover:shadow-md transition-shadow gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-lg leading-tight">
                    {pay.serviceName || "Care Service"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                    ID: {pay.transactionId || pay._id?.substring(0, 8) || "N/A"}{" "}
                    • {pay.date || "Recent"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:text-right gap-6">
                <div>
                  <p className="text-2xl font-black text-slate-800">
                    ${pay.price || 0}
                  </p>
                  <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
                    Paid via Card
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-16 rounded-[3rem] text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="text-slate-300" size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-800">
            No Payments Found
          </h3>
          <p className="text-slate-400 font-medium mt-2">
            Your transaction history will appear here once you complete a
            booking.
          </p>
        </div>
      )}
    </div>
  );
}

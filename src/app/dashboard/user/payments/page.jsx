"use client";
import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, Loader2, AlertCircle, Calendar, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  // ১. ডাটা ফেচ করার ফাংশন
  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/user/bookings");
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();

      // শুধু 'paid' স্ট্যাটাস ওয়ালা বুকিংগুলো ফিল্টার করা
      const paidOnly = data.filter(
        (item) => item.paymentStatus?.toLowerCase() === "paid"
      );
      setPayments(paidOnly);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ২. পেমেন্ট সাকসেস হয়ে এই পেজে ফিরলে ডাটাবেস আপডেট করা
  useEffect(() => {
    const updatePaymentStatus = async () => {
      const bookingId = searchParams.get("booking_id");
      const sessionId = searchParams.get("session_id");

      if (bookingId && sessionId) {
        try {
          // আপনার তৈরি করা সাকসেস এপিআই কল করা
          const res = await fetch("/api/bookings/success", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId,
              transactionId: sessionId,
            }),
          });

          if (res.ok) {
            // আপডেট সফল হলে ডাটা পুনরায় লোড করুন
            fetchPayments();
          }
        } catch (err) {
          console.error("Payment confirmation failed:", err);
        }
      } else {
        // যদি ইউআরএলে কিছু না থাকে, সাধারণ হিস্টোরি লোড করুন
        fetchPayments();
      }
    };

    updatePaymentStatus();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-bold animate-pulse">
          Verifying Transactions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-rose-500 gap-2">
        <AlertCircle size={40} />
        <p className="font-bold">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-sm underline mt-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          Payment <span className="text-blue-600">History</span>
        </h1>
        <p className="text-slate-500 font-medium">
          View and manage your recent care transactions and invoices.
        </p>
      </div>

      

      {payments.length > 0 ? (
        <div className="grid gap-4">
          {payments.map((pay) => (
            <div
              key={pay._id}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row items-center justify-between shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 gap-4 group"
            >
              <div className="flex items-center gap-5 w-full sm:w-auto">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-xl leading-tight">
                    {pay.serviceName || "Caregiver Service"}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">
                        TRX: {pay.transactionId?.substring(0, 12) || pay._id?.substring(0, 8)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] uppercase">
                      <Calendar size={12} className="text-blue-400" />
                      {pay.updatedAt ? new Date(pay.updatedAt).toLocaleDateString() : "Processing"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:text-right gap-8 border-t sm:border-0 pt-4 sm:pt-0">
                <div>
                  <p className="text-3xl font-black text-slate-900">
                    ৳{pay.price || 0}
                  </p>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                      Payment Successful
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block text-slate-200 group-hover:text-blue-200 transition-colors">
                  <ArrowRight size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-slate-100">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CreditCard className="text-slate-200" size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-800">No Transactions Yet</h3>
          <p className="max-w-xs mx-auto text-slate-400 font-medium mt-3">
            Once you complete a service booking payment, your detailed invoices will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
"use client";
import { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import Swal from "sweetalert2";

export default function SupportPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // এখানে আপনি আপনার সাপোর্ট API কল করতে পারেন
    // আপাতত একটি সিমুলেশন দেওয়া হলো
    setTimeout(() => {
      setLoading(false);
      Swal.fire({
        title: "Message Sent!",
        text: "Our support team will contact you shortly.",
        icon: "success",
        confirmButtonColor: "#1e293b",
      });
      e.target.reset();
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-2">
      {/* Header Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-4">How can we help?</h1>
          <p className="text-slate-400 font-medium max-w-xl">
            Have questions about your booking or need assistance with a
            caretaker? Our team is here for you 24/7.
          </p>
        </div>
        <HelpCircle
          size={180}
          className="absolute -right-10 -bottom-10 text-white/5 rotate-12"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Call Center
              </p>
              <p className="font-bold text-slate-800">+880 1234-567890</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Email Support
              </p>
              <p className="font-bold text-slate-800">support@careio.xyz</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Availability
              </p>
              <p className="font-bold text-slate-800">24/7 Service</p>
            </div>
          </div>
        </div>

        {/* Support Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6"
          >
            <h3 className="text-2xl font-black text-slate-800 mb-2">
              Send us a message
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">
                  Your Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">
                  Subject
                </label>
                <select className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700">
                  <option>Booking Issue</option>
                  <option>Payment Problem</option>
                  <option>Feedback</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">
                Message
              </label>
              <textarea
                required
                rows="5"
                placeholder="How can we help you today?"
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
              ></textarea>
            </div>

            <button
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl disabled:bg-slate-400"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Send size={20} /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Sneak Peek */}
      <div className="text-center py-10">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">
          Quick Answer
        </p>
        <h2 className="text-2xl font-black text-slate-800">Common Questions</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="p-6 bg-white rounded-3xl border border-slate-50">
            <p className="font-black text-slate-800 mb-2 italic">
              "How do I cancel a booking?"
            </p>
            <p className="text-sm text-slate-500">
              Go to My Bookings, click on the active booking and select
              'Cancel'. Refunds take 3-5 days.
            </p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-50">
            <p className="font-black text-slate-800 mb-2 italic">
              "Are caretakers verified?"
            </p>
            <p className="text-sm text-slate-500">
              Yes, every caretaker goes through a strict background check and
              identity verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

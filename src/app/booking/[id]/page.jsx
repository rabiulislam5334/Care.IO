"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function BookingPage({ params }) {
  const [totalCost, setTotalCost] = useState(0);
  const servicePrice = 500; // এটি সার্ভিস আইডি অনুযায়ী ডাটাবেজ থেকে আসবে

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { duration: 1 },
  });

  // ডিউরেশন ওয়াচ করা যাতে রিয়েল-টাইম কস্ট আপডেট হয়
  const duration = watch("duration");

  useEffect(() => {
    setTotalCost(duration * servicePrice);
  }, [duration]);

  const onSubmit = async (data) => {
    const bookingData = {
      ...data,
      serviceId: params.id,
      totalCost,
      status: "Pending",
      createdAt: new Date(),
    };

    console.log("Booking Data:", bookingData);
    toast.success("Booking Saved as Pending!");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-11/12 md:w-10/12 lg:w-8/12 mx-auto bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Left Side: Summary (Order Info) */}
          <div className="lg:col-span-2 bg-blue-600 p-8 lg:p-12 text-white">
            <h2 className="text-3xl font-black mb-6">Booking Summary</h2>
            <div className="space-y-6">
              <div className="flex justify-between border-b border-blue-400 pb-4">
                <span>Service Price</span>
                <span className="font-bold">{servicePrice} BDT / Day</span>
              </div>
              <div className="flex justify-between border-b border-blue-400 pb-4">
                <span>Duration</span>
                <span className="font-bold">{duration || 1} Days</span>
              </div>
              <div className="pt-6">
                <p className="text-blue-200 text-sm uppercase font-bold tracking-widest">
                  Total Amount
                </p>
                <h3 className="text-5xl font-black mt-2">{totalCost} BDT</h3>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-3 p-8 lg:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Duration Section */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Duration (In Days)
                </label>
                <input
                  type="number"
                  {...register("duration", { min: 1, required: true })}
                  className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-bold"
                />
              </div>

              {/* Location Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase ml-1">
                    Division
                  </label>
                  <select
                    {...register("division", { required: true })}
                    className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select Division</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase ml-1">
                    District
                  </label>
                  <input
                    {...register("district", { required: true })}
                    placeholder="Enter District"
                    className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Address Section */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase ml-1">
                  Full Area / Address
                </label>
                <textarea
                  {...register("address", { required: true })}
                  placeholder="Street name, House no, Area..."
                  rows="3"
                  className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                {isSubmitting ? "Confirming..." : "Confirm Booking Now"}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

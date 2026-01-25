"use client";
import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Star,
  Heart,
  MessageSquare,
  Send,
  CheckCircle,
  MapPin,
  Phone,
  User,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Tag,
  Calendar,
  Clock,
  Globe,
  Lock,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function ServiceDetails({ params }) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;

  const { data: session } = useSession();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [serviceId]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/caretaker/service-details/${serviceId}`);
      if (!res.ok) throw new Error("Failed to load service");
      const data = await res.json();
      setService(data);

      if (
        session?.user?.email &&
        data.favoriteBy?.includes(session.user.email)
      ) {
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!session) return alert("Please login first!");
    setIsFavorite(!isFavorite);
    await fetch("/api/caretaker/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId, action: "favorite" }),
    });
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/caretaker/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          action: "review",
          rating,
          comment,
        }),
      });
      if (res.ok) {
        setComment("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-20 font-black uppercase text-slate-500">
        Service Not Found
      </div>
    );
  }

  // Mask NID - show only last 4 digits if logged in
  const maskedNID = service.nidNumber
    ? session
      ? `****-****-****-${service.nidNumber.slice(-4)}`
      : "Login to view"
    : "Not provided";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-10">
      <div className="w-11/12 max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 rounded-bl-[6rem] -z-0" />

          <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
            <div className="relative">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                <img
                  src={
                    service.image ||
                    "https://placehold.co/400x400?text=No+Photo"
                  }
                  className="w-full h-full object-cover"
                  alt={service.userName || service.category}
                />
              </div>
              <button
                onClick={handleFavorite}
                className={`absolute -bottom-2 -right-2 p-3.5 rounded-2xl shadow-xl transition-all ${
                  isFavorite
                    ? "bg-red-500 text-white"
                    : "bg-white text-slate-300 hover:text-red-500"
                }`}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldCheck size={12} /> Verified Caregiver
                </span>
                <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Tag size={12} /> {service.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 capitalize leading-tight">
                {service.userName || "Care Provider"}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mt-6">
                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 shrink-0">
                    <MapPin size={16} />
                  </div>
                  {service.district}, {service.region} • {service.city}
                </div>

                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Briefcase size={16} />
                  </div>
                  Experience: {service.experience || "Not specified"}
                </div>

                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 shrink-0">
                    <User size={16} />
                  </div>
                  Gender: {service.gender || "Not specified"}
                </div>

                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Clock size={16} />
                  </div>
                  Shift: {service.shift || "Flexible"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Details & Reviews */}
          <div className="lg:col-span-2 space-y-10">
            {/* Service Details Section */}
            <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-900">
                <Tag className="text-blue-600" /> Service Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">
                    Availability Type
                  </p>
                  <p className="font-medium">
                    {service.availability || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">
                    Hourly Rate
                  </p>
                  <p className="font-medium text-xl font-black text-blue-700">
                    ৳{service.hourlyRate || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">
                    Monthly Rate
                  </p>
                  <p className="font-medium text-xl font-black text-green-700">
                    ৳{service.monthlyRate || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">
                    Emergency Contact
                  </p>
                  <p className="font-medium">
                    {session
                      ? service.emergencyContact || "Not provided"
                      : "Login to view"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">
                    NID Number (verified)
                  </p>
                  <p className="font-medium flex items-center gap-2">
                    {maskedNID}
                    {session && <Lock size={14} className="text-slate-400" />}
                  </p>
                </div>

                {service.languages?.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">
                      Languages Spoken
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.languages.map((lang, i) => (
                        <span
                          key={i}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          <Globe size={14} className="inline mr-1" />
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {service.coveredAreas?.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">
                      Service Coverage Areas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.coveredAreas.map((area, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Weekly Schedule */}
            {service.schedule?.length > 0 && (
              <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-900">
                  <Calendar className="text-blue-600" /> Weekly Availability
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                  {service.schedule.map((day, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl border text-center ${
                        day.active
                          ? "bg-blue-50 border-blue-200"
                          : "bg-slate-50 border-slate-200 opacity-60"
                      }`}
                    >
                      <p className="font-black text-slate-700 mb-2">
                        {day.day}
                      </p>
                      {day.active ? (
                        <p className="text-sm font-medium text-slate-600">
                          {day.startTime} – {day.endTime}
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-slate-400">
                          Closed
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bio */}
            <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-900">
                <User className="text-blue-600" /> About the Provider
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg font-medium">
                {service.bio ||
                  "Dedicated and professional caregiver focused on providing safe, compassionate, and reliable care services."}
              </p>
            </section>

            {/* Reviews */}
            <section className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <MessageSquare className="text-blue-600" /> Community Feedback
              </h2>

              {session && (
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-blue-50 shadow-xl shadow-blue-900/5">
                  <p className="font-black text-slate-800 mb-4 uppercase text-[10px] tracking-widest">
                    Rate & Review
                  </p>
                  <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={26}
                        className="cursor-pointer transition-transform hover:scale-110"
                        fill={s <= rating ? "#F59E0B" : "none"}
                        color={s <= rating ? "#F59E0B" : "#CBD5E1"}
                        onClick={() => setRating(s)}
                      />
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full p-5 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 outline-none h-32 mb-4"
                  />
                  <button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting || !comment.trim()}
                    className="bg-blue-600 text-white px-10 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-60"
                  >
                    {isSubmitting ? "Posting..." : "Submit Review"}{" "}
                    <Send size={18} />
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {service.reviews?.length > 0 ? (
                  service.reviews.map((rev, i) => (
                    <div
                      key={i}
                      className="bg-white p-7 rounded-3xl border border-slate-100 flex gap-5 shadow-sm"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center font-black text-blue-600 shrink-0 uppercase">
                        {rev.user?.[0] || "?"}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-slate-900">
                            {rev.user || "Anonymous"}
                          </h4>
                          <div className="flex text-amber-400 gap-1 items-center bg-amber-50 px-2 py-1 rounded-lg">
                            <Star size={12} fill="currentColor" />
                            <span className="text-xs font-black">
                              {rev.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-600 font-medium text-sm leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-bold">
                    No reviews yet. Be the first to share your experience!
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Pricing & Action */}
          <div className="lg:col-span-1">
            <div className="sticky top-10 bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />

              <p className="text-blue-400 font-black uppercase text-[10px] tracking-widest mb-4">
                Starting From
              </p>
              <h3 className="text-6xl font-black mb-3 leading-none tracking-tighter">
                ৳{service.monthlyRate || service.hourlyRate || "—"}
              </h3>
              <p className="text-slate-400 mb-10">
                {service.monthlyRate ? "per month" : "per hour"}
              </p>

              <div className="space-y-5 mb-10">
                <div className="flex items-center gap-4 text-sm font-bold text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                    <CheckCircle size={14} />
                  </div>
                  Background Verified
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                    <CheckCircle size={14} />
                  </div>
                  24/7 Emergency Support
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                    <CheckCircle size={14} />
                  </div>
                  Secure Booking
                </div>
              </div>

              <Link href={`/booking/${serviceId}`}>
                <button className="w-full bg-white text-slate-900 py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all group">
                  Book Now{" "}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </button>
              </Link>

              <p className="text-center text-[10px] text-slate-500 mt-8 font-bold uppercase tracking-widest">
                Free cancellation • Secure payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

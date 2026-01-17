"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Anisur Rahman",
    role: "Parent",
    text: "Care.IO helped me find the best nanny for my baby. Very professional!",
  },
  {
    name: "Sumaiya Akter",
    role: "Patient Daughter",
    text: "The nursing service was excellent. My father felt very comfortable.",
  },
  {
    name: "Rahat Karim",
    role: "Son",
    text: "Reliable and trustworthy. The caretaker was very punctual and caring.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-slate-50 overflow-hidden">
      <div className="w-11/12 mx-auto">
        <h2 className="text-4xl font-black text-center mb-16 text-slate-900">
          What Families Say
        </h2>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 } }}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          className="pb-16"
        >
          {reviews.map((r, i) => (
            <SwiperSlide key={i}>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 h-full">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#facc15" color="#facc15" />
                  ))}
                </div>
                <p className="text-lg text-slate-600 italic mb-8 font-medium">
                  "{r.text}"
                </p>
                <h4 className="font-black text-slate-900">{r.name}</h4>
                <p className="text-blue-600 text-xs font-bold uppercase tracking-widest">
                  {r.role}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

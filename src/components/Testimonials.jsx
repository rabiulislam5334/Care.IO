"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Anisur Rahman",
    role: "Parent",
    img: "https://i.pravatar.cc/150?u=anis",
    text: "Care.IO helped me find the best nanny for my baby. The verification process gave me peace of mind. Very professional!",
  },
  {
    name: "Sumaiya Akter",
    role: "Patient Daughter",
    img: "https://i.pravatar.cc/150?u=sumi",
    text: "The nursing service was excellent. My father felt very comfortable with the caretaker. Highly recommended for home care.",
  },
  {
    name: "Rahat Karim",
    role: "Son",
    img: "https://i.pravatar.cc/150?u=rahat",
    text: "Reliable and trustworthy. The caretaker was very punctual, caring, and handled everything with great patience.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-[#F8FAFC] overflow-hidden">
      <div className="w-11/12 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="h-1.5 w-10 bg-blue-600 rounded-full" />
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">Reviews</p>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            What Our <span className="text-blue-600 italic">Families</span> Say
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{ 
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 } 
          }}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          className="pb-20 testimonial-swiper"
        >
          {reviews.map((r, i) => (
            <SwiperSlide key={i} className="h-auto">
              <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 h-full flex flex-col relative group">
                
                {/* Quote Icon Background */}
                <div className="absolute top-8 right-8 text-slate-50 group-hover:text-blue-50 transition-colors">
                  <Quote size={60} fill="currentColor" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#facc15" color="#facc15" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-slate-600 leading-relaxed font-medium mb-8 relative z-10 flex-1">
                  "{r.text}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-slate-50 relative z-10">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-blue-100">
                    <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{r.name}</h4>
                    <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                      {r.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .testimonial-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 6px;
          border-radius: 4px;
          background: #cbd5e1;
          transition: all 0.3s;
        }
        .testimonial-swiper .swiper-pagination-bullet-active {
          width: 30px;
          background: #2563eb;
        }
      `}</style>
    </section>
  );
}
"use client";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        {/* বাইরের এনিমেটেড সার্কেল */}
        <motion.div
          animate={{
            rotate: 360,
            borderRadius: ["30%", "50%", "30%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-24 h-24 border-4 border-dashed border-blue-600"
        />

        {/* মাঝখানে ব্র্যান্ডের লোগো বা অক্ষর */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute text-2xl font-black text-blue-600"
        >
          Care
        </motion.div>
      </div>

      {/* নিচের টেক্সট ও ডটস */}
      <div className="mt-8 flex flex-col items-center">
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">
          Loading Excellence
        </p>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 bg-blue-600 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

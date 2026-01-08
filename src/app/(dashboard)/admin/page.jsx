"use client";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Revenue", value: "$4,500", color: "bg-blue-500" },
  { label: "Active Bookings", value: "12", color: "bg-green-500" },
  { label: "New Users", value: "48", color: "bg-purple-500" },
];

export default function AdminPage() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            <p className="text-slate-500 font-medium">{stat.label}</p>
            <h3 className="text-3xl font-black mt-2 text-slate-800">
              {stat.value}
            </h3>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-400 border-dashed border-2">
        Recent Activity Chart (Placeholder)
      </div>
    </div>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import { Users, DollarSign, Calendar } from "lucide-react";

// export default function AdminPage() {
//   const [stats, setStats] = useState({
//     userCount: 0,
//     bookingCount: 0,
//     totalRevenue: 0,
//   });

//   useEffect(() => {
//     fetch("/api/admin/stats")
//       .then((res) => res.json())
//       .then((data) => setStats(data));
//   }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       <StatCard
//         title="Total Users"
//         value={stats.userCount}
//         icon={<Users />}
//         color="text-blue-600"
//       />
//       <StatCard
//         title="Total Bookings"
//         value={stats.bookingCount}
//         icon={<Calendar />}
//         color="text-green-600"
//       />
//       <StatCard
//         title="Revenue"
//         value={`$${stats.totalRevenue}`}
//         icon={<DollarSign />}
//         color="text-purple-600"
//       />
//     </div>
//   );
// }

// function StatCard({ title, value, icon, color }) {
//   return (
//     <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
//       <div className={`${color} mb-4`}>{icon}</div>
//       <p className="text-slate-500 text-sm font-bold uppercase">{title}</p>
//       <h2 className="text-3xl font-black">{value}</h2>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, DollarSign, Calendar, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-8">
      {/* কার্ড সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.userCount}
          icon={<Users />}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Total Bookings"
          value={stats.bookingCount}
          icon={<Calendar />}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue}`}
          icon={<DollarSign />}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* রিয়েল ডাটা চার্ট */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-black mb-6">
          Revenue Analytics (Real-time)
        </h2>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.chartData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                fill="url(#colorTotal)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div
        className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase">{title}</p>
      <h2 className="text-3xl font-black text-slate-800">{value}</h2>
    </div>
  );
}

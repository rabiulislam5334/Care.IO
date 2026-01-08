"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  CalendarCheck,
  Users,
  CreditCard,
  Heart,
} from "lucide-react";

const menuItems = {
  user: [
    { name: "My Bookings", path: "/user", icon: <CalendarCheck size={20} /> },
    { name: "Profile", path: "/user/profile", icon: <User size={20} /> },
    { name: "Support", path: "/user/support", icon: <Heart size={20} /> },
  ],
  caretaker: [
    { name: "Tasks", path: "/caretaker", icon: <LayoutDashboard size={20} /> },
    {
      name: "My Schedule",
      path: "/caretaker/schedule",
      icon: <CalendarCheck size={20} />,
    },
    {
      name: "Earning",
      path: "/caretaker/earning",
      icon: <CreditCard size={20} />,
    },
  ],
  admin: [
    { name: "Admin Home", path: "/admin", icon: <LayoutDashboard size={20} /> },
    {
      name: "All Bookings",
      path: "/admin/bookings",
      icon: <CalendarCheck size={20} />,
    },
    { name: "Manage Users", path: "/admin/users", icon: <Users size={20} /> },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: <CreditCard size={20} />,
    },
  ],
};

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role || "user"; // Default to user

  return (
    <div className="w-64 min-h-screen bg-white border-r border-slate-200 p-6 flex flex-col">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-black text-blue-600">Care.IO</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          {role} Panel
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems[role]?.map((item) => (
          <Link key={item.path} href={item.path}>
            <motion.div
              whileHover={{ x: 5 }}
              className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${
                pathname === item.path
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.icon}
              {item.name}
            </motion.div>
          </Link>
        ))}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-3 p-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}

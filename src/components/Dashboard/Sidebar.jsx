"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  LogOut,
  CalendarCheck,
  Users,
  CreditCard,
  Heart,
  ChevronRight,
  Settings,
} from "lucide-react";

// মেইন মেনু আইটেমগুলো এখানে থাকবে (রোল অনুযায়ী আলাদা)
const menuItems = {
  user: [
    {
      name: "My Bookings",
      path: "/dashboard/user",
      icon: <CalendarCheck size={20} />,
    },
    {
      name: "Support",
      path: "/dashboard/user/support",
      icon: <Heart size={20} />,
    },
  ],
  caretaker: [
    {
      name: "Tasks",
      path: "/dashboard/caretaker",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "My Schedule",
      path: "/dashboard/caretaker/schedule",
      icon: <CalendarCheck size={20} />,
    },
    {
      name: "Earning",
      path: "/dashboard/caretaker/earning",
      icon: <CreditCard size={20} />,
    },
  ],
  admin: [
    {
      name: "Admin Home",
      path: "/dashboard/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "All Bookings",
      path: "/dashboard/admin/bookings",
      icon: <CalendarCheck size={20} />,
    },
    {
      name: "Manage Users",
      path: "/dashboard/admin/users",
      icon: <Users size={20} />,
    },
    {
      name: "Payments",
      path: "/dashboard/admin/payments",
      icon: <CreditCard size={20} />,
    },
  ],
};

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role || "user";

  return (
    <div className="w-64 min-h-screen bg-white border-r border-slate-100 p-6 flex flex-col shadow-sm">
      {/* Brand Logo */}
      <div className="mb-10 px-2">
        <Link
          href="/"
          className="text-2xl font-black text-blue-600 tracking-tighter"
        >
          Care.IO
        </Link>
        <div className="mt-2 inline-block bg-blue-50 px-2 py-0.5 rounded-md">
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest italic">
            {role} mode
          </p>
        </div>
      </div>

      {/* Primary Navigation (Role Specific) */}
      <nav className="flex-1 space-y-1.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-3 mb-2">
          Main Menu
        </p>
        {menuItems[role]?.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center justify-between p-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section (Common for all roles) */}
      <div className="pt-6 border-t border-slate-100 space-y-1.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-3 mb-2">
          Account
        </p>

        {/* Profile Link - এটি এখন সবার জন্য নিচে থাকবে */}
        <Link href={`/dashboard/${role}/profile`}>
          <div
            className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${
              pathname.includes("/profile")
                ? "bg-slate-800 text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <User size={20} />
            <span className="text-sm">Profile Settings</span>
          </div>
        </Link>

        {/* Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 p-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all group"
        >
          <LogOut size={20} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}

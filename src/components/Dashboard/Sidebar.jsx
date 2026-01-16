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
  UserPlus,
  Settings,
} from "lucide-react";

const menuItems = {
  user: [
    {
      name: "My Bookings",
      path: "/dashboard/user", // এখন /dashboard যোগ করা বাধ্যতামূলক
      icon: <CalendarCheck size={20} />,
    },
    {
      name: "Payments",
      path: "/dashboard/user/payments",
      icon: <CreditCard size={20} />, // Lucide থেকে CreditCard ইমপোর্ট করে নিন
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
      name: "Service Settings", //
      path: "/dashboard/caretaker/services",
      icon: <Settings size={20} />,
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
      path: "/dashboard/admin", // সঠিক পাথ
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "All Bookings",
      path: "/dashboard/admin/bookings", // সঠিক পাথ
      icon: <CalendarCheck size={20} />,
    },
    {
      name: "Manage Users",
      path: "/dashboard/admin/users",
      icon: <Users size={20} />,
    },
    {
      name: "Manage Request",
      path: "/dashboard/admin/requests",
      icon: <UserPlus size={20} />,
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
    <div className="w-64 min-h-screen bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 p-6 flex flex-col shadow-sm transition-colors duration-300">
      {/* Brand Logo */}
      <div className="mb-10 px-2">
        <Link
          href="/"
          className="text-2xl font-black text-blue-600 tracking-tighter"
        >
          Care.IO
        </Link>
        <div className="mt-2 inline-block bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest italic">
            {role} mode
          </p>
        </div>
      </div>

      {/* Primary Navigation */}
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
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600"
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

      {/* Bottom Section */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-3 mb-2">
          Account
        </p>

        {/* প্রোফাইল লিঙ্ক ঠিক করা হয়েছে */}
        <Link href={`/dashboard/${role}/profile`}>
          <div
            className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${
              pathname.includes("/profile")
                ? "bg-slate-800 dark:bg-slate-600 text-white"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <User size={20} />
            <span className="text-sm">Profile Settings</span>
          </div>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 p-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all group"
        >
          <LogOut size={20} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}

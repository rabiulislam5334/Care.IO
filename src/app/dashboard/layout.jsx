import Sidebar from "@/components/Dashboard/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // পাথটি আপনার প্রোজেক্ট অনুযায়ী চেক করুন
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  // যদি লগইন না থাকে তবে লগইন পেজে পাঠিয়ে দিবে
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      {/* Sidebar - ডানে বা বামে ফিক্সড থাকবে */}
      <aside className="sticky top-0 h-screen hidden md:block">
        <Sidebar role={session?.user?.role} /> {/* রোল পাস করা ভালো */}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8">
        <header className="flex justify-between items-center mb-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
              Hello, {session?.user?.name}!
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Role:{" "}
              <span className="capitalize text-blue-600 font-bold">
                {session?.user?.role}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/"
              className="p-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              title="Back to Home"
            >
              <Home size={20} />
            </Link>

            <ThemeToggle />

            {/* প্রোফাইল ইমেজ */}
            <div className="relative group">
              <img
                src={
                  session?.user?.image ||
                  `https://ui-avatars.com/api/?name=${session?.user?.name}&background=random`
                }
                alt="Profile"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-500 p-0.5 shadow-md cursor-pointer"
              />
            </div>
          </div>
        </header>

        {/* Page Content - এখানে আপনার UserDashboard বা EarningPage রেন্ডার হবে */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}

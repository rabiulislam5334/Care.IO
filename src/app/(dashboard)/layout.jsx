import Sidebar from "@/components/Dashboard/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, Moon, Sun } from "lucide-react"; // আইকনগুলো ইমপোর্ট করুন

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen hidden md:block">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Hello, {session?.user?.name}!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome to your dashboard.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* ১. হোম বাটন (Home Page-এ ফেরার জন্য) */}
            <Link
              href="/"
              className="p-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              title="Back to Home"
            >
              <Home size={20} />
            </Link>

            {/* ২. ডার্ক মোড বাটন (এটি আপাতত ডিজাইন হিসেবে থাকবে) */}
            <button
              className="p-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-yellow-500 hover:text-white transition-all shadow-sm"
              title="Toggle Theme"
            >
              <Sun size={20} className="dark:hidden" />
              <Moon size={20} className="hidden dark:block" />
            </button>

            {/* প্রোফাইল ইমেজ */}
            <img
              src={
                session?.user?.image ||
                "https://ui-avatars.com/api/?name=" + session?.user?.name
              }
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5 shadow-md"
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="animate-in fade-in duration-700">{children}</div>
      </main>
    </div>
  );
}

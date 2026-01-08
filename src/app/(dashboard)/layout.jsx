import Sidebar from "@/components/Dashboard/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  // যদি লগইন না করা থাকে তবে লগইন পেজে পাঠান
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar - Fixed on the left */}
      <aside className="sticky top-0 h-screen hidden md:block">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Hello, {session?.user?.name}!
            </h2>
            <p className="text-sm text-slate-500">Welcome to your dashboard.</p>
          </div>
          <div className="flex items-center gap-4">
            <img
              src={
                session?.user?.image ||
                "https://ui-avatars.com/api/?name=" + session?.user?.name
              }
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5"
            />
          </div>
        </header>

        {/* Page Content with Animation */}
        <div className="animate-in fade-in duration-700">{children}</div>
      </main>
    </div>
  );
}

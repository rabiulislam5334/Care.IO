"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.ok) {
      toast.success("Welcome Back! Redirecting...");

      // সেশন থেকে রোল চেক করে সঠিক ড্যাশবোর্ডে পাঠানো
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role === "admin") router.push("/admin");
      else if (role === "caretaker") router.push("/caretaker");
      else router.push("/user");
    } else {
      toast.error("Invalid Email or Password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* এনিমেটেড কন্টেইনার */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/50"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-2xl font-black">C.</span>
          </motion.div>
          <h2 className="text-3xl font-black text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-2 font-medium">
            Login to manage your care services
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block uppercase tracking-wider">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="name@company.com"
              required
              className="w-full p-4 bg-white/50 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block uppercase tracking-wider">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full p-4 bg-white/50 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all mt-4"
          >
            Sign In
          </motion.button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-transparent px-4 text-slate-400 text-sm font-medium absolute">
              Or continue with
            </span>
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-3 w-full p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5"
              alt="G"
            />
            <span className="font-bold text-slate-700">Google Account</span>
          </motion.button>
        </div>

        <p className="text-center mt-8 text-slate-600 font-medium">
          New to Care.IO?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-bold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

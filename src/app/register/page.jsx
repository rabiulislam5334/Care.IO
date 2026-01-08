"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  nid: z.string().min(10, "NID must be 10+ digits"),
  contact: z.string().min(11, "Contact must be 11+ digits"),
  password: z
    .string()
    .min(6, "Min 6 chars")
    .regex(/[A-Z]/, "Need 1 Uppercase")
    .regex(/[a-z]/, "Need 1 Lowercase"),
  image: z.any().refine((files) => files?.length == 1, "Photo is required"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // ইমেজ প্রিভিউ হ্যান্ডলার
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      // ১. ImgBB-তে ইমেজ আপলোড
      const formData = new FormData();
      formData.append("image", data.image[0]);

      const imgRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const imgData = await imgRes.json();

      if (!imgData.success) throw new Error("Image upload failed");

      // ২. ডাটাবেজে ইউজার ডাটা পাঠানো
      const userData = {
        name: data.name,
        email: data.email,
        nid: data.nid,
        contact: data.contact,
        password: data.password,
        image: imgData.data.display_url,
        role: "user",
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        toast.success("Registration successful!");
        router.push("/login");
      } else {
        const err = await res.json();
        toast.error(err.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-2xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-slate-800">Care.IO</h2>
          <p className="text-slate-500">Create an account to hire experts</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ফটো আপলোড সেকশন (এখানেই ফটো ফিল্ড) */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative w-24 h-24 mb-2">
              <div className="w-full h-full rounded-full border-4 border-blue-100 overflow-hidden bg-slate-100">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-xs text-center p-2">
                    No Photo
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer text-white shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                  <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
                </svg>
                <input
                  {...register("image")}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    register("image").onChange(e); // hook form-কে জানানো
                    handleImageChange(e); // প্রিভিউ দেখানো
                  }}
                />
              </label>
            </div>
            {errors.image && (
              <p className="text-red-500 text-xs">{errors.image.message}</p>
            )}
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">
              Profile Picture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                {...register("name")}
                placeholder="Full Name"
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("email")}
                placeholder="Email Address"
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("nid")}
              placeholder="NID Number"
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              {...register("contact")}
              placeholder="Contact Number"
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <input
            {...register("password")}
            type="password"
            placeholder="Password (Min 6, 1 Upper, 1 Lower)"
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            {isSubmitting ? "Registering..." : "Create Account"}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-slate-600">
          Have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

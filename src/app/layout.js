import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AnimationProvider from "@/components/AnimationProvider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
// import LayoutWrapper from "@/components/LayoutWrapper"; // নতুন ইমপোর্ট

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Care.IO | Trusted Caregiving Services",
  description: "Reliable care services for children, elderly, and sick people.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        <AuthProvider>
          <ThemeProvider>
            {" "}
            {/* থিম প্রোভাইডার সবার উপরে থাকবে */}
            <AnimationProvider>
              <Toaster position="top-center" reverseOrder={false} />

              {/* লেআউট র‍্যাপার ড্যাশবোর্ডে নেভবার/ফুটার হাইড করবে */}
              <LayoutWrapper>{children}</LayoutWrapper>
            </AnimationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

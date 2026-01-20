import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // নতুন তৈরি করা ফাইল থেকে ইমপোর্ট

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

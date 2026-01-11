import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  // চেক করা হচ্ছে সে কেয়ারটেকার কি না
  if (!session || session.user.role !== "caretaker") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("CareIO");

  // ডাটাবেজ থেকে এই কেয়ারটেকারের টাস্কগুলো আনা (ধরি ইমেইল দিয়ে অ্যাসাইন করা হয়)
  const tasks = await db
    .collection("bookings")
    .find({ caretakerEmail: session.user.email })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(tasks);
}

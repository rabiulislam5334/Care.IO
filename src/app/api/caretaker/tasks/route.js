import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // পাথটি 'authOptions' না হয়ে শুধু 'auth' হতে পারে, চেক করে নিন
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // ১. লগইন চেক
    if (!session) {
      return NextResponse.json(
        { message: "Not Authenticated" },
        { status: 401 },
      );
    }

    // ২. রোল চেক
    if (session.user.role !== "caretaker") {
      return NextResponse.json(
        { message: "Unauthorized: Caretaker only" },
        { status: 403 },
      );
    }

    const client = await clientPromise;
    const db = client.db("CareIO");

    // ৩. ডাটাবেজ থেকে এই কেয়ারটেকারের টাস্কগুলো আনা
    const tasks = await db
      .collection("bookings")
      .find({ caretakerEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Task Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

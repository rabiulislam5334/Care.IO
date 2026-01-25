import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "caretaker") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("CareIO");

    // কেবল এই কেয়ারটেকারের জন্য আসা বুকিংগুলো খুজে বের করা
    const tasks = await db
      .collection("bookings")
      .find({ caretakerEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

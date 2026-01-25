import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // সঠিক পাথ
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("CareIO");

    const email = session.user.email;
    const role = session.user.role; // আপনার session এ role থাকা প্রয়োজন

    let query = {};

    // লজিক: কেয়ারটেকার হলে তার কাছে আসা বুকিং দেখাবে, ইউজার হলে তার করা বুকিং দেখাবে
    if (role === "caretaker") {
      query = { caretakerEmail: email };
    } else {
      query = { userEmail: email };
    }

    const bookings = await db
      .collection("bookings")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

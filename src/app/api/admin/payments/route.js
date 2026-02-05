import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("CareIO");

    // bookings কালেকশন থেকে যেখানে paymentStatus: "paid" আছে সেগুলো আনুন
    const paidPayments = await db
      .collection("bookings")
      .find({ paymentStatus: "paid" })
      .sort({ updatedAt: -1 }) // অথবা paidAt থাকলে সেটি দিন
      .toArray();

    return NextResponse.json(paidPayments);
  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

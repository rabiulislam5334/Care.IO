import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("CareIO");

    // সব পেমেন্ট ডাটা রিসেন্ট থেকে ওল্ড অনুযায়ী আনা (Sort by Date)
    const payments = await db
      .collection("payments")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

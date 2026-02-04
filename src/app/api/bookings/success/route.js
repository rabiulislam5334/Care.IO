import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  try {
    const { bookingId, transactionId } = await request.json();

    const client = await clientPromise;
    const db = client.db("CareIO");

    const result = await db.collection("bookings").updateOne(
      { _id: new ObjectId(bookingId) },
      { 
        $set: { 
          paymentStatus: "paid", // এটিই আপনার হিস্টোরি পেজ খুঁজে বেড়াচ্ছে
          transactionId: transactionId,
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
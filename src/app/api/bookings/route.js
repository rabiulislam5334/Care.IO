import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET Method: ইউজার তার নিজের আর অ্যাডমিন সবার ডাটা দেখতে পাবে
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("CareIO");

    let query = {};
    // যদি ইউজার অ্যাডমিন না হয়, তবে শুধুমাত্র তার ইমেইলের ডাটা ফিল্টার হবে
    if (session.user.role !== "admin") {
      query = { email: session.user.email };
    }

    const bookings = await db
      .collection("bookings")
      .find(query)
      .sort({ _id: -1 }) // নতুন বুকিং আগে দেখাবে
      .toArray();

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// PATCH Method: অ্যাডমিন বুকিং Approve/Reject করতে পারবে
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    // নিরাপত্তা: শুধুমাত্র অ্যাডমিন আপডেট করতে পারবে
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id, status } = await request.json();
    const client = await clientPromise;
    const db = client.db("CareIO");

    const result = await db
      .collection("bookings")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: status } });

    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "Status updated", success: true });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// booking/create/route.js
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // ১. সেশন চেক (লগইন না থাকলে 401)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    // ২. রিকোয়েস্ট বডি পার্স করা
    const body = await req.json();

    // ৩. প্রয়োজনীয় ফিল্ডগুলো চেক (validation)
    const requiredFields = [
      "serviceId",
      "caretakerEmail",
      "userName",
      "userEmail",
      "startDate",
      "address"
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // ৪. serviceId ভ্যালিড ObjectId কিনা চেক
    if (!ObjectId.isValid(body.serviceId)) {
      return NextResponse.json(
        { error: "Invalid service ID format" },
        { status: 400 }
      );
    }

    // ৫. ডাটা প্রসেস করা (সেফটি + ক্লিনিং)
const newBooking = {
  serviceId: new ObjectId(body.serviceId),
  caretakerEmail: body.caretakerEmail.trim().toLowerCase(),
  userName: body.userName,
  userEmail: body.userEmail.trim().toLowerCase(),
  startDate: body.startDate,
  address: body.address,
  note: body.note || "",
  price: Number(body.price) || 0, // 'price' কি-টি নিশ্চিত করুন
  status: "pending",
  createdAt: new Date(),
};

    const client = await clientPromise;
    const db = client.db("CareIO");

    // ৬. ডাটাবেজে সেভ করা
    const result = await db.collection("bookings").insertOne(newBooking);

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        bookingId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking creation error:", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: "Failed to create booking",
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
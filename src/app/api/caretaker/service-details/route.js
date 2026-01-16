import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// ১. ডাটাবেস থেকে ডাটা নিয়ে আসার জন্য (GET)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("CareIO");

    // লগইন করা ইউজারের ইমেইল দিয়ে সার্ভিস খুঁজে বের করা
    const serviceDetails = await db.collection("services").findOne({
      email: session.user.email,
    });

    return NextResponse.json(serviceDetails || {});
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ২. ডাটাবেসে ডাটা সেভ বা আপডেট করার জন্য (POST)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db("CareIO");

    // ইউজারের ইমেইল ডাটার সাথে যুক্ত করা হচ্ছে যাতে পরে খুঁজে পাওয়া যায়
    const finalData = {
      ...data,
      email: session.user.email, // এটিই ইউজারকে ডাটার সাথে কানেক্ট করবে
      updatedAt: new Date(),
    };

    // 'services' কালেকশনে ডাটা আপডেট হবে। যদি না থাকে তবে নতুন তৈরি হবে (upsert)
    const result = await db
      .collection("services")
      .updateOne(
        { email: session.user.email },
        { $set: finalData },
        { upsert: true }
      );

    return NextResponse.json({
      success: true,
      message: "Data saved in 'services' collection!",
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Failed to save data" },
      { status: 500 }
    );
  }
}

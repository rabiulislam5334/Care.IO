import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // আপনার পাথ অনুযায়ী পরিবর্তন করুন
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// ১. GET API: ইউজারের সেভ করা ডাটা দেখানোর জন্য
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("CareIO");

    const serviceDetails = await db.collection("services").findOne({
      email: session.user.email,
    });

    return NextResponse.json(serviceDetails || {});
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ২. POST API: ডাটা সেভ বা আপডেট করার জন্য
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // চেক করুন ইউজার লগইন করা কি না
    if (!session) {
      return NextResponse.json({ message: "লগইন করা নেই!" }, { status: 401 });
    }

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db("CareIO");

    // ইউজারের ইমেইল এবং রোল ডাটার সাথে যুক্ত করুন
    const finalData = {
      ...data,
      email: session.user.email,
      caretakerName: session.user.name,
      updatedAt: new Date(),
    };

    // 'services' কালেকশনে ইমেইল অনুযায়ী ডাটা আপডেট করুন, না থাকলে নতুন তৈরি হবে (upsert)
    const result = await db
      .collection("services")
      .updateOne(
        { email: session.user.email },
        { $set: finalData },
        { upsert: true }
      );

    return NextResponse.json({
      success: true,
      message: "প্রোফাইল সফলভাবে ডাটাবেসে সেভ হয়েছে!",
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "সার্ভার এরর: ডাটা সেভ হয়নি" },
      { status: 500 }
    );
  }
}

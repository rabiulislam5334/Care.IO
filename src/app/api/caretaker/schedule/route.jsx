import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// --- GET METHOD: শিডিউল ডাটা রিড করা ---
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("CareIO");
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    const service = await db.collection("services").findOne({ email: email });

    return NextResponse.json({
      schedule: service?.schedule || [],
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}

// --- POST METHOD: শিডিউল সেভ বা আপডেট করা ---
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("CareIO");
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { schedule } = body;
    const email = session.user.email;

    const collection = db.collection("services");

    const result = await collection.updateOne(
      { email: email },
      {
        $set: {
          schedule: schedule,
          updatedAt: new Date(),
        },
      },
      { upsert: true }, // যদি ডাটা না থাকে তবে নতুন তৈরি করবে
    );

    return NextResponse.json({
      message: "Schedule saved successfully",
      success: true,
      modifiedCount: result.modifiedCount,
      upsertedId: result.upsertedId,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}

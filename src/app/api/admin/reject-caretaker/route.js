import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const { userId } = await req.json();
    const client = await clientPromise;
    const db = client.db("CareIO");

    // রিজেক্ট করলে শুধু পেন্ডিং স্ট্যাটাসটি ফলস করে দেওয়া হবে
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: { isPendingCaretaker: false },
        $unset: { caretakerDetails: "" }, // আগের দেওয়া ডিটেইলস মুছে ফেলা হবে
      }
    );

    return NextResponse.json({ message: "Application rejected." });
  } catch (error) {
    return NextResponse.json({ error: "Rejection failed" }, { status: 500 });
  }
}

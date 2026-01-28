import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    // চেক করা হচ্ছে ইউজার অ্যাডমিন কি না
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const { userId } = await req.json();
    const client = await clientPromise;
    const db = client.db("CareIO");

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          role: "caretaker",
          isPendingCaretaker: false,
        },
      }
    );

    return NextResponse.json({
      message: "Promoted to Caretaker successfully!",
    });
  } catch (error) {
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}

import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("CareIO");
    const { experience, bio, category } = await req.json();

    // ইউজারের ডাটা আপডেট করা
    await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          isPendingCaretaker: true,
          caretakerDetails: {
            experience,
            bio,
            category,
            appliedAt: new Date(),
          },
        },
      }
    );

    return NextResponse.json({ message: "Application submitted!" });
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

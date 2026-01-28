import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Not Authenticated" },
        { status: 401 }
      );
    }

    if (session.user.role !== "caretaker") {
      return NextResponse.json(
        { message: "Caretaker only" },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db("CareIO");

    const tasks = await db
      .collection("bookings")
      .find({ caretakerEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      tasks.map((t) => ({ ...t, _id: t._id.toString() }))
    );
  } catch (err) {
    console.error("Task Fetch Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

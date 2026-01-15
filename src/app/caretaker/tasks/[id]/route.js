import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { status } = await req.json(); // status can be 'accepted' or 'rejected'

    const client = await clientPromise;
    const db = client.db("CareIO");

    await db
      .collection("bookings")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: status } });

    return NextResponse.json({ message: "Task updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

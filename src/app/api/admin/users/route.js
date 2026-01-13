import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// ... আগের GET এবং DELETE কোডগুলো থাকবে ...

// রোল আপডেট করার জন্য PATCH মেথড
export async function PATCH(request) {
  try {
    const { id, role } = await request.json();
    const client = await clientPromise;
    const db = client.db("CareIO");

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { role: role } });

    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "Role updated successfully" });
    }
    return NextResponse.json({ error: "Failed to update" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

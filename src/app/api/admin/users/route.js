import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// ১. সব ইউজারদের ডাটা নিয়ে আসার জন্য GET মেথড
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("CareIO");

    const users = await db.collection("users").find({}).toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// ২. রোল আপডেট করার জন্য PATCH মেথড
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

// ৩. ইউজার ডিলিট করার জন্য DELETE মেথড
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const client = await clientPromise;
    const db = client.db("CareIO");

    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "User deleted" });
    }
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

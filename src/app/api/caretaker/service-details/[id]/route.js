import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ১. নির্দিষ্ট একটি সার্ভিস ডিলিট করা
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("careIO_DB"); // আপনার ডাটাবেসের সঠিক নাম দিন

    // এপিআই রাউটের প্যারামস থেকে আইডি নেওয়া
    const { id } = await params;

    const result = await db.collection("services").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 1) {
      return NextResponse.json(
        { message: "Service deleted successfully" },
        { status: 200 },
      );
    }
    return NextResponse.json({ message: "Service not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

// ২. নির্দিষ্ট সার্ভিস আপডেট করা
export async function PATCH(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("careIO_DB"); // আপনার ডাটাবেসের সঠিক নাম দিন

    const { id } = await params;
    const body = await request.json();

    // _id ফিল্ডটি আপডেট ডাটা থেকে সরিয়ে ফেলা যাতে কনফ্লিক্ট না হয়
    const { _id, ...updateData } = body;

    const result = await db
      .collection("services")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } },
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Service updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

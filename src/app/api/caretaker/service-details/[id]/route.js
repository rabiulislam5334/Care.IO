// api/caretaker/service-details/[id]/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, context) {
  try {
    const params = await context.params; // ← Required in Next.js 15!
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("CareIO");

    const service = await db.collection("services").findOne({
      _id: new ObjectId(id),
    });

    if (!service) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("CareIO");

    const result = await db.collection("services").insertOne({
      ...body,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

export async function PATCH(request, context) {
  try {
    const params = await context.params; // ← Required!
    const { id } = params;

    const body = await request.json();
    const { _id, ...updateData } = body;

    const client = await clientPromise;
    const db = client.db("CareIO");

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

    return NextResponse.json({
      success: true,
      message: "Updated successfully",
    });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params; // ← Required!
    const { id } = params;

    const client = await clientPromise;
    const db = client.db("CareIO");

    const result = await db.collection("services").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


// api/caretaker/service-details/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("CareIO");
    
    // .sort({ createdAt: -1 }) যোগ করা হয়েছে যাতে নতুনগুলো আগে আসে
    const services = await db
      .collection("services")
      .find({})
      .sort({ createdAt: -1 }) 
      .toArray();
      
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("CareIO");

    const result = await db.collection("services").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, id: result.insertedId.toString() },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 },
    );
  }
}

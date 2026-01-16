import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("CareIO");

    // সব সার্ভিস নিয়ে আসা
    const services = await db.collection("services").find({}).toArray();

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

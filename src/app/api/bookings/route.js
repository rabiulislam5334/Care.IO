import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

// ১. বুকিং সেভ করা (POST)
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const client = await clientPromise;
  const db = client.db("CareIO");

  const result = await db.collection("bookings").insertOne({
    ...data,
    userEmail: session.user.email, // ইউজারের ইমেইল যাতে পরে ফিল্টার করা যায়
    status: "Pending",
    createdAt: new Date(),
  });

  return NextResponse.json(result, { status: 201 });
}

// ২. ইউজারের সব বুকিং দেখা (GET)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("CareIO");

  const bookings = await db
    .collection("bookings")
    .find({ userEmail: session.user.email })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(bookings);
}

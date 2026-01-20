import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// ১. ডাটা রিড করার জন্য GET মেথড (একাধিক সার্ভিস পাওয়ার জন্য আপডেট করা)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("CareIO");

    // findOne এর বদলে find ব্যবহার করা হয়েছে যাতে সব সার্ভিস পাওয়া যায়
    const services = await db
      .collection("services")
      .find({ email: session.user.email })
      .toArray();

    // যদি কোনো সার্ভিস না থাকে তবে খালি অ্যারে [] রিটার্ন করবে
    return NextResponse.json(services || []);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ২. ডাটা সেভ/আপডেট করার জন্য POST মেথড (ক্যাটাগরি ভিত্তিক সেভ করার জন্য আপডেট করা)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Login required" }, { status: 401 });

    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("CareIO");

    const { _id, ...dataWithoutId } = body;

    // ফিল্টারে email এবং category দুটোই ব্যবহার করা হয়েছে
    // এর ফলে একই ইমেইল দিয়ে ভিন্ন ভিন্ন ক্যাটাগরির সার্ভিস সেভ করা যাবে
    await db.collection("services").updateOne(
      {
        email: session.user.email,
        category: dataWithoutId.category,
      },
      {
        $set: {
          ...dataWithoutId,
          email: session.user.email,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({
      success: true,
      message: `${dataWithoutId.category} Saved Successfully!`,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
// ৩. নির্দিষ্ট সার্ভিস ডিলিট করার জন্য DELETE মেথড
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // URL থেকে সার্ভিস ক্যাটাগরি নেওয়া

    if (!category) {
      return NextResponse.json(
        { message: "Category is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("CareIO");

    const result = await db.collection("services").deleteOne({
      email: session.user.email,
      category: category,
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({
        success: true,
        message: "Service deleted successfully",
      });
    } else {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

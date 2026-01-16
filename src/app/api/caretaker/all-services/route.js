import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("CareIO");

    const allServices = await db
      .collection("services")
      .aggregate([
        {
          $lookup: {
            from: "users", // users কালেকশন থেকে ডাটা আনবে
            localField: "email", // services এ থাকা ইমেইল
            foreignField: "email", // users এ থাকা ইমেইল
            as: "userInfo", // userInfo নামে একটি অ্যারে তৈরি করবে
          },
        },
        {
          $unwind: "$userInfo", // অ্যারে থেকে অবজেক্টে রূপান্তর করবে
        },
        {
          $project: {
            // কোন কোন ডাটা ফ্রন্টএন্ডে পাঠাবো
            _id: 1,
            category: 1,
            monthlyRate: 1,
            image: 1,
            region: 1,
            district: 1,
            userName: "$userInfo.name", // ইউজারের নাম userInfo থেকে সরাসরি userName হিসেবে আসবে
            userEmail: "$userInfo.email",
          },
        },
      ])
      .toArray();

    return NextResponse.json(allServices);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

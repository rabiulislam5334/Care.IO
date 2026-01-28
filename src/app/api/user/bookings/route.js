import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // সঠিক পাথ
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("CareIO");

    const email = session.user.email;
    // এখানে আপনার ডাটাবেস অনুযায়ী চেক করুন ইউজার কেয়ারটেকার কি না
    // যদি সেশনে রোল না থাকে তবে ইমেইল দিয়ে উভয় কলামে সার্চ করুন
    const bookings = await db.collection("bookings")
      .find({
        $or: [{ caretakerEmail: email }, { userEmail: email }]
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

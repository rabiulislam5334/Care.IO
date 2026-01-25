import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // পাসওয়ার্ড এনক্রিপ্ট করার জন্য

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, password } = await request.json();
    const client = await clientPromise;
    const db = client.db("CareIO");

    let updateData = { name };

    // যদি পাসওয়ার্ড চেঞ্জ করতে চায়
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await db
      .collection("users")
      .updateOne({ email: session.user.email }, { $set: updateData });

    return NextResponse.json({ message: "Profile updated!" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

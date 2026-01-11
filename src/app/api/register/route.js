// import clientPromise from "@/lib/mongodb";
import clientPromise from "@/lib/mongodb";
// import bcrypt from "bcrypt";
const bcrypt = require("bcryptjs");
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, nid, contact, password } = await req.json();
    const client = await clientPromise;
    const db = client.db("CareIO");

    const exists = await db.collection("users").findOne({ email });
    if (exists)
      return NextResponse.json({ message: "User exists" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({
      name,
      email,
      nid,
      contact,
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

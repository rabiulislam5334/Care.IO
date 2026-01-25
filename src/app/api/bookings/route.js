import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const allowedStatus = ["pending", "accepted", "rejected", "completed"];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("CareIO");

    let query = {};
    const role = session.user.role;
    const email = session.user.email;

    if (role === "admin") {
      query = {};
    } else if (role === "caretaker") {
      query = { caretakerEmail: email };
    } else {
      query = { userEmail: email };
    }

    const bookings = await db
      .collection("bookings")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      bookings.map((b) => ({ ...b, _id: b._id.toString() }))
    );
  } catch (error) {
    console.error("GET Booking Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const requiredFields = [
      "serviceId",
      "caretakerEmail",
      "userName",
      "userEmail",
      "startDate",
      "address",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!ObjectId.isValid(body.serviceId)) {
      return NextResponse.json(
        { error: "Invalid service ID format" },
        { status: 400 }
      );
    }

    const newBooking = {
      serviceId: new ObjectId(body.serviceId),
      caretakerEmail: body.caretakerEmail.trim().toLowerCase(),
      userName: body.userName.trim(),
      userEmail: body.userEmail.trim().toLowerCase(),
      startDate: body.startDate.trim(),
      address: body.address.trim(),
      note: body.note?.trim() || "",
      amount: Number(body.amount) || 0,
      status: "pending",
      createdBy: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db("CareIO");

    const result = await db.collection("bookings").insertOne(newBooking);

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        bookingId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Booking Error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, status } = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("CareIO");

    const booking = await db
      .collection("bookings")
      .findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (
      session.user.role !== "admin" &&
      session.user.email !== booking.caretakerEmail
    ) {
      return NextResponse.json(
        { message: "You cannot update this booking" },
        { status: 403 }
      );
    }

    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: "Status updated", success: true });
  } catch (error) {
    console.error("PATCH Booking Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

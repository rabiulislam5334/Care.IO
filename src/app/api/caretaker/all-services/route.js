// app/api/caretaker/all-services/route.js
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
            from: "users",
            localField: "email",
            foreignField: "email",
            as: "userInfo",
          },
        },
        {
          $unwind: {
            path: "$userInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { createdAt: -1 }, // newest first
        },
        {
          $project: {
            _id: 1,
            category: 1,
            hourlyRate: 1,
            monthlyRate: 1,
            image: 1,
            region: 1,
            district: 1,
            city: 1,
            availability: 1,
            shift: 1,
            gender: 1,
            experience: 1,
            nidNumber: 1,
            emergencyContact: 1,
            coveredAreas: 1,
            schedule: 1,

            // Name - trying multiple common field names + strong fallback
            userName: {
              $ifNull: [
                "$userInfo.name",
                "$userInfo.fullName",
                "$userInfo.username",
                "$userInfo.displayName",
                "Care Provider",
              ],
            },

            // For debugging - helps you see what email is being used
            serviceEmail: "$email",
            userEmail: "$userInfo.email",

            createdAt: 1,
            updatedAt: 1,
          },
        },
      ])
      .toArray();

    // Optional: log count for monitoring
    console.log(`All-services API returned ${allServices.length} items`);

    return NextResponse.json(allServices);
  } catch (error) {
    console.error("All-services aggregation error:", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: "Failed to fetch services",
        message: error.message,
      },
      { status: 500 },
    );
  }
}

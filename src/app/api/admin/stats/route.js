// admin/stats/route.js
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("CareIO");

    // ১. সাধারণ স্ট্যাটাস কাউন্ট (বুকিংস কালেকশন থেকে পেইড ডাটা নেওয়া)
    const [userCount, bookingCount, paidBookings] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("bookings").countDocuments(),
      db.collection("bookings").find({ paymentStatus: "paid" }).toArray(), // কালেকশন নাম নিশ্চিত করুন
    ]);

    // ২. মোট রেভিনিউ ক্যালকুলেট করা (price বা totalPrice ফিল্ড চেক করুন)
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (parseFloat(b.price || b.totalPrice) || 0), 0);

    // ৩. চার্টের জন্য মান্থলি ডাটা (Bookings কালেকশন থেকে)
    const chartData = await db.collection("bookings").aggregate([
      {
        $match: { paymentStatus: "paid" } // শুধুমাত্র পেইড বুকিংগুলো নিবে
      },
      {
        $group: {
          // updatedAt অথবা paidAt ফিল্ড ব্যবহার করুন যা আপনার ডাটাবেসে আছে
          _id: { $month: { $toDate: "$updatedAt" } }, 
          total: { $sum: { $toDouble: { $ifNull: ["$price", "$totalPrice"] } } }
        }
      },
      { $sort: { "_id": 1 } }
    ]).toArray();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedChartData = chartData.map(item => ({
      name: monthNames[item._id - 1] || "Unknown",
      total: item.total
    }));

    return NextResponse.json({
      userCount,
      bookingCount,
      totalRevenue,
      chartData: formattedChartData,
      success: true
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
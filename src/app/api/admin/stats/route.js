// admin/stats/route.js
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("CareIO");

    // ১. সাধারণ স্ট্যাটাস কাউন্ট
    const [userCount, bookingCount, payments] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("bookings").countDocuments(),
      db.collection("payments").find({}).toArray(),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    // ২. চার্টের জন্য রিয়েল মান্থলি ডাটা (Aggregation)
    const chartData = await db.collection("payments").aggregate([
      {
        $group: {
          _id: { $month: { $toDate: "$date" } }, // তারিখ থেকে মাস আলাদা করা
          total: { $sum: { $toDouble: "$amount" } } // ঐ মাসের মোট টাকার যোগফল
        }
      },
      { $sort: { "_id": 1 } } // মাস অনুযায়ী সিরিয়াল করা (জানুয়ারি থেকে ডিসেম্বর)
    ]).toArray();

    // মাসের নাম কনভার্ট করা (১ কে 'Jan' এ রূপান্তর)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedChartData = chartData.map(item => ({
      name: monthNames[item._id - 1],
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
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
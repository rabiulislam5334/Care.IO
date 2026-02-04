// app/checkout/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Stripe instance ইনিশিয়েলাইজ করা
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { bookingId, amount, serviceName } = await req.json();

    // NEXTAUTH_URL ব্যবহার করা হচ্ছে যা আপনার .env ফাইলে http://localhost:3000 হিসেবে আছে
    // এটি 'Invalid URL' এরর সমাধান করবে কারণ এতে http:// অন্তর্ভুক্ত আছে
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // ১. পেমেন্ট সেশন তৈরি করা
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: serviceName || "Care Service",
              description: `Booking ID: ${bookingId}`,
            },
            unit_amount: Math.round(amount * 100), // সেন্টে রূপান্তর (BDT এর জন্য পয়সা)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // ২. পেমেন্ট সফল বা ব্যর্থ হলে রিটার্ন ইউআরএল
      success_url: `${baseUrl}/dashboard/user/payments?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${baseUrl}/dashboard/user/my-bookings`,
      // ৩. ডাটাবেস আপডেটের জন্য মেটাডাটা
      metadata: {
        bookingId: bookingId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Error Details:", err.message);
    return NextResponse.json(
      { error: "Stripe Error", message: err.message },
      { status: 500 }
    );
  }
}
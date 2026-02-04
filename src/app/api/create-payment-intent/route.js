// app/create-intent/route.js
import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // সেন্টে রূপান্তর (BDT/USD যাই হোক)
      currency: "usd",
      payment_method_types: ["card"],
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

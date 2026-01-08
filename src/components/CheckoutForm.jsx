"use client";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CheckoutForm({ amount, bookingId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { clientSecret } = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }).then((res) => res.json());

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card: elements.getElement(CardElement) },
      }
    );

    if (error) {
      toast.error(error.message);
    } else if (paymentIntent.status === "succeeded") {
      toast.success("Payment Successful!");
      onSuccess(paymentIntent.id); // ডাটাবেজে আপডেট করার জন্য কলব্যাক
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-2xl bg-slate-50">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <button
        disabled={loading || !stripe}
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay ${amount} BDT`}
      </button>
    </form>
  );
}

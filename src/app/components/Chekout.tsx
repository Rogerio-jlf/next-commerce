'use client';
import { useCartStore } from "@/store";
import { useEffect } from "react";

export default function Checkout() {
  const cartStore = useCartStore();

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartStore.cart,
        payment_intent: cartStore.paymentIntent,
      }),
    });
  }, [cartStore.cart, cartStore.paymentIntent]);

  return (
    <div>
      <h1>Checkout</h1>
    </div>
  );
}

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// TODO: Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

function CheckoutForm({ cart, total }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    // Here you would typically send the payment method to your server
    // For demo purposes, we'll just simulate a successful payment
    setTimeout(() => {
      alert('Payment successful!');
      setProcessing(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={!stripe || processing}>
        {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
}

function Checkout({ cart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        {cart.map(item => (
          <div key={item.id}>
            <p>{item.name} x {item.quantity} - ${item.price * item.quantity}</p>
          </div>
        ))}
        <h3>Total: ${total.toFixed(2)}</h3>
      </div>
      <Elements stripe={stripePromise}>
        <CheckoutForm cart={cart} total={total} />
      </Elements>
    </div>
  );
}

export default Checkout;

'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export default function CheckoutPage() {
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(window as any).Razorpay) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy', 
      amount: "1286200", // Amount is in currency subunits (paise) = ₹12,862 * 100
      currency: "INR",
      name: "Iris",
      description: "Fashion Order Checkout",
      image: "https://iris.brand/logo.png",
      order_id: "", // In a real app, pass the order_id from the backend createRazorpayOrder API
      handler: function (response: any) {
        // Payment successful - Normally you'd send this to your /api/orders/:id/pay endpoint
        console.log("Payment Successful", response);
        setIsSuccess(true);
      },
      prefill: {
        name: "Test User",
        email: "test@chickenkari.com",
        contact: "9999999999"
      },
      theme: {
        color: "#000000"
      }
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.on('payment.failed', function (response: any){
      alert("Payment Failed: " + response.error.description);
    });
    rzp1.open();
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <CheckCircle2 size={64} className="text-green-500 mb-6" />
        <h1 className="text-4xl font-serif text-gray-900 mb-4">Order Confirmed</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
          Thank you for your purchase. We have received your order and will begin processing it shortly.
        </p>
        <Link href="/products" className="inline-block border border-gray-900 px-8 py-3 text-sm uppercase tracking-widest hover:bg-gray-900 hover:text-white transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Checkout Forms */}
        <div className="flex-grow">
          <h1 className="text-3xl font-serif text-gray-900 mb-10">Checkout</h1>
          
          <div className="flex space-x-8 border-b border-gray-200 mb-8 pb-4">
            <div className={`text-sm uppercase tracking-widest font-semibold ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
              1. Shipping Address
            </div>
            <div className={`text-sm uppercase tracking-widest font-semibold ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
              2. Payment
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                  <input required type="text" className="w-full border border-gray-300 px-4 py-3 focus:border-gray-900 outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                  <input required type="text" className="w-full border border-gray-300 px-4 py-3 focus:border-gray-900 outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Address</label>
                <input required type="text" className="w-full border border-gray-300 px-4 py-3 focus:border-gray-900 outline-none transition" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">City</label>
                  <input required type="text" className="w-full border border-gray-300 px-4 py-3 focus:border-gray-900 outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">State</label>
                  <input required type="text" className="w-full border border-gray-300 px-4 py-3 focus:border-gray-900 outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Pincode</label>
                  <input required type="text" className="w-full border border-gray-300 px-4 py-3 focus:border-gray-900 outline-none transition" />
                </div>
              </div>
              <button type="submit" className="mt-8 bg-gray-900 text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-gray-800 transition">
                Continue to Payment
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePayment} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border border-gray-300 p-6 flex items-center justify-between cursor-pointer hover:border-gray-900 transition">
                <div className="flex items-center">
                  <input type="radio" defaultChecked name="payment" id="card" className="mr-4 accent-gray-900 w-4 h-4" />
                  <label htmlFor="card" className="font-medium text-gray-900">Credit / Debit Card</label>
                </div>
              </div>
              <div className="border border-gray-300 p-6 flex items-center justify-between cursor-pointer hover:border-gray-900 transition">
                <div className="flex items-center">
                  <input type="radio" name="payment" id="upi" className="mr-4 accent-gray-900 w-4 h-4" />
                  <label htmlFor="upi" className="font-medium text-gray-900">UPI / NetBanking</label>
                </div>
              </div>

              {/* Mock Card Input */}
              <div className="space-y-4 bg-gray-50 p-6 border border-gray-100">
                <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900 mb-4">Card Details</h3>
                <input type="text" placeholder="Card Number" className="w-full border border-gray-300 px-4 py-3 focus:border-gray-900 outline-none transition" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" className="w-full border border-gray-300 px-4 py-3 focus:border-gray-900 outline-none transition" />
                  <input type="text" placeholder="CVV" className="w-full border border-gray-300 px-4 py-3 focus:border-gray-900 outline-none transition" />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="border border-gray-300 text-gray-900 px-8 py-4 text-sm tracking-widest uppercase hover:bg-gray-50 transition">
                  Back
                </button>
                <button type="submit" className="flex-grow bg-gray-900 text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-gray-800 transition">
                  Pay ₹12,862
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Concise Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-gray-50 p-8 border border-gray-100 sticky top-28">
            <h2 className="text-xl font-serif text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Hand-embroidered Linen Dress x1</span>
                <span className="font-medium text-gray-900">₹4,500</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Minimalist Cotton Co-ord x2</span>
                <span className="font-medium text-gray-900">₹6,400</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6 space-y-4 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹10,900</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (18%)</span>
                <span>₹1,962</span>
              </div>
            </div>
            
            <div className="flex justify-between text-lg font-semibold text-gray-900 pt-6 border-t border-gray-200">
              <span>Total</span>
              <span>₹12,862</span>
            </div>
          </div>
        </div>

      </div>
      </div>
    </>
  );
}

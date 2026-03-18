'use client';

import Link from 'next/link';
import { Minus, Plus, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

const MOCK_CART_ITEMS = [
  { _id: '1', product: { _id: '1', name: 'Hand-embroidered Linen Dress', price: 4500, image: 'https://images.unsplash.com/photo-1515347619362-e674149faabc?q=80&w=800&auto=format&fit=crop' }, size: 'M', qty: 1 },
  { _id: '2', product: { _id: '2', name: 'Minimalist Cotton Co-ord', price: 3200, image: 'https://images.unsplash.com/photo-1434389673966-2673a38ce30e?q=80&w=800&auto=format&fit=crop' }, size: 'S', qty: 2 },
];

export default function CartPage() {
  // Replace with useCartStore when integrating fully
  const cartItems = MOCK_CART_ITEMS; 

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const tax = subtotal * 0.18; // 18% GST mock
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + tax + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <h1 className="text-3xl md:text-5xl font-serif text-gray-900 mb-12">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-500 mb-6">Your cart is currently empty.</p>
          <Link href="/products" className="inline-block bg-primary text-primary-foreground px-8 py-4 text-sm tracking-widest uppercase hover:bg-gray-800 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Cart Items */}
          <div className="flex-grow">
            <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between uppercase tracking-widest text-xs font-semibold text-gray-500 hidden sm:flex">
              <div className="w-1/2">Product</div>
              <div className="w-1/6 text-center">Quantity</div>
              <div className="w-1/6 text-right">Total</div>
            </div>

            <div className="space-y-8">
              {cartItems.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-8 gap-4">
                  <div className="flex items-center gap-6 w-full sm:w-1/2">
                    <div className="w-24 h-32 bg-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <Link href={`/product/${item.product._id}`} className="text-sm font-medium hover:underline text-gray-900 mb-1">
                        {item.product.name}
                      </Link>
                      <span className="text-xs text-gray-500 mb-2">Size: {item.size}</span>
                      <span className="text-sm text-gray-900 font-semibold mb-3">₹{item.product.price.toLocaleString('en-IN')}</span>
                      <button className="text-xs text-gray-500 flex items-center hover:text-red-500 transition self-start">
                        <X size={14} className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center w-full sm:w-1/6 justify-between sm:justify-center">
                    <span className="sm:hidden text-xs uppercase text-gray-500">Qty:</span>
                    <div className="flex items-center border border-gray-300 w-24">
                      <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition"><Minus size={14} /></button>
                      <span className="flex-grow text-center text-sm">{item.qty}</span>
                      <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition"><Plus size={14} /></button>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/6 text-right font-semibold text-gray-900 flex justify-between sm:block">
                     <span className="sm:hidden text-xs uppercase text-gray-500 font-normal">Total:</span>
                    ₹{(item.product.price * item.qty).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-gray-50 p-8 border border-gray-100 sticky top-28">
              <h2 className="text-xl font-serif text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-gray-600 mb-6 border-b border-gray-200 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-lg font-semibold text-gray-900 mb-8">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <Link href="/checkout" className="block w-full text-center bg-primary text-primary-foreground py-4 text-sm tracking-widest uppercase hover:bg-gray-800 transition">
                Proceed to Checkout
              </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

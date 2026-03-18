'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye } from 'lucide-react';

const DUMMY_PRODUCTS = [
  { id: 1, name: 'Hand-embroidered Linen Dress', price: 4500, image: '/products/prod4.jpg', isNew: true },
  { id: 2, name: 'Minimalist Cotton Co-ord', price: 3200, image: '/products/prod5.jpg', isNew: false },
  { id: 3, name: 'Elegant Chikankari Top', price: 2800, image: '/products/prod6.jpg', isNew: true },
  { id: 4, name: 'Pleated Evening Gown', price: 8200, image: '/products/prod7.jpg', isNew: false },
];

export default function TrendingProducts() {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl text-gray-900 tracking-tight font-serif mb-4">Trending Now</h2>
          <p className="text-gray-500 font-light max-w-xl mx-auto">Discover the pieces everyone is adding to their wardrobes. Modern cuts meeting classic elegance.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {DUMMY_PRODUCTS.map((product) => (
            <motion.div 
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              whileHover={{ y: -5 }}
              className="group flex flex-col"
            >
              <div className="relative aspect-[3/4] bg-gray-200 overflow-hidden mb-4">
                {product.isNew && (
                  <span className="absolute top-4 border border-black left-4 bg-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest z-10">
                    New
                  </span>
                )}
                <Link href={`/product/${product.id}`} className="block w-full h-full">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </Link>
                
                {/* Hover Actions */}
                <div className="absolute inset-x-0 bottom-0 bg-white/90 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center py-4 space-x-6 backdrop-blur-sm">
                  <button aria-label="Quick View" className="text-gray-900 hover:text-gray-500 transition-colors">
                    <Eye size={20} strokeWidth={1.5} />
                  </button>
                  <button aria-label="Add to Cart" className="text-gray-900 hover:text-gray-500 transition-colors">
                    <ShoppingCart size={20} strokeWidth={1.5} />
                  </button>
                  <button aria-label="Add to Wishlist" className="text-gray-900 hover:text-gray-500 transition-colors">
                    <Heart size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col flex-grow items-center text-center">
                <Link href={`/product/${product.id}`} className="text-sm font-medium text-gray-900 hover:underline mb-2 line-clamp-1">
                  {product.name}
                </Link>
                <div className="mt-auto">
                  <span className="text-sm text-gray-700 font-semibold tracking-wide">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <Link href="/products?trending=true" className="inline-block border border-gray-900 text-gray-900 px-8 py-3 text-xs tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-all duration-300">
            View Trending Collection
          </Link>
        </div>
      </div>
    </section>
  );
}

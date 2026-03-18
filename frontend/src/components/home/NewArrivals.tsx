'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const ARRIVALS = [
  { id: 10, name: 'Zari Border Kurta', price: 4200, image: '/products/prod7.jpg' },
  { id: 11, name: 'Indigo Dye Tunic', price: 2800, image: '/products/prod5.jpg' },
  { id: 12, name: 'Cotton Silk Blend Set', price: 5400, image: '/products/prod6.jpg' },
];

export default function NewArrivals() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl text-gray-900 tracking-tight font-serif mb-2">New Drops</h2>
            <p className="text-gray-500 font-light">Freshly crafted items straight from our artisans.</p>
          </div>
          <Link href="/products?sort=newest" className="text-sm font-medium tracking-widest uppercase hover:text-gray-500 transition border-b border-black pb-1 self-start md:self-auto">
            Shop All New
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARRIVALS.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: index * 0.15, 
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-6 relative">
                <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" />
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>
              <div className="flex justify-between items-center">
                <Link href={`/product/${product.id}`} className="text-lg font-medium text-gray-900 hover:underline">
                  {product.name}
                </Link>
                <span className="text-gray-700 tracking-wide font-medium">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useProducts } from '@/lib/useProducts';

export default function DarkFeatured() {
  const allProducts = useProducts();
  const FEATURED = allProducts.slice(0, 4);

  return (
    <section className="bg-[#111] py-28 px-4 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white">Trending Now</h2>
          <Link href="/products?trending=true" className="text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-[#1a1a1a]">
                {p.tag && (
                  <span className="absolute top-3 left-3 z-10 text-[10px] tracking-widest uppercase bg-white text-black px-2 py-1">
                    {p.tag}
                  </span>
                )}
                <Link href={`/product/${p._id}`}>
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </Link>
                <button className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white transition-colors">
                  <Heart size={14} strokeWidth={1.5} />
                </button>
              </div>
              <Link href={`/product/${p._id}`} className="block text-sm text-white/90 hover:text-white transition-colors mb-1 line-clamp-1">
                {p.name}
              </Link>
              <span className="text-white/50 text-sm">₹{p.price.toLocaleString('en-IN')}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CATS = [
  { name: 'Dresses', href: '/products?category=Dresses', img: '/products/prod1.jpg' },
  { name: 'Co-ords', href: '/products?category=Co-ords', img: '/products/prod2.jpg' },
  { name: 'Tops', href: '/products?category=Tops', img: '/products/prod3.jpg' },
];

export default function DarkCategories() {
  return (
    <section className="bg-[#0f0f0f] py-28 px-4 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            Shop by<br />Category
          </h2>
          <Link href="/products" className="text-white/50 text-xs tracking-widest uppercase hover:text-white transition-colors border-b border-white/20 pb-1">
            View All
          </Link>
        </div>

        {/* Three equal columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATS.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
            >
              <Link href={cat.href} className="group relative block aspect-[2/3] overflow-hidden">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover brightness-75 group-hover:brightness-90 group-hover:scale-105 transition-all duration-700"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {/* Label */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <span className="text-white font-serif text-2xl">{cat.name}</span>
                  <span className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                    <ArrowUpRight size={14} className="text-white group-hover:text-black transition-colors" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

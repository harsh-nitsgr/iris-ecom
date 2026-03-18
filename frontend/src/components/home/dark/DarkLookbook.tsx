'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DarkLookbook() {
  return (
    <section className="bg-[#0a0a0a] py-28 px-4 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <div className="mb-16 text-center">
          <motion.p
            className="text-white/30 text-xs tracking-[0.5em] uppercase mb-4"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            SS 2025 Collection
          </motion.p>
          <motion.h2
            className="text-5xl md:text-7xl font-serif text-white"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            The Lookbook
          </motion.h2>
        </div>

        {/* Asymmetric bento grid */}
        <div className="grid grid-cols-12 grid-rows-2 gap-3 h-[80vh]">
          {/* Large left */}
          <motion.div
            className="col-span-5 row-span-2 relative overflow-hidden group"
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src="/products/prod8.jpg" alt="Look 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 brightness-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="text-white/60 text-xs tracking-widest uppercase block mb-2">Look 01</span>
              <span className="text-white font-serif text-xl">Embroidered Linen Dress</span>
            </div>
          </motion.div>

          {/* Top right */}
          <motion.div
            className="col-span-4 row-span-1 relative overflow-hidden group"
            initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <img src="/products/prod5.jpg" alt="Look 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 brightness-75" />
          </motion.div>

          {/* Top far right */}
          <motion.div
            className="col-span-3 row-span-1 relative overflow-hidden group"
            initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img src="/products/prod9.jpg" alt="Look 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 brightness-80" />
          </motion.div>

          {/* Bottom right */}
          <motion.div
            className="col-span-7 row-span-1 relative overflow-hidden group flex items-end"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <img src="/products/prod6.jpg" alt="Look 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 brightness-75" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Link href="/products" className="bg-white text-black px-10 py-4 text-xs tracking-widest uppercase hover:bg-white/90 transition-colors font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Shop the Look
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

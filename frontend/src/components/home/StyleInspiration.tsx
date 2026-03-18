'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
];

export default function StyleInspiration() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} className="py-32 bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24 relative z-30">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl text-white font-serif mb-6"
          >
            The Lookbook
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 font-light max-w-2xl mx-auto text-lg"
          >
            Editorial silhouettes that define the modern wardrobe.
          </motion.p>
        </div>

        <div className="relative h-[800px] w-full max-w-5xl mx-auto">
          {/* Main central image */}
          <motion.div 
            style={{ y: y1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] sm:w-[80%] md:w-[60%] aspect-[3/4] z-10"
          >
            <motion.div 
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="w-full h-full relative overflow-hidden"
            >
              <motion.img 
                src={IMAGES[0]} 
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-full object-cover" 
              />
            </motion.div>
          </motion.div>

          {/* Left background image */}
          <motion.div 
            style={{ y: y2 }}
            className="absolute left-0 top-1/4 w-[40%] md:w-[30%] aspect-[3/4] z-0 hidden sm:block"
          >
            <motion.div 
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
              className="w-full h-full relative overflow-hidden opacity-60"
            >
              <motion.img 
                src={IMAGES[1]} 
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-full object-cover grayscale" 
              />
            </motion.div>
          </motion.div>

          {/* Right foreground image */}
          <motion.div 
            style={{ y: y3 }}
            className="absolute right-0 bottom-1/4 w-[45%] md:w-[35%] aspect-square z-20 hidden sm:block"
          >
            <motion.div 
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="w-full h-full relative overflow-hidden shadow-2xl"
            >
              <motion.img 
                src={IMAGES[2]} 
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-full object-cover" 
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

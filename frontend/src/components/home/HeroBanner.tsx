'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

export default function HeroBanner() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 2.5]);
  const opacity = useTransform(scrollYProgress, [0.5, 1], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[150vh] w-full bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
      <motion.div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2692&auto=format&fit=crop")',
          scale,
          opacity
        }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      <motion.div 
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center"
      >
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-6xl md:text-8xl lg:text-[10rem] text-white font-serif mb-6 leading-none tracking-tight shadow-sm"
        >
          Iris
        </motion.h1>
        
        <div className="overflow-hidden">
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="text-lg md:text-2xl text-gray-200 mb-12 font-light tracking-wide max-w-2xl"
          >
            Western fashion meets Indian confidence
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link 
            href="#story" 
            className="inline-block bg-white text-black px-12 py-5 text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-500"
          >
            Explore Collection
          </Link>
        </motion.div>
      </motion.div>
      </div>
    </section>
  );
}

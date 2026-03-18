'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function StoryReveal() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section id="story" ref={sectionRef} className="py-32 bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          
          <div className="order-2 md:order-1 relative h-[600px] w-full">
            <motion.div 
              style={{ y: y1 }}
              className="absolute inset-0 right-12 bottom-12 z-10"
            >
              <img 
                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop" 
                alt="Designed for Indian women" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div 
              style={{ y: y2 }}
              className="absolute -top-12 -right-12 w-2/3 h-2/3 z-0 hidden md:block"
            >
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop" 
                alt="Texture" 
                className="w-full h-full object-cover opacity-60 grayscale"
              />
            </motion.div>
          </div>

          <div className="order-1 md:order-2 flex flex-col justify-center">
            <motion.span 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6 block"
            >
              Our Philosophy
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl text-gray-900 font-serif leading-tight mb-8"
            >
              Designed for <br/><span className="italic">Indian women</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="space-y-6 text-gray-600 font-light text-lg leading-relaxed max-w-lg"
            >
              <p>
                We believe that modern fashion shouldn't mean compromising on comfort or cultural identity. Our pieces blend contemporary western silhouettes with the confidence of Indian heritage.
              </p>
              <p>
                Every stitch, every cut is meticulously crafted to empower your daily journey, creating a wardrobe that is as versatile as you are.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

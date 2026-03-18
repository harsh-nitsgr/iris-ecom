'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import AntigravityCanvas from './AntigravityCanvas';

export default function DarkManifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section ref={ref} className="relative bg-[#0a0a0a] py-40 px-4 md:px-16 overflow-hidden">

      {/* ── Antigravity particle field ─────────────────────────────────── */}
      <AntigravityCanvas />

      {/* ── Faint watermark text ──────────────────────────────────────── */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]"
      >
        <span className="text-white/[0.025] font-serif text-[16vw] whitespace-nowrap leading-none">
          CHIKANKARI
        </span>
      </motion.div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.p
          className="text-white/30 text-xs tracking-[0.5em] uppercase mb-10"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        >
          Our Craft
        </motion.p>
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          Where ancient thread meets<br />
          <span className="italic text-white/60">modern silhouette.</span>
        </motion.h2>
        <motion.p
          className="text-white/40 font-light text-lg max-w-xl mx-auto mb-14 leading-relaxed"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Every stitch is a conversation between tradition and the present.
          Chikankari embroidery, born in the streets of Lucknow, now lives in
          western silhouettes built for the modern woman.
        </motion.p>
        <Link
          href="/products"
          className="inline-block border border-white/30 text-white/80 px-10 py-4 text-xs font-light tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
        >
          Discover the Collection
        </Link>
      </div>
    </section>
  );
}

'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/lib/useProducts';
import { ArrowRight } from 'lucide-react';

// ─── Cloth-stretch transition logic ──────────────────────────────────────────
// On scroll, the current slide's clip-path tears open from the top-right corner
// while the next slide is revealed underneath. Pure CSS + JS — no extra deps.
// ─────────────────────────────────────────────────────────────────────────────

export default function DarkFeatured() {
  const allProducts = useProducts();
  const FEATURED = allProducts.slice(0, 6);

  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0–1 within the current slide

  useEffect(() => {
    if (FEATURED.length === 0) return;

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      // Each slide occupies 100vh of scroll distance
      const slideHeight = window.innerHeight;
      const scrolled = window.scrollY - sectionTop;
      const totalSlides = FEATURED.length;

      if (scrolled < 0 || scrolled > slideHeight * totalSlides) return;

      const rawIndex = scrolled / slideHeight;
      const idx = Math.min(Math.floor(rawIndex), totalSlides - 1);
      const frac = rawIndex - Math.floor(rawIndex);

      setActiveIndex(idx);
      setProgress(frac);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [FEATURED.length]);

  if (FEATURED.length === 0) return null;

  // Total section height = one viewport per slide + one extra viewport for last slide to rest
  const totalHeight = `${(FEATURED.length + 1) * 100}vh`;

  const currentProduct = FEATURED[activeIndex];
  const nextProduct = FEATURED[Math.min(activeIndex + 1, FEATURED.length - 1)];

  // ── Clip-path: polygon that starts fully covering and tears from top-right ──
  // At progress=0: full rectangle (100% coverage)
  // At progress=1: collapsed to bottom-left corner (fully revealed next slide)
  const p = progress;

  // The "pull" originates at the top-right corner and sweeps diagonally left+down
  // giving the effect of fabric being grabbed and pulled away.
  const topRight = `100% 0%`;
  const topLeft  = `${Math.max(0, 100 - p * 150)}% 0%`;   // top-left sweeps right→0
  const botLeft  = `0% ${Math.min(100, p * 150)}%`;        // bottom-left sweeps down
  const botRight = `100% ${Math.min(100, p * 120)}%`;      // bottom-right sweeps down slower

  const clipPath = `polygon(${topLeft}, ${topRight}, ${botRight}, ${botLeft})`;

  // Subtle scale/skew on the current slide as it's "stretched"
  const stretchX = 1 + p * 0.04;
  const stretchY = 1 + p * 0.02;
  const skewDeg  = p * -3;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a]"
      style={{ height: totalHeight }}
    >
      {/* Sticky viewport — stays in place while the section scrolls behind it */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Next slide (underneath) ── */}
        {nextProduct && (
          <div className="absolute inset-0">
            <img
              src={nextProduct.images?.[0]}
              alt={nextProduct.name}
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
            {/* dark overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* ── Current slide (on top, cloth-stretching away) ── */}
        <div
          className="absolute inset-0 origin-top-right"
          style={{
            clipPath,
            transform: `scaleX(${stretchX}) scaleY(${stretchY}) skewY(${skewDeg}deg)`,
            willChange: 'clip-path, transform',
            transition: 'clip-path 0.02s linear, transform 0.02s linear',
          }}
        >
          <img
            src={currentProduct.images?.[0]}
            alt={currentProduct.name}
            className="w-full h-full object-cover object-top"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
        </div>

        {/* ── Section label top-left ── */}
        <div className="absolute top-8 left-8 z-20 flex items-center gap-4">
          <span className="text-white/30 text-[10px] tracking-[0.35em] uppercase">
            Trending Now
          </span>
          <span className="text-white/20 text-[10px] tracking-widest">
            {String(activeIndex + 1).padStart(2, '0')} / {String(FEATURED.length).padStart(2, '0')}
          </span>
        </div>

        {/* ── Product info bottom-left ── */}
        <div className="absolute bottom-16 left-8 md:left-16 z-20 max-w-md">
          <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-3">
            {currentProduct.brand?.name || 'Iris Edit'}
          </p>
          <h2
            key={currentProduct._id}
            className="text-4xl md:text-6xl font-serif text-white leading-tight mb-4"
            style={{ animation: 'fadeSlideUp 0.5s ease forwards' }}
          >
            {currentProduct.name}
          </h2>
          <p className="text-white/50 text-lg mb-6 font-light">
            ₹{currentProduct.price?.toLocaleString('en-IN')}
          </p>
          <Link
            href={`/product/${currentProduct._id}`}
            className="inline-flex items-center gap-3 text-white text-sm tracking-widest uppercase border-b border-white/30 pb-1 hover:border-white transition-colors"
          >
            Explore <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Slide dots right ── */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {FEATURED.map((_, i) => (
            <div
              key={i}
              className="w-0.5 rounded-full transition-all duration-500"
              style={{
                height: i === activeIndex ? '32px' : '12px',
                backgroundColor: i === activeIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        {/* ── Scroll hint ── */}
        {activeIndex === 0 && progress < 0.15 && (
          <div className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-2 opacity-60">
            <span className="text-white/40 text-[9px] tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-px h-8 bg-white/20 animate-pulse" />
          </div>
        )}
      </div>

      {/* Keyframe for product name entrance */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </section>
  );
}

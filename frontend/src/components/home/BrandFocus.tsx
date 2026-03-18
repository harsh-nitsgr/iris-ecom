'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const BRANDS = [
  { id: 1, name: 'Anavila', type: 'Handwoven Linen', logo: 'A' },
  { id: 2, name: 'Péro', type: 'Handmade Luxury', logo: 'P' },
  { id: 3, name: 'Eka', type: 'Textile Rich', logo: 'E' },
  { id: 4, name: 'Runaway', type: 'Street Couture', logo: 'R' },
  { id: 5, name: 'Bhaane', type: 'Contemporary', logo: 'B' },
];

export default function BrandFocus() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wrapper = scrollWrapperRef.current;
      if (!wrapper) return;

      const totalScroll = wrapper.scrollWidth - window.innerWidth;

      gsap.to(wrapper, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: `+=${totalScroll}`,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#FAF9F6] border-y border-gray-200 overflow-hidden h-screen flex flex-col justify-center relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10 w-full shrink-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 block">Our Heritage</span>
            <h2 className="text-3xl md:text-5xl text-gray-900 font-serif leading-tight">Celebrating Indian Artistry</h2>
          </div>
          <p className="text-gray-600 font-light max-w-sm">
            We partner with independent brands across India, bringing their unique, master-crafted garments to the modern wardrobe.
          </p>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <div ref={scrollWrapperRef} className="flex gap-8 px-8 lg:px-24 w-max">
          {[...BRANDS, ...BRANDS].map((brand, idx) => (
            <div key={`${brand.id}-${idx}`} className="flex flex-col items-center justify-center w-[300px] h-[300px] border border-gray-200 hover:border-gray-900 transition-colors bg-white">
              <div className="w-20 h-20 rounded-full bg-gray-900 text-white flex items-center justify-center text-3xl font-serif mb-6">
                {brand.logo}
              </div>
              <h3 className="text-xl font-medium tracking-wide mb-2">{brand.name}</h3>
              <p className="text-sm text-gray-500 uppercase tracking-widest">{brand.type}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

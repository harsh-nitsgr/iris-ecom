'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PRODUCTS = [
  { id: 1, name: 'Hand-embroidered Linen Dress', price: 4500, image: '/products/prod8.jpg' },
  { id: 2, name: 'Minimalist Cotton Co-ord', price: 3200, image: '/products/prod9.jpg' },
  { id: 3, name: 'Embroidered Silk Top', price: 5800, image: '/products/prod1.jpg' },
  { id: 4, name: 'Pleated Evening Gown', price: 8200, image: '/products/prod2.jpg' },
  { id: 5, name: 'Satin Silk Camisole', price: 2100, image: '/products/prod3.jpg' },
];

export default function HorizontalProductScroll() {
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
    <section ref={sectionRef} className="bg-white overflow-hidden h-screen flex flex-col justify-center relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10 w-full shrink-0">
        <h2 className="text-4xl md:text-5xl text-gray-900 font-serif leading-tight">Featured Pieces</h2>
        <p className="text-gray-500 mt-2 font-light text-lg">Scroll horizontally to explore our latest additions.</p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div ref={scrollWrapperRef} className="flex gap-12 px-8 lg:px-24 w-max">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="w-[300px] md:w-[400px] flex flex-col group">
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100">
                <Link href={`/product/${product.id}`} className="block w-full h-full">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </Link>
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur flex justify-center">
                  <Link href={`/product/${product.id}`} className="text-xs uppercase tracking-widest font-medium hover:text-gray-500">View Piece</Link>
                </div>
              </div>
              <Link href={`/product/${product.id}`} className="text-lg font-medium text-gray-900 hover:underline line-clamp-1">
                {product.name}
              </Link>
              <span className="text-gray-600 mt-1">₹{product.price.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

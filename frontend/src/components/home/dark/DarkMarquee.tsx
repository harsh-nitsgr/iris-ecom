'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const WORDS = ['Chikankari', '✦', 'Western', '✦', 'Handcrafted', '✦', 'Minimal', '✦', 'Heritage', '✦', 'Modern', '✦'];

export default function DarkMarquee() {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const totalWidth = el.scrollWidth / 2;
    gsap.to(el, {
      x: -totalWidth,
      duration: 20,
      ease: 'none',
      repeat: -1,
    });
  }, []);

  const repeated = [...WORDS, ...WORDS];

  return (
    <div className="bg-[#0a0a0a] border-y border-white/10 py-5 overflow-hidden">
      <div ref={innerRef} className="flex whitespace-nowrap w-max">
        {repeated.map((word, i) => (
          <span key={i} className="text-white/40 text-xs tracking-[0.4em] uppercase mx-8 font-light">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

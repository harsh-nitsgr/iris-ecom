'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 129;

export default function HeroFrameAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const textIntroRef = useRef<HTMLDivElement>(null);
  const productInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions to window sizes initially
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load images into memory
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      // Files are named ezgif-frame-001.jpg out to 129
      const numString = i.toString().padStart(3, '0');
      img.src = `/frames/ezgif-frame-${numString}.jpg`;
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        // Draw the first frame on load
        if (i === 1) {
          renderImage(img);
        }
      };
      images.push(img);
    }

    // Function to draw image maintaining aspect ratio and covering canvas
    const renderImage = (img: HTMLImageElement) => {
      if (!canvas || !context) return;
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // GSAP ScrollTrigger object
    const frameObj = { frame: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5, // 0.5 sec delay for smooth frame scrubbing
        }
      });

      // Animate frame sequence
      tl.to(frameObj, {
        frame: TOTAL_FRAMES - 1,
        snap: 'frame',
        ease: 'none',
        duration: 1, // relative duration
        onUpdate: () => {
          if (images[frameObj.frame]) {
            renderImage(images[frameObj.frame]);
          }
        }
      });

      // Intro text fade out early in the scroll
      tl.to(textIntroRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.1
      }, 0);

      // Product info reveal near the end of scroll
      tl.fromTo(productInfoRef.current, {
        opacity: 0, y: 50
      }, {
        opacity: 1, y: 0,
        duration: 0.1
      }, 0.85);

    }, containerRef);

    // Handle Resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (images[frameObj.frame]) {
        renderImage(images[frameObj.frame]);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-[600vh] w-full bg-[#FAFAFA]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black">

        {/* Loading overlay */}
        {imagesLoaded < TOTAL_FRAMES && (
          <div className="absolute top-4 left-4 z-50 text-white/70 text-xs tracking-widest uppercase">
            Loading Frames... {Math.round((imagesLoaded / TOTAL_FRAMES) * 100)}%
          </div>
        )}

        {/* Hardware accelerated canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 w-full h-full"
        />

        {/* Slight dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none" />

        {/* --- HTML OVERLAYS --- */}

        {/* Section 1: Intro Text */}
        <div ref={textIntroRef} className="absolute z-10 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-2xl">
            From Thread to<br />Timeless Fashion.
          </h1>
          <p className="text-white/80 font-light tracking-widest uppercase text-sm animate-pulse mt-8">
            Scroll to uncover the story
          </p>
        </div>

        {/* Final Product Info Overlay */}
        <div ref={productInfoRef} className="absolute right-8 md:right-24 bottom-24 z-20 bg-white/95 backdrop-blur-md p-8 shadow-2xl max-w-sm opacity-0 pointer-events-none">
          <span className="text-xs tracking-widest uppercase text-gray-500 mb-2 block">The Fabric Story</span>
          <h3 className="text-2xl font-serif text-gray-900 mb-2">Chikankari Elegance</h3>
          <p className="text-gray-700 font-light text-sm mb-6">Witness the transformation of traditional Indian embroidery into modern western silhouettes.</p>
          <Link href="/products" className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 text-xs font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors pointer-events-auto">
            Discover Collection <ArrowUpRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}

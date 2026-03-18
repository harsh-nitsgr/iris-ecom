'use client';

import React, { useRef, useLayoutEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FabricShaderMaterial } from './FabricShader';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Ensure the textures are valid URLs (using high res Unsplash placeholders representing "raw linen" and "western dress")
// Ensure the textures are valid URLs
const RAW_FABRIC_URL = 'https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2000&auto=format&fit=crop'; 

const PRODUCTS = [
  { id: 1, type: "Dress", name: "Hand-embroidered Linen Dress", price: "₹4,500", img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop' },
  { id: 2, type: "Top", name: "Embroidered Silk Top", price: "₹3,200", img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2000&auto=format&fit=crop' },
  { id: 3, type: "Jacket", name: "Modern Chikankari Jacket", price: "₹5,800", img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=2000&auto=format&fit=crop' },
  { id: 4, type: "Co-ord", name: "Minimalist Linen Co-ord", price: "₹4,800", img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2000&auto=format&fit=crop' },
];

function MorphPlane({ progress, currentProductIdx }: { progress: React.MutableRefObject<number>, currentProductIdx: React.MutableRefObject<number> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Load all textures
  const fabricTex = useTexture(RAW_FABRIC_URL);
  const productTextures = useTexture(PRODUCTS.map(p => p.img));

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.progress.value = progress.current;
      materialRef.current.uniforms.foldAmount.value = 1.5;
      
      // Update the dress texture based on current index
      const idx = Math.min(Math.max(0, currentProductIdx.current), PRODUCTS.length - 1);
      materialRef.current.uniforms.tDiffuse2.value = productTextures[idx];
    }
  });

  return (
    <mesh>
      {/* High segment count for smooth deformation */}
      <planeGeometry args={[14, 14, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        args={[FabricShaderMaterial]}
        uniforms={{
          tDiffuse1: { value: fabricTex },
          tDiffuse2: { value: productTextures[0] },
          progress: { value: 0 },
          foldAmount: { value: 0 },
          time: { value: 0 },
          resolution: { value: new THREE.Vector2() }
        }}
        transparent={true}
      />
    </mesh>
  );
}

export default function FabricSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textIntroRef = useRef<HTMLDivElement>(null);
  const svgGroupRef = useRef<SVGGElement>(null);
  const productInfoRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // These refs hold the current morph state for Three.js
  const progressRef = useRef(0);
  const currentProductIdx = useRef(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrubbing
        }
      });

      // SECTION 1: Intro Fade Out
      tl.to(textIntroRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.2 // Takes up first 5% of scroll (timeline is arbitrary length, relative)
      });

      const segmentDuration = 1.0;
      
      // Loop over each product to create the sequence
      PRODUCTS.forEach((product, index) => {
        // Step A: Set current product texture index instantly before animation starts
        tl.call(() => {
          // This ensures scrolling up/down snaps to the correct texture immediately
          currentProductIdx.current = index;
        }, [], `+=${0.01}`);

        // Step B: Embroidery SVG draw in
        if (svgGroupRef.current) {
          const paths = svgGroupRef.current.querySelectorAll('path');
          // Reset paths
          tl.set(paths, { strokeDasharray: 1000, strokeDashoffset: 1000, opacity: 0 }, "<");
          
          tl.to(paths, { 
            strokeDashoffset: 0, 
            opacity: 1, 
            duration: segmentDuration * 0.2, 
            stagger: 0.02,
            ease: "power1.inOut"
          }, "<");
          
          // Step C: Fade out SVG over the fold
          tl.to(paths, { opacity: 0, duration: segmentDuration * 0.1 }, `>-${segmentDuration * 0.1}`);
        }

        // Step D: Three.js cloth fold and morph (0 -> 1)
        tl.fromTo(progressRef, 
          { current: 0 },
          { current: 1, duration: segmentDuration * 0.4, ease: 'power2.inOut' }, 
          `<-${segmentDuration * 0.1}`
        );

        // Step E: Reveal product info
        const infoEl = productInfoRefs.current[index];
        if (infoEl) {
          tl.fromTo(infoEl, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: segmentDuration * 0.1 }, "<");
          
          // Wait a bit so user can see it
          tl.to({}, { duration: segmentDuration * 0.3 });
          
          // Step F: Hide product info before next morph
          tl.to(infoEl, { opacity: 0, x: -50, duration: segmentDuration * 0.1 });
        }

        // Step G: Unfold back to raw fabric (progress 1 -> 0) IF it's not the last item
        if (index < PRODUCTS.length - 1) {
          tl.to(progressRef, { current: 0, duration: segmentDuration * 0.2, ease: 'power2.inOut' });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[1600vh] w-full bg-black">
      {/* Sticky container that holds the canvas and text overlays */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* ThreeJS Fabric Simulator */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <React.Suspense fallback={null}>
              <MorphPlane progress={progressRef} currentProductIdx={currentProductIdx} />
            </React.Suspense>
          </Canvas>
          {/* A slight dark vignette to focus the eye */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
        </div>

        {/* --- HTML OVERLAYS --- */}

        {/* Section 1: Intro Text */}
        <div ref={textIntroRef} className="absolute z-10 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-xl">
            Traditional Chikankari.<br/>Reimagined.
          </h1>
          <p className="text-gray-300 font-light tracking-widest uppercase text-sm animate-pulse mt-8">
            Scroll to uncover the story
          </p>
        </div>

        {/* Section 2: Embroidery SVG (Golden styling) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-10 object-contain opacity-70 mix-blend-screen" 
          viewBox="0 0 800 600"
        >
          <g ref={svgGroupRef} fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round">
            {/* Abstract flower/vine pattern simulating chikankari */}
            <path d="M 200 400 C 250 350, 300 450, 400 300 C 500 150, 550 250, 600 200" />
            <path d="M 350 350 C 370 330, 390 360, 420 320" />
            <path d="M 400 300 C 430 280, 450 320, 480 270" />
            <path d="M 200 400 Q 220 380, 250 420 Q 280 400, 310 430" />
            <circle cx="400" cy="300" r="15" strokeDasharray="4 4" />
            <circle cx="600" cy="200" r="10" strokeDasharray="2 2" />
          </g>
        </svg>

        {/* Section 4/5: Final Western Dress Info for all products */}
        {PRODUCTS.map((prod, idx) => (
          <div 
            key={prod.id}
            ref={el => { productInfoRefs.current[idx] = el }} 
            className="absolute right-8 md:right-24 bottom-24 z-20 bg-white/90 backdrop-blur-md p-8 shadow-2xl max-w-sm opacity-0 pointer-events-none"
          >
            <span className="text-xs tracking-widest uppercase text-gray-500 mb-2 block">{prod.type}</span>
            <h3 className="text-2xl font-serif text-gray-900 mb-2">{prod.name}</h3>
            <p className="text-lg text-gray-700 mb-6 font-semibold">{prod.price}</p>
            <button className="w-full bg-black text-white py-4 text-xs font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors pointer-events-auto">
              Shop This Look
            </button>
          </div>
        ))}

      </div>
    </section>
  );
}

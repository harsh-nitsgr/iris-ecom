'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

// Simple seeded random to keep positions consistent
const mulberry32 = (a: number) => {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

interface ExperienceViewProps {
  products: any[];
  onProductClick: (product: any) => void;
}

export default function ExperienceView({ products, onProductClick }: ExperienceViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate scattered items
  const scatteredItems = useMemo(() => {
    if (products.length === 0) return [];
    
    const items = [];
    const random = mulberry32(12345); // Fixed seed for stable placement
    
    // 1. Center original items organically near origin
    products.forEach((product, i) => {
      // Spiral placement for center items
      const angle = i * 2.39996; // Golden angle
      const radius = 250 + (i * 120) + (random() * 50);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      items.push({
        ...product,
        uniqueId: `orig-${product._id}`,
        x,
        y,
        scale: 0.8 + (random() * 0.4),
        zIndex: Math.floor(random() * 100)
      });
    });

    // 2. Add duplicates scattered far away
    const numDuplicates = 100;
    for (let i = 0; i < numDuplicates; i++) {
      const baseProduct = products[i % products.length];
      
      // Outside the center radius
      const angle = random() * Math.PI * 2;
      const radius = 1500 + (random() * 4000);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      items.push({
        ...baseProduct,
        uniqueId: `dup-${baseProduct._id}-${i}`,
        x,
        y,
        scale: 0.5 + (random() * 0.5),
        zIndex: Math.floor(random() * 10)
      });
    }

    return items.sort((a, b) => a.zIndex - b.zIndex);
  }, [products]);

  if (windowSize.width === 0) return null;

  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-[#050505] cursor-grab active:cursor-grabbing touch-none z-0"
      ref={containerRef}
    >
      <motion.div
        drag
        dragConstraints={{ left: -5000, right: 5000, top: -5000, bottom: 5000 }}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 100, bounceDamping: 20 }}
        initial={{ scale: 0.7, opacity: 0, x: 0, y: 0 }}
        animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 w-0 h-0" // Center the dragging origin
      >
        {scatteredItems.map((item) => (
          <motion.div
            key={item.uniqueId}
            whileHover={{ scale: item.scale * 1.05, zIndex: 999 }}
            className="absolute rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] group"
            style={{
              x: item.x,
              y: item.y,
              width: 320,
              height: 440,
              marginLeft: -160,
              marginTop: -220,
              scale: item.scale,
              zIndex: item.zIndex
            }}
            onClick={() => onProductClick(item)}
            onDragStart={(e) => {
              // Prevent clicking when dragging
              e.stopPropagation();
            }}
          >
            <img 
              src={item.images[0]} 
              alt={item.name}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 pointer-events-none">
              <h3 className="text-white font-serif text-2xl tracking-wide">{item.name}</h3>
              <p className="text-white/70 text-sm mt-2 font-light tracking-wider">₹{item.price.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Subtle vignette overlay to blend edges */}
      <div className="absolute inset-0 pointer-events-none z-10" 
           style={{ boxShadow: 'inset 0 0 200px rgba(5,5,5,0.9)' }} />
    </div>
  );
}

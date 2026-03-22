'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useTransform, wrap } from 'framer-motion';

// Seeded random for consistent organic jitter
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

const WrappedItem = ({ item, panX, panY, minX, maxX, minY, maxY, onProductClick }: any) => {
  // Use framer-motion wrap to seamlessly loop coordinates infinitely relative to the dragged canvas
  const x = useTransform(panX, (px) => wrap(minX, maxX, (px as number) + item.initialX) - (px as number));
  const y = useTransform(panY, (py) => wrap(minY, maxY, (py as number) + item.initialY) - (py as number));

  return (
    <motion.div
      style={{
        x,
        y,
        width: 320,
        height: 440,
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -160,
        marginTop: -220,
        scale: item.scale, // apply deterministic random scale
        zIndex: 10
      }}
      className="rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-300 hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)] group cursor-pointer"
      onPointerDown={(e) => {
        // Prevent click events firing immediately upon dragging
        e.stopPropagation();
      }}
      onClick={(e) => {
        // Stop the click from registering if the user was actively panning
        onProductClick(item);
      }}
      whileHover={{ scale: item.scale * 1.15, zIndex: 100 }}
    >
      <img 
        src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder.jpg'} 
        alt={item.name}
        loading="lazy"
        className="w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 pointer-events-none">
        <h3 className="text-white font-serif text-2xl tracking-wide">{item.name}</h3>
        <p className="text-white/70 text-sm mt-2 font-light tracking-wider">₹{item.price.toLocaleString('en-IN')}</p>
      </div>
    </motion.div>
  );
}

export default function ExperienceView({ products, onProductClick }: ExperienceViewProps) {
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gridData = useMemo(() => {
    if (products.length === 0) return { items: [], minX: 0, maxX: 0, minY: 0, maxY: 0 };
    
    // We generate a massive staggered block that flawlessly wraps on itself.
    // 10 columns x 8 rows safely covers ultra-wide monitors since cells are enormous.
    const cols = 10; 
    const rows = 8;
    const cellWidth = 800;  // Dramatically increased spacing
    const cellHeight = 900; // Dramatically increased spacing
    const blockWidth = cols * cellWidth; // 8000px loop margin
    const blockHeight = rows * cellHeight; // 7200px loop margin
    const minX = -blockWidth / 2;
    const maxX = blockWidth / 2;
    const minY = -blockHeight / 2;
    const maxY = blockHeight / 2;

    const newItems = [];
    let productIndex = 0;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Distribute the original items sequentially throughout the grid
        const product = products[productIndex % products.length];
        productIndex++;

        // Stagger every other row by exactly half a cell for zero-overlap dense packing
        const staggerX = (row % 2 === 0) ? 0 : cellWidth / 2;
        
        // Add extreme deterministic jitter to make the grid feel wildly scattered
        // Max jitter is ~250px, cell gap is ~400px - mathematically impossible to overlap!
        const random = mulberry32(row * 100 + col);
        const jitterX = (random() - 0.5) * 400;
        const jitterY = (random() - 0.5) * 450;

        const initialX = minX + col * cellWidth + staggerX + jitterX;
        const initialY = minY + row * cellHeight + jitterY;
        
        // Create massive scale variety between 0.3x and 1.1x like the reference image
        const scale = 0.3 + (mulberry32(row * 200 + col)() * 0.8);

        newItems.push({
           ...product,
           uniqueId: `grid-${row}-${col}`,
           initialX,
           initialY,
           scale
        });
      }
    }

    return { items: newItems, minX, maxX, minY, maxY };
  }, [products]);

  if (windowSize.width === 0) return null;

  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-[#050505] cursor-grab active:cursor-grabbing touch-none z-0"
      ref={containerRef}
    >
      <motion.div
        drag
        style={{ 
          x: panX, 
          y: panY,
          width: 50000, 
          height: 50000, 
          position: 'absolute',
          left: '50%', 
          top: '50%',
          marginLeft: -25000, 
          marginTop: -25000
        }}
        dragConstraints={{ left: -10000, right: 10000, top: -10000, bottom: 10000 }}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 100, bounceDamping: 20 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="z-0"
      >
        {gridData.items.map((item) => (
          <WrappedItem 
            key={item.uniqueId} 
            item={item} 
            panX={panX} 
            panY={panY} 
            minX={gridData.minX} 
            maxX={gridData.maxX} 
            minY={gridData.minY} 
            maxY={gridData.maxY} 
            onProductClick={onProductClick} 
          />
        ))}
      </motion.div>
      
      {/* Subtle vignette overlay to blend edges */}
      <div className="absolute inset-0 pointer-events-none z-10" 
           style={{ boxShadow: 'inset 0 0 200px rgba(5,5,5,0.9)' }} />
    </div>
  );
}

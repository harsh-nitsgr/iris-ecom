'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { ZoomIn, ZoomOut } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
//  EASY TUNING KNOBS  (change these to adjust spacing / size)
// ─────────────────────────────────────────────────────────────────────────────
const CELL_W       = 500;   // ← horizontal gap between dress centres
const CELL_H       = 600;   // ← vertical gap between dress centres
const CARD_W       = 260;   // ← card pixel width
const CARD_H       = 360;   // ← card pixel height
const JITTER       = 80;    // ← max random offset (keeps spacing roughly constant)
const BASE_SCALE   = 0.75;  // ← base display scale (0–1)
const SCALE_RANGE  = 0.25;  // ← how much extra random scale variance
const COLS         = 16;    // ← columns in the grid
const ROWS         = 14;    // ← rows in the grid
// ─────────────────────────────────────────────────────────────────────────────

// Deterministic seeded PRNG – same layout every render, no flickering
const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
};

interface ExperienceViewProps {
  products: any[];
  onProductClick: (product: any) => void;
}

export default function ExperienceView({ products, onProductClick }: ExperienceViewProps) {
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const scaleVal = useMotionValue(1);

  const [isDragging, setIsDragging] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  const handleZoomIn  = () => animate(scaleVal, Math.min(scaleVal.get() + 0.25, 2.5),  { type: 'spring', stiffness: 200, damping: 25 });
  const handleZoomOut = () => animate(scaleVal, Math.max(scaleVal.get() - 0.25, 0.3), { type: 'spring', stiffness: 200, damping: 25 });

  // Build a static grid of cards. Large enough that the user never pans to an edge.
  const items = useMemo(() => {
    if (products.length === 0) return [];
    const prng = seeded(0xdeadbeef);
    const list: any[] = [];

    const totalW = COLS * CELL_W;
    const totalH = ROWS * CELL_H;
    const originX = -totalW / 2;
    const originY = -totalH / 2;

    let idx = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const product = products[idx % products.length];
        idx++;

        const staggerX = (row % 2 === 0) ? 0 : CELL_W / 2;
        const jx = (prng() - 0.5) * JITTER * 2;
        const jy = (prng() - 0.5) * JITTER * 2;
        const scale = BASE_SCALE + prng() * SCALE_RANGE;

        list.push({
          ...product,
          uid: `${row}-${col}`,
          x: originX + col * CELL_W + staggerX + jx,
          y: originY + row * CELL_H + jy,
          scale,
        });
      }
    }
    return list;
  }, [products]);

  if (!ready) return null;

  const totalW = COLS * CELL_W;
  const totalH = ROWS * CELL_H;
  const maxPan  = Math.max(totalW, totalH) / 2 + 400;

  return (
    <div className="fixed top-20 inset-x-0 bottom-0 overflow-hidden bg-[#050505] touch-none z-0"
         style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>

      {/* Draggable canvas */}
      <motion.div
        drag
        onDragStart={() => setIsDragging(true)}
        onDragEnd={()   => setTimeout(() => setIsDragging(false), 120)}
        dragConstraints={{ left: -maxPan, right: maxPan, top: -maxPan, bottom: maxPan }}
        dragElastic={0.05}
        dragTransition={{ power: 0.3, timeConstant: 200 }}
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute"
        style={{
          x: panX, y: panY, scale: scaleVal,
          width: totalW, height: totalH,
          left: '50%', top: '50%',
          marginLeft: -totalW / 2,
          marginTop:  -totalH / 2,
        }}
      >
        {items.map((item) => (
          <motion.div
            key={item.uid}
            style={{
              position: 'absolute',
              left: item.x - CARD_W / 2,
              top:  item.y - CARD_H / 2,
              width:  CARD_W,
              height: CARD_H,
              scale: item.scale,
            }}
            className="rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.55)] cursor-pointer group"
            whileHover={{ scale: item.scale * 1.08, zIndex: 50, transition: { duration: 0.2 } }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              if (isDragging) return;

              // Smoothly pan the clicked dress to the right-centre of screen
              const targetX = window.innerWidth * 0.25 - item.x;
              const targetY = -(item.y);
              animate(panX, targetX, { type: 'spring', damping: 26, stiffness: 130 });
              animate(panY, targetY, { type: 'spring', damping: 26, stiffness: 130 });
              animate(scaleVal, 1.4,  { type: 'spring', damping: 26, stiffness: 130 });

              onProductClick(item);
            }}
          >
            <img
              src={item.images?.[0] ?? '/placeholder.jpg'}
              alt={item.name}
              loading="lazy"
              draggable={false}
              className="w-full h-full object-cover object-top pointer-events-none"
            />
            {/* Hover label */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-400
                            flex flex-col justify-end p-4 pointer-events-none">
              <p className="text-white font-serif text-lg leading-tight">{item.name}</p>
              <p className="text-white/60 text-sm mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Vignette edges */}
      <div className="absolute inset-0 pointer-events-none z-10"
           style={{ boxShadow: 'inset 0 0 160px rgba(5,5,5,0.85)' }} />

      {/* Zoom controls */}
      <div className="fixed bottom-24 right-6 z-[90] flex flex-col gap-1
                      bg-[#111]/80 border border-white/10 backdrop-blur-md rounded-full p-1 shadow-2xl">
        <button onClick={handleZoomIn}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/50
                           hover:text-white hover:bg-white/10 transition-colors">
          <ZoomIn size={16} />
        </button>
        <div className="h-px bg-white/10 mx-1" />
        <button onClick={handleZoomOut}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/50
                           hover:text-white hover:bg-white/10 transition-colors">
          <ZoomOut size={16} />
        </button>
      </div>

      {/* Drag hint */}
      <p className="fixed bottom-8 right-8 text-white/20 text-xs tracking-widest pointer-events-none z-[90]">
        ✦ DRAG TO EXPLORE
      </p>
    </div>
  );
}

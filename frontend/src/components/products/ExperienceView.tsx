import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useTransform, wrap, animate } from 'framer-motion';
import { ZoomIn, ZoomOut } from 'lucide-react';

// Seeded random for consistent organic jitter
const mulberry32 = (a: number) => {
  return function () {
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
        e.stopPropagation();
      }}
      onClick={(e) => {
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
  const globalScale = useMotionValue(1); // Drives the zoom in/out
  
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const handleZoomIn = () => animate(globalScale, Math.min(globalScale.get() + 0.3, 2), { type: 'spring' });
  const handleZoomOut = () => animate(globalScale, Math.max(globalScale.get() - 0.3, 0.4), { type: 'spring' });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gridData = useMemo(() => {
    if (products.length === 0) return { items: [], minX: 0, maxX: 0, minY: 0, maxY: 0 };

    // We generate a massive staggered block that flawlessly wraps on itself.
    // 14 columns x 10 rows safely covers incredibly ultra-wide monitors.
    const cols = 14;
    const rows = 10;
    // --- YOU CAN ADJUST SPACING HERE ---
    const cellWidth = 600;  // Horizontal Spacing between items
    const cellHeight = 700; // Vertical Spacing between items
    // -----------------------------------
    
    const blockWidth = cols * cellWidth; // 5040px loop margin
    const blockHeight = rows * cellHeight; // 4800px loop margin
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

        // Scatter randomly but keep the space reasonably constant 
        // by limiting the jitter to exactly half the gap between cells.
        const random = mulberry32(row * 100 + col);
        const jitterX = (random() - 0.5) * 150;
        const jitterY = (random() - 0.5) * 150;

        const initialX = minX + col * cellWidth + staggerX + jitterX;
        const initialY = minY + row * cellHeight + jitterY;
        
        // --- YOU CAN ADJUST DRESS ITEM SIZE HERE ---
        // I reduced the default base scale to 0.6x for smaller dresses
        const baseScale = 0.6;
        // -------------------------------------------
        const scale = baseScale + (mulberry32(row * 200 + col)() * 0.2); // Tiny random variance

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
      className="fixed top-20 inset-x-0 bottom-0 overflow-hidden bg-[#050505] cursor-grab active:cursor-grabbing touch-none z-0"
      ref={containerRef}
    >
      <motion.div
        drag
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
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
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="z-0"
      >
        <motion.div style={{ scale: globalScale }} className="absolute inset-0">
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
              onProductClick={(product: any) => {
                if (isDragging) return; // Block accidental clicks if the user was just dragging

                // When an item is clicked, pan the camera so the item smoothly moves to 
                // the right side of the screen (75% mark), to elegantly pair with the 50% info panel!
                const targetPanX = (window.innerWidth * 0.25) - item.initialX;
                const targetPanY = -item.initialY;
                
                animate(panX, targetPanX, { type: 'spring', damping: 25, stiffness: 120 });
                animate(panY, targetPanY, { type: 'spring', damping: 25, stiffness: 120 });
                animate(globalScale, 1.5, { type: 'spring', damping: 25, stiffness: 120 }); // Zoom in to focus
                
                onProductClick(product);
              }} 
            />
          ))}
        </motion.div>
      </motion.div>
      
      {/* Subtle vignette overlay to blend edges */}
      <div className="absolute inset-0 pointer-events-none z-10" 
           style={{ boxShadow: 'inset 0 0 200px rgba(5,5,5,0.9)' }} />

      {/* Zoom Controls */}
      <div className="fixed bottom-8 right-8 z-[90] flex flex-col gap-2 bg-[#111] border border-white/10 rounded-full p-1 shadow-2xl">
        <button 
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomIn size={18} />
        </button>
        <div className="w-full h-px bg-white/10" />
        <button 
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomOut size={18} />
        </button>
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { X, ShoppingBag, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import api from '@/lib/api';

interface ProductSidePanelProps {
  product: any;
  clickedId: string | null;
  onClose: () => void;
}

export default function ProductSidePanel({ product, clickedId, onClose }: ProductSidePanelProps) {
  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(product.images[0]);

  // Directly copy the show interest logic here from the original button
  const handleShowInterest = async () => {
    if (!product) return;
    setLoading(true);
    try {
      let selectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0].size : 'One Size';
      await api.post('/interests', { 
        productId: product._id,
        size: selectedSize
      });
      toast.success('Interest registered! We will notify you.');
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error('You have already shown interest in this product!');
      } else {
        toast.error('Failed to register interest. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-20 bottom-0 left-0 w-full md:w-[50vw] bg-[#050505] border-r border-[#222] z-[100] shadow-[30px_0_60px_rgba(0,0,0,0.8)] overflow-visible flex items-center justify-center p-8"
    >
      {/* Massive Background Title for an artistic Palmer-style aesthetic */}
      <h1 className="absolute top-12 left-8 text-[4rem] sm:text-[6rem] md:text-[8rem] font-serif font-light text-white/5 whitespace-nowrap z-0 tracking-tighter select-none pointer-events-none mix-blend-screen">
        {product.name}
      </h1>

      {/* Vertical Thumbnails Column */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
        {product.images.slice(0, 4).map((img: string, i: number) => (
          <button 
            key={i} 
            onClick={() => setActiveImage(img)}
            className={`w-14 h-16 border p-0.5 transition-all outline-none ${activeImage === img ? 'border-white/60 opacity-100 scale-105' : 'border-white/10 opacity-50 hover:opacity-80'}`}
          >
            <img src={img} className="w-full h-full object-cover" alt={`${product.name} view ${i+1}`} />
          </button>
        ))}
      </div>

      {/* Main Orchestrated Product Image - Shared Element Transition Target */}
      <motion.img 
        layoutId={clickedId && activeImage === product.images[0] ? `dress-${clickedId}` : undefined}
        src={activeImage}
        className="w-[70%] max-w-[500px] h-[75vh] object-cover object-top rounded-xl z-10 shadow-2xl relative"
        alt={product.name}
      />

      {/* Information floating bottom left of the image */}
      <div className="absolute bottom-10 left-8 md:left-[15%] z-20">
        <p className="text-white/60 text-xs tracking-[0.3em] uppercase mb-1">{product.brand?.name || 'Iris Edit'}</p>
        <p className="text-white text-lg font-light tracking-wide">₹{product.price.toLocaleString('en-IN')}</p>
      </div>

      {/* Actions bottom right */}
      <div className="absolute bottom-10 right-10 flex gap-4 z-20">
        <button 
          onClick={handleShowInterest}
          disabled={loading}
          className="px-6 py-3 bg-[#111] border border-[#333] text-white/80 text-xs font-semibold tracking-[0.1em] uppercase flex items-center gap-2 hover:text-white hover:border-white/50 transition-colors disabled:opacity-50"
        >
          <Eye size={14} /> {loading ? 'Wait...' : 'Show Interest'}
        </button>
        <Link 
          href={`/product/${product._id}`}
          className="px-6 py-3 bg-white text-black text-xs font-semibold tracking-[0.1em] uppercase flex items-center gap-2 hover:bg-white/80 transition-colors"
        >
          Explore Collection <ShoppingBag size={14} /> 
        </Link>
      </div>

      {/* Palmer-style Exact Center Cross Button over the separation line */}
      <button 
        onClick={onClose}
        className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white text-black border border-black/10 flex items-center justify-center hover:bg-gray-200 transition-colors z-[200] shadow-xl rounded-none"
        aria-label="Close panel"
      >
        <X size={24} strokeWidth={1} />
      </button>
    </motion.div>
  );
}

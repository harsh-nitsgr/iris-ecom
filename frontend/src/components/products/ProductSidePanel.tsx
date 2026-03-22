'use client';

import { motion } from 'framer-motion';
import { X, ShoppingBag, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import api from '@/lib/api';

interface ProductSidePanelProps {
  product: any;
  onClose: () => void;
}

export default function ProductSidePanel({ product, onClose }: ProductSidePanelProps) {
  const [loading, setLoading] = useState(false);

  // Directly copy the show interest logic here from the original button
  const handleShowInterest = async () => {
    if (!product) return;
    setLoading(true);
    try {
      // Default to "One Size" if no sizes exist or user doesn't pick
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
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed top-0 left-0 w-full md:w-[450px] h-full bg-[#0a0a0a]/80 backdrop-blur-2xl border-r border-white/10 z-[100] shadow-2xl flex flex-col overflow-y-auto"
    >
      <div className="relative h-[55vh] flex-shrink-0 group">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80" />
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="p-8 flex-grow flex flex-col -mt-20 relative z-10">
        <div className="uppercase tracking-[0.2em] text-[10px] text-white/40 mb-3">{product.brand?.name || 'Iris'}</div>
        <h2 className="text-3xl font-serif text-white mb-2 leading-tight">{product.name}</h2>
        <p className="text-xl text-white/70 mb-8 font-light tracking-wide">₹{product.price.toLocaleString('en-IN')}</p>
        
        <p className="text-white/50 text-sm leading-relaxed mb-10 font-light">
          {product.description}
        </p>

        <div className="mt-auto space-y-4 pt-8">
          <Link 
            href={`/product/${product._id}`}
            className="w-full py-4 bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-white/90 transition-colors"
          >
            <ShoppingBag size={16} /> View Full Details
          </Link>
          <button 
            onClick={handleShowInterest}
            disabled={loading}
            className="w-full py-4 bg-transparent border border-white/20 text-white text-xs font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <Eye size={16} /> {loading ? 'Registering...' : 'Show Interest'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

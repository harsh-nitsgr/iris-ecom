'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/lib/useProducts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  
  const allProducts = useProducts();
  // Find by ID — wait for products to load (API is async)
  const product = allProducts.find(p => p._id === productId);

  // Resolve image URL — handles both plain strings and legacy {url} objects
  const resolveImg = (img: any): string =>
    typeof img === 'string' ? img : (img?.url ?? '');

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizeError, setSizeError] = useState(false);
  const [interestState, setInterestState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  const { user } = useAuthStore();

  const handleShowInterest = async () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    setInterestState('loading');
    try {
      const { data } = await api.post(`/interests/${product._id}`, { size: selectedSize, productName: product.name });
      setTotalInterest(data.totalClicks);
      setInterestState('done');

      // Persist locally for the Profile → Interests tab
      try {
        const raw = localStorage.getItem('my_interests');
        let list = [];
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) list = parsed;
        }
        list.unshift({ productId: product._id, productName: product.name, size: selectedSize, at: new Date().toISOString() });
        localStorage.setItem('my_interests', JSON.stringify(list.slice(0, 50)));
      } catch (e) {
        console.error('Failed to save interest to localStorage', e);
      }
    } catch (error: any) {
      setInterestState('idle');
      const errMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Could not record interest. Error: ${errMsg}`);
    }
  };

  // Show loading skeleton while products are being fetched from API
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/30 text-xs tracking-widest uppercase">Loading product…</p>
        </div>
      </div>
    );
  }

  const images = (product.images || []).map(resolveImg).filter(Boolean);
  const brandName = typeof product.brand === 'object' ? (product.brand?.name ?? 'Iris') : (product.brand ?? 'Iris');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <Link href="/products" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs tracking-widest uppercase mb-12 transition-colors">
          <ArrowLeft size={14} /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:h-[640px] scrollbar-hide">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-24 lg:w-24 lg:h-32 border-2 overflow-hidden transition-colors ${selectedImage === idx ? 'border-white' : 'border-white/10 hover:border-white/30'}`}>
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-grow relative aspect-[3/4] lg:h-[640px] bg-[#1a1a1a] overflow-hidden cursor-zoom-in group">
              {product.tag && (
                <span className="absolute top-4 left-4 z-10 text-[10px] tracking-widest uppercase bg-white text-black px-3 py-1">{product.tag}</span>
              )}
              <img src={images[selectedImage] || images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 origin-center" />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-col">
            <span className="text-white/30 text-xs tracking-[0.4em] uppercase mb-3">{brandName}</span>
            <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">{product.name}</h1>
            <span className="text-white/50 text-xs tracking-widest uppercase mb-6">{product.category}</span>
            <span className="text-2xl text-white mb-8 font-light">₹{product.price.toLocaleString('en-IN')}</span>

            <p className="text-white/50 font-light leading-relaxed mb-10 text-sm border-t border-white/10 pt-8">
              {product.description}
            </p>

            {/* Size selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/70 text-xs tracking-widest uppercase">Size</span>
                <button className="text-white/30 text-xs underline underline-offset-4 hidden sm:block hover:text-white/60 transition-colors">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((s) => (
                  <button key={s.size} disabled={s.countInStock === 0} onClick={() => { setSelectedSize(s.size); setSizeError(false); }}
                    className={`w-12 h-12 flex items-center justify-center border text-sm transition-colors ${
                      s.countInStock === 0
                        ? 'border-white/10 text-white/20 cursor-not-allowed line-through'
                        : selectedSize === s.size
                          ? 'border-white bg-white text-black'
                          : 'border-white/30 text-white/70 hover:border-white hover:text-white'
                    }`}>
                    {s.size}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {sizeError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="text-amber-400 text-xs mt-4 flex items-center gap-2"
                  >
                    ⚠️ Please select a size to continue
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Show Interest button */}
            <div className="mb-4">
              <AnimatePresence mode="wait">
                {interestState === 'done' ? (
                  <motion.div key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 bg-white/5 border border-white/20 px-6 py-4"
                  >
                    <CheckCircle size={18} className="text-green-400" strokeWidth={1.5} />
                    <div>
                      <p className="text-white text-sm">Interest recorded!</p>
                      <p className="text-white/40 text-xs mt-0.5">
                        {totalInterest ? `${totalInterest} people` : "You're the first! Others"} have shown interest in this piece.
                      </p>
                    </div>
                    <button onClick={() => setInterestState('idle')} className="ml-auto text-white/20 hover:text-white/50 text-xs underline transition-colors">Undo</button>
                  </motion.div>
                ) : (
                  <motion.button key="btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleShowInterest}
                    disabled={interestState === 'loading'}
                    className={`w-full h-14 flex items-center justify-center gap-3 border text-sm tracking-widest uppercase font-medium transition-all ${
                      interestState === 'loading'
                        ? 'border-white/20 text-white/30 cursor-not-allowed'
                        : 'border-white/40 text-white hover:bg-white hover:text-black hover:border-white'
                    }`}
                  >
                    <Heart size={16} strokeWidth={1.5} className={interestState === 'loading' ? 'animate-pulse' : ''} />
                    {interestState === 'loading' ? 'Recording…' : 'Show Interest'}
                  </motion.button>
                )}
              </AnimatePresence>

              <p className="text-white/20 text-xs mt-3 text-center">
                Not a purchase. We'll reach out when the piece is ready.
              </p>
            </div>

            {/* Accordion */}
            <div className="border-t border-white/10 pt-8 space-y-0 mt-auto">
              {[
                { label: 'Fabric & Care', text: product.fabricAndCare || 'Handwoven natural fabric. Dry clean recommended. Store folded in a cool, dry place.' },
                { label: 'Shipping & Returns', text: product.shippingAndReturns || 'Free standard shipping on orders over ₹5000. Express delivery available. Returns accepted within 14 days of delivery in original condition.' },
              ].map(({ label, text }) => (
                <details key={label} className="group border-b border-white/10">
                  <summary className="flex justify-between items-center py-4 cursor-pointer list-none text-xs tracking-widest uppercase text-white/60 hover:text-white transition-colors">
                    <span>{label}</span>
                    <span className="transition-transform group-open:rotate-180 text-white/30">
                      <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6" /></svg>
                    </span>
                  </summary>
                  <p className="text-white/40 pb-4 font-light text-sm leading-relaxed">{text}</p>
                </details>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

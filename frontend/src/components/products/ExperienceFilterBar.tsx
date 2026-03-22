'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

interface ExperienceFilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onToggleView: () => void;
  viewType: 'experience' | 'grid';
}

export default function ExperienceFilterBar({ categories, selectedCategory, onSelectCategory, onToggleView, viewType }: ExperienceFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 bg-[#111]/90 backdrop-blur-xl border border-white/10 p-6 shadow-2xl rounded-2xl w-[90vw] max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-serif text-lg tracking-wide">Filters</h3>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white/40 mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => onSelectCategory(cat)}
                      className={`px-4 py-2 text-[10px] uppercase tracking-widest transition-colors border ${
                        selectedCategory === cat 
                          ? 'bg-white text-black border-white' 
                          : 'bg-transparent text-white/60 border-white/20 hover:border-white/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 bg-[#050505]/80 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-[0_10_40px_rgba(0,0,0,0.8)]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs tracking-widest uppercase transition-all ${
            isOpen ? 'bg-white text-black' : 'text-white hover:bg-white/10'
          }`}
        >
          <Filter size={14} /> Filters
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-1" />
        
        <div className="flex items-center rounded-full">
          <button
            onClick={() => viewType !== 'experience' && onToggleView()}
            className={`px-5 py-3 rounded-l-full text-[10px] sm:text-xs uppercase tracking-widest transition-all ${
              viewType === 'experience' 
                ? 'bg-white/20 text-white font-medium' 
                : 'text-white/40 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => viewType !== 'grid' && onToggleView()}
            className={`px-5 py-3 rounded-r-full text-[10px] sm:text-xs uppercase tracking-widest transition-all ${
              viewType === 'grid' 
                ? 'bg-white/20 text-white font-medium' 
                : 'text-white/40 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            Grid
          </button>
        </div>
      </div>
    </div>
  );
}

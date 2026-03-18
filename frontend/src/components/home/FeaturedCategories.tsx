'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  {
    name: 'Dresses',
    image: '/products/prod1.jpg',
    link: '/products?category=Dresses',
    description: 'Fluid silhouettes for every occasion.'
  },
  {
    name: 'Co-ords',
    image: '/products/prod2.jpg',
    link: '/products?category=Co-ords',
    description: 'Effortless matching sets.'
  },
  {
    name: 'Tops',
    image: '/products/prod3.jpg',
    link: '/products?category=Tops',
    description: 'Beautifully crafted upper wear.'
  },
];

export default function FeaturedCategories() {
  return (
    <section className="relative w-full bg-black">
      {categories.map((category, index) => (
        <div 
          key={category.name}
          className="sticky top-0 h-screen w-full overflow-hidden group"
          style={{ zIndex: index + 1 }}
        >
          <div className="absolute inset-0 bg-black">
            <img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-full object-cover opacity-80 transition-transform duration-[2s] ease-out group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:p-24 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 translate-y-8 md:translate-y-12 transition-transform duration-700 ease-out group-hover:translate-y-0">
              <div>
                <span className="text-white/70 tracking-[0.3em] uppercase text-xs block mb-4">
                  0{index + 1} // Collection
                </span>
                <h2 className="text-5xl md:text-7xl lg:text-8xl text-white font-serif tracking-tight mb-4">
                  {category.name}
                </h2>
                <p className="text-xl text-white/80 font-light max-w-md">
                  {category.description}
                </p>
              </div>
              
              <Link 
                href={category.link}
                className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 flex items-center gap-3 bg-white text-black px-8 py-5 text-xs tracking-widest uppercase hover:bg-gray-200"
              >
                Shop Collection <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

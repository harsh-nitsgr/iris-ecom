'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useProducts } from '@/lib/useProducts';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  const allProducts = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [products, setProducts] = useState(allProducts);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setProducts(allProducts);
    } else {
      setProducts(allProducts.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, allProducts]);

  const categories = ['All', 'Dresses', 'Tops', 'Co-ords', 'Party Wear', 'Casual Wear'];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-56 flex-shrink-0">
            <div className="sticky top-28 space-y-10">
              <div>
                <h3 className="text-xs font-semibold tracking-widest uppercase mb-5 border-b border-white/10 pb-3 text-white/60">Categories</h3>
                <ul className="space-y-4">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-sm transition-colors duration-200 ${selectedCategory === cat ? 'text-white font-semibold' : 'text-white/40 hover:text-white/80'}`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold tracking-widest uppercase mb-4 border-b border-white/10 pb-3 text-white/60">Price Range</h3>
                <input type="range" min="0" max="20000" className="w-full accent-white" />
                <div className="flex justify-between text-xs text-white/30 mt-2">
                  <span>₹0</span>
                  <span>₹20,000+</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-grow">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-serif text-white">{selectedCategory === 'All' ? 'The Collection' : selectedCategory}</h1>
              <span className="text-sm text-white/30">{products.length} Pieces</span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20 text-white/40">
                No products found in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="group flex flex-col">
                    <div className="relative aspect-[3/4] bg-[#1a1a1a] overflow-hidden mb-4">
                      {product.tag && (
                        <span className="absolute top-3 left-3 z-10 text-[10px] tracking-widest uppercase bg-white text-black px-2 py-1">
                          {product.tag}
                        </span>
                      )}
                      <Link href={`/product/${product._id}`} className="block w-full h-full">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>
                      <button aria-label="Add to Wishlist" className="absolute top-3 right-3 text-white/40 hover:text-red-400 transition-colors z-10">
                        <Heart size={18} strokeWidth={1.5} />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white">
                        <button className="w-full py-3 text-xs font-medium tracking-widest uppercase text-black hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                          <ShoppingCart size={14} /> Quick Add
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Link href={`/product/${product._id}`} className="text-sm text-white/80 hover:text-white transition-colors mb-1 line-clamp-1">
                        {product.name}
                      </Link>
                      <span className="text-sm text-white/40">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-serif text-2xl text-white">Loading Collection...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

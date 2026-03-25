'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useProducts } from '@/lib/useProducts';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const allProducts = useProducts();
  const [products, setProducts] = useState(allProducts);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setProducts(allProducts);
    } else {
      setProducts(allProducts.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, allProducts]);

  const categories = ['All', 'Dresses', 'Tops', 'Co-ords', 'Party Wear', 'Casual Wear'];

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-serif text-white tracking-tight">
              {selectedCategory === 'All' ? 'The Collection' : selectedCategory}
            </h1>
            <p className="text-white/30 text-sm mt-1">{products.length} pieces</p>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-1.5 text-xs tracking-widest uppercase border transition-colors
                  ${selectedCategory === cat
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/50 border-white/10 hover:border-white/40 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24 text-white/30 text-sm tracking-widest">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <button
                    aria-label="Add to Wishlist"
                    className="absolute top-3 right-3 text-white/40 hover:text-red-400 transition-colors z-10"
                  >
                    <Heart size={18} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Link
                    href={`/product/${product._id}`}
                    className="text-sm text-white/80 hover:text-white transition-colors mb-1 line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <span className="text-sm text-white/40">
                    ₹{product.price?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-serif text-2xl text-white">
        Loading Collection...
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

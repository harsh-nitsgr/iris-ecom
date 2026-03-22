'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useProducts } from '@/lib/useProducts';

// Import New Experience Components
import ExperienceView from '@/components/products/ExperienceView';
import ProductSidePanel from '@/components/products/ProductSidePanel';
import ExperienceFilterBar from '@/components/products/ExperienceFilterBar';
import { AnimatePresence } from 'framer-motion';

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const initialCategory = searchParams.get('category') || 'All';
  const initialView = searchParams.get('view') === 'grid' ? 'grid' : 'experience';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [viewType, setViewType] = useState<'experience' | 'grid'>(initialView);

  const allProducts = useProducts();
  const [products, setProducts] = useState(allProducts);
  
  // Selected product state for the Side Panel (deep linked via URL)
  const productIdQuery = searchParams.get('product');
  const selectedProduct = productIdQuery ? allProducts.find(p => p._id === productIdQuery) : null;
  const clickedId = searchParams.get('clickedId');

  useEffect(() => {
    if (selectedCategory === 'All') {
      setProducts(allProducts);
    } else {
      setProducts(allProducts.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, allProducts]);

  const categories = ['All', 'Dresses', 'Tops', 'Co-ords', 'Party Wear', 'Casual Wear'];

  const handleProductClick = (product: any) => {
    // We only open the side panel in experience view. 
    // Wait, the prompt implies "on clicking the product the product details appear on left side" in *experience view*.
    // Grid view already navigates to `/product/[id]`.
    if (viewType === 'experience') {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('product', product._id);
      
      // We pass the absolute uniqueId to explicitly link identical layoutIds for the Shared Element Transition
      if (product._clickedUniqueId) {
        newParams.set('clickedId', product._clickedUniqueId);
      }
      
      router.push(`${pathname}?${newParams.toString()}`);
    } else {
      router.push(`/product/${product._id}`);
    }
  };

  const handleClosePanel = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('product');
    newParams.delete('clickedId'); // Also remove clickedId when closing
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const toggleView = () => {
    const newType = viewType === 'experience' ? 'grid' : 'experience';
    setViewType(newType);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('view', newType);
    if (newType === 'grid') {
      newParams.delete('product'); // Close side panel when leaving canvas
      newParams.delete('clickedId'); // Also remove clickedId
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <>
      <ExperienceFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        viewType={viewType}
        onToggleView={toggleView}
      />

      {/* Product Detail Panel Overlay */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductSidePanel 
            product={selectedProduct} 
            clickedId={clickedId}
            onClose={handleClosePanel} 
          />
        )}
      </AnimatePresence>

      {viewType === 'experience' ? (
        <ExperienceView 
          products={products} 
          onProductClick={handleProductClick} 
        />
      ) : (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row gap-12">
              {/* Legacy Grid Content */}
              <main className="flex-grow w-full">
                <div className="flex justify-between items-center mb-10">
                  <h1 className="text-3xl font-serif text-white">{selectedCategory === 'All' ? 'The Collection' : selectedCategory}</h1>
                  <span className="text-sm text-white/30">{products.length} Pieces</span>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-20 text-white/40">
                    No products found in this category.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 ml:grid-cols-3 lg:grid-cols-4 gap-6">
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
      )}
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-serif text-2xl text-white">Loading Collection...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * useProducts — fetches the product catalog from the real backend API.
 * Falls back to an empty array while loading.
 */
export function useProducts(): any[] {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        // Fetch up to 500 products (more than enough for the catalog)
        const res = await fetch(`${API_BASE}/products?limit=500`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        // Backend returns { products, page, pages } — extract the array
        setProducts(Array.isArray(data) ? data : (data.products ?? []));
      } catch (e) {
        console.error('[useProducts] Failed to fetch products from API:', e);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return products;
}

// Keep legacy export for backward compat — now just an alias
export const getAdminProducts = () => [];

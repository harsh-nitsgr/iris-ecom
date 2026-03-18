import { useState, useEffect } from 'react';
import { PRODUCTS, Product } from './products';

const STORAGE_KEY = 'admin_products';

/**
 * useProducts — returns the current product catalog.
 * Admin edits are saved to localStorage under 'admin_products'.
 * This hook reads localStorage first and falls back to the static PRODUCTS array.
 * This ensures admin portal changes are immediately reflected on the site.
 */
export function useProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setProducts(JSON.parse(raw));
        return;
      } catch {}
    }
    setProducts(PRODUCTS);
  }, []);

  return products;
}

/**
 * getAdminProducts — synchronous read for use outside React components.
 */
export function getAdminProducts(): Product[] {
  if (typeof window === 'undefined') return PRODUCTS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }
  return PRODUCTS;
}

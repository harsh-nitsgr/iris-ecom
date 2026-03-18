import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

export interface CartItem {
  _id?: string;
  product: any; // We'll fully type this later based on Product schema
  size: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, size: string, qty: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQty: (itemId: string, qty: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.get('/cart');
          set({ items: data.cartItems || [], isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      addToCart: async (productId, size, qty) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/cart', { productId, size, qty });
          set({ items: data.cartItems, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      removeFromCart: async (itemId) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.delete(`/cart/${itemId}`);
          set({ items: data.cartItems, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateQty: async (itemId, qty) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.put(`/cart/${itemId}`, { qty });
          set({ items: data.cartItems, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      clearCart: () => {
        set({ items: [] });
      }
    }),
    {
      name: 'cart-storage',
      // We only persist the items locally just in case, but rely on DB sync
    }
  )
);

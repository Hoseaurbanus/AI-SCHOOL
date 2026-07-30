import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (courseId: string) => void;
  removeItem: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (courseId: string) => {
        if (!get().isInCart(courseId)) {
          set((state) => ({
            items: [...state.items, { courseId, addedAt: new Date().toISOString() }],
          }));
        }
      },

      removeItem: (courseId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.courseId !== courseId),
        }));
      },

      clearCart: () => set({ items: [] }),

      isInCart: (courseId: string) => {
        return get().items.some((item) => item.courseId === courseId);
      },

      getItemCount: () => get().items.length,
    }),
    {
      name: 'smugflex-cart',
    }
  )
);

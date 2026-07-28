"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesState = {
  productIds: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
};

/**
 * Estado global de favoritos. Persistido en localStorage para invitados;
 * si el usuario tiene sesion iniciada, se sincroniza con la tabla
 * `favorites` a traves de src/app/api/favorites/route.ts.
 */
export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      productIds: [],

      toggleFavorite: (productId) => {
        set((state) => {
          const exists = state.productIds.includes(productId);
          return {
            productIds: exists
              ? state.productIds.filter((id) => id !== productId)
              : [...state.productIds, productId],
          };
        });
      },

      isFavorite: (productId) => get().productIds.includes(productId),

      clearFavorites: () => set({ productIds: [] }),
    }),
    {
      name: "patin-shop-favorites",
    }
  )
);

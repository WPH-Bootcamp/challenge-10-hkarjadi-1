'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthUser = {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
};

type AuthState = {
  token: string | null;

  user: AuthUser | null;

  hasHydrated: boolean;

  setAuth: (token: string, user?: AuthUser | null) => void;

  clearAuth: () => void;

  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hasHydrated: false,

      setAuth: (token, user = null) => {
        set({
          token,
          user,
        });
      },

      clearAuth: () => {
        set({
          token: null,
          user: null,
        });
      },

      setHasHydrated: (value) => {
        set({
          hasHydrated: value,
        });
      },
    }),
    {
      name: 'restaurant-auth',

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },

      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

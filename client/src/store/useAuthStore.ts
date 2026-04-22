import { create } from 'zustand';

interface AuthState {
  user: any | null;
  setAuth: (userData: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setAuth: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
}));
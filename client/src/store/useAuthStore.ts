// previously with authContext it had checkAuth() and useEffect calling checkAuth(), which ran automatically
// with zustand you choose when you call it. in the components you need, import checkAuth from the store and wrap it in a useEffect

import { create } from 'zustand';

interface AuthState {
  user: any | null;
  setAuth: (userData: any) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isCheckingAuth: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setAuth: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      // Note: No need for a token in headers because the browser 
      // sends the HTTP-only cookie automatically.
      const response = await fetch("http://localhost:5000/api/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        set({ user: data, isCheckingAuth: false });
      } else {
        set({ user: null, isCheckingAuth: false });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ user: null, isCheckingAuth: false });
    }
  },
}));
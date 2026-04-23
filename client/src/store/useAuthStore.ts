// previously with authContext it had checkAuth() and useEffect calling checkAuth(), which ran automatically
// with zustand you choose when you call it. in the components you need, import checkAuth from the store and wrap it in a useEffect

import { create } from "zustand";
import axios from "axios";
import { type UserType } from "../types/UserTypes"

interface AuthState {
  user: UserType | null;
  setAuth: (userData: UserType) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isCheckingAuth: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isCheckingAuth: true,
  setAuth: (userData) => set({ user: userData }),

  logout: async () => {
    try {
      // Call the backend to clear the cookie
      await axios.get(
        "http://localhost:5000/api/logout",
        {
          withCredentials: true,
        },
      );

      set({ user: null });
    } catch (error) {
      set({ user: null });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get("http://localhost:5000/api/me", {
        withCredentials: true, // Requried for sending the HTTP-only cookie with Axios
        headers: { "Content-Type": "application/json" },
      });

      // Status is 2xx
      set({ user: response.data, isCheckingAuth: false });
    } catch (error) {
      // Status is 401, 403, 500, etc.
      console.error("Auth check failed:", error);
      set({ user: null, isCheckingAuth: false });
    }
  },
}));

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the store
const useUserStore = create(
  persist(
    (set) => ({
      token: null,
      role: null,
      skills: [],
      interests: [],
      // Function to update the token and role
      setToken: (token) => set({ token }),
      setRole: (role) => set({ role }),
      setSkills: (skills) => set({ skills }),
      setInterests: (interests) => set({ interests }),

      // Function to clear the token and role
      clearToken: () => set({ token: null }),
      clearRole: () => set({ role: null }),
      clearSkills: () => set({ skills: [] }),
      clearInterests: () => set({ interests: [] }),
    }),
    {
      name: "userTokenStore",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token }), // Persist only the token
    }
  )
);

export default useUserStore;

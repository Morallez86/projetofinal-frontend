import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the store
const useUserStore = create(
  persist(
    (set) => ({
      token: null,
      role: null,
      username: null,
      userId: null,
      profileImage: null,
      skills: [],
      interests: [],
      projectTimestamps: {},
      // Function to update the token and role
      setToken: (token) => set({ token }),
      setRole: (role) => set({ role }),
      setUsername: (username) => set({ username }),
      setUserId: (userId) => set({ userId }),
      setProfileImage: (imageUrl) => set({ profileImage: imageUrl }),
      setSkills: (skills) => set({ skills }),
      setInterests: (interests) => set({ interests }),
      setProjectTimestamp: (projectId, timestamp) => set((state) => ({
        projectTimestamps: { ...state.projectTimestamps, [projectId]: timestamp },
      })),

      // Function to clear the token and role
      clearToken: () => set({ token: null }),
      clearRole: () => set({ role: null }),
      clearUsername: () => set({ username: null }),
      clearUserId: () => set({ userId: null }),
      clearProfileImage: () => set({profileImage: null}),
      clearSkills: () => set({ skills: [] }),
      clearInterests: () => set({ interests: [] }),
    }),
    {
      name: "userTokenStore",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // Include both token and projectTimestamps in the persisted state
        token: state.token,
        projectTimestamps: state.projectTimestamps,
      }),
    }
  )
);

export default useUserStore;

import create from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useInterestStore = create(
  persist(
    (set) => ({
      interests: [],
      setInterests: (interests) => set({ interests }),
      addInterest: (newInterest) =>
        set((state) => ({
          interests: [...state.interests, newInterest],
        })),
    }),
    {
      name: "interestStorage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useInterestStore;

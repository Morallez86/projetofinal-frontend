import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useInterestStore = create(
  persist(
    (set) => ({
      interests: [],
      setInterests: (interests) => set({ interests }),
    }),
    {
      name: "interestStorage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useInterestStore;

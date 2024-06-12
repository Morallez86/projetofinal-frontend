import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useWorkplaceStore = create(
  persist(
    (set) => ({
      workplaces: [],
      setWorkplaces: (workplaces) => set({ workplaces }),
    }),
    {
      name: "workplaceStorage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useWorkplaceStore;

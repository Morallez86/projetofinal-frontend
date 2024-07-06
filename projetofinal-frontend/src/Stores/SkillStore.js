import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useSkillStore = create(
  persist(
    (set) => ({
      skills: [],
      setSkills: (skills) => set({ skills }),
      addSkill: (newSkill) =>
        set((state) => ({
          skills: [...state.skills, newSkill],
        })),
      clearSkills: () => set({ skills: [] }),
    }),
    {
      name: "skillStorage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useSkillStore;

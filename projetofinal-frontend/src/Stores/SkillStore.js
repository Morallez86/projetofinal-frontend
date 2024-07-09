import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Definição da store para armazenar as competências
const useSkillStore = create(
  persist(
    (set) => ({
      //Estados iniciais
      skills: [],
      //Funções para atualizar os estados
      setSkills: (skills) => set({ skills }),
      addSkill: (newSkill) =>
        set((state) => ({
          skills: [...state.skills, newSkill],
        })),
        //Funções para limpar os estados
      clearSkills: () => set({ skills: [] }),
    }),
    {
      // Configuração do middleware persist
      name: "skillStorage",
      storage: createJSONStorage(() => sessionStorage), // Define o armazenamento em sessionStorage
    }
  )
);

// Exporta a store
export default useSkillStore;

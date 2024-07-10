import create from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Definição da store para armazenar os interesses
const useInterestStore = create(
  persist(
    (set) => ({
      //Estados iniciais
      interests: [],
      //Funções para atualizar os estados
      setInterests: (interests) => set({ interests }),
      addInterest: (newInterest) =>
        set((state) => ({
          interests: [...state.interests, newInterest],
        })),
      //Funções para limpar os estados
      clearInterests: () => set({ interests: [] }),
    }),
    {
      // Configuração do middleware persist
      name: "interestStorage",
      storage: createJSONStorage(() => sessionStorage), // Define o armazenamento em sessionStorage
    }
  )
);

// Exporta a store
export default useInterestStore;

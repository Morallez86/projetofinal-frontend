import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Definição da store para armazenar os locais de trabalho
const useWorkplaceStore = create(
  persist(
    (set) => ({
      //Estados iniciais
      workplaces: [],
      //Funções para atualizar os estados
      setWorkplaces: (workplaces) => set({ workplaces }),
    }),
    {
      // Configuração do middleware persist
      name: "workplaceStorage",
      storage: createJSONStorage(() => sessionStorage), // Define o armazenamento em sessionStorage
    }
  )
);

// Exporta a store
export default useWorkplaceStore;

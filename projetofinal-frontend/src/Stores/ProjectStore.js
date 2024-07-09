import { create } from "zustand";

//Definição da store para armazenar os dados do projeto
const useProjectStore = create((set) => ({
  // Estados iniciais
  projectId: null,
  projectName: null,
  projectDescription: null,
  projectSkills: [],
  projectInterests: [],
  projectComponents: [],
  projectResources: [],
  projectUsers: [],

  // Funções para atualizar os estados
  setProjectId: (projectId) => set({ projectId }),
  setProjectName: (projectName) => set({ projectName }),
  setProjectDescription: (projectDescription) => set({ projectDescription }),
  setProjectSkills: (skills) => set({ projectSkills: skills }),
  setProjectInterests: (interests) => set({ projectInterests: interests }),
  setProjectComponents: (components) => set({ projectComponents: components }),
  setProjectResources: (resources) => set({ projectResources: resources }),
  setProjectUsers: (users) => set({ projectUsers: users }),

  // Funções para limpar os estados
  clearProjectId: () => set({ projectId: null }),
  clearProjectName: () => set({ projectName: null }),
  clearProjectDescription: () => set({ projectDescription: null }),
  clearProjectSkills: () => set({ projectSkills: [] }),
  clearProjectInterests: () => set({ projectInterests: [] }),
  clearProjectComponents: () => set({ projectComponents: [] }),
  clearProjectResources: () => set({ projectResources: [] }),
  clearProjectUsers: () => set({ projectUsers: [] }),

  // Função para limpar todos os estados
  clearAllProjectDetails: () =>
    set({
      projectId: null,
      projectName: null,
      projectDescription: null,
      projectSkills: [],
      projectInterests: [],
      projectComponents: [],
      projectResources: [],
      projectUsers: [],
    }),
}));

// Exporta a store
export default useProjectStore;

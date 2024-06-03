import { create } from "zustand";

// Define the store
const useProjectStore = create((set) => ({
  projectId: null,
  projectName: null,
  projectDescription: null,
  projectSkills: [],
  
  // Functions to update the project details
  setProjectId: (projectId) => set({ projectId }),
  setProjectName: (projectName) => set({ projectName }),
  setProjectDescription: (projectDescription) => set({ projectDescription }),
  setProjectSkills: (skills) => set({ projectSkills: skills }),

  // Functions to clear the project details
  clearProjectId: () => set({ projectId: null }),
  clearProjectName: () => set({ projectName: null }),
  clearProjectDescription: () => set({ projectDescription: null }),
  clearProjectSkills: () => set({ projectSkills: [] }),
}));

export default useProjectStore;

import { create } from "zustand";

// Define the store
const useProjectStore = create((set) => ({
  projectId: null,
  projectName: null,
  projectDescription: null,
  projectSkills: [],
  projectInterests: [], // Add projectInterests to the store

  // Functions to update the project details
  setProjectId: (projectId) => set({ projectId }),
  setProjectName: (projectName) => set({ projectName }),
  setProjectDescription: (projectDescription) => set({ projectDescription }),
  setProjectSkills: (skills) => set({ projectSkills: skills }),
  setProjectInterests: (interests) => set({ projectInterests: interests }), // Add setProjectInterests

  // Functions to clear the project details
  clearProjectId: () => set({ projectId: null }),
  clearProjectName: () => set({ projectName: null }),
  clearProjectDescription: () => set({ projectDescription: null }),
  clearProjectSkills: () => set({ projectSkills: [] }),
  clearProjectInterests: () => set({ projectInterests: [] }), // Add clearProjectInterests
}));

export default useProjectStore;

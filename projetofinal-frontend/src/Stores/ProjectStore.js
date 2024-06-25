import { create } from "zustand";

// Define the store
const useProjectStore = create((set) => ({
  projectId: null,
  projectName: null,
  projectDescription: null,
  projectSkills: [],
  projectInterests: [],
  projectComponents: [],
  projectResources: [],
  projectUsers: [],

  // Functions to update the project details
  setProjectId: (projectId) => set({ projectId }),
  setProjectName: (projectName) => set({ projectName }),
  setProjectDescription: (projectDescription) => set({ projectDescription }),
  setProjectSkills: (skills) => set({ projectSkills: skills }),
  setProjectInterests: (interests) => set({ projectInterests: interests }),
  setProjectComponents: (components) => set({ projectComponents: components }),
  setProjectResources: (resources) => set({ projectResources: resources }),
  setProjectUsers: (users) => set({ projectUsers: users }),

  // Functions to clear individual project details
  clearProjectId: () => set({ projectId: null }),
  clearProjectName: () => set({ projectName: null }),
  clearProjectDescription: () => set({ projectDescription: null }),
  clearProjectSkills: () => set({ projectSkills: [] }),
  clearProjectInterests: () => set({ projectInterests: [] }),
  clearProjectComponents: () => set({ projectComponents: [] }),
  clearProjectResources: () => set({ projectResources: [] }),
  clearProjectUsers: () => set({ projectUsers: [] }),

  // Function to clear all project details
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

export default useProjectStore;

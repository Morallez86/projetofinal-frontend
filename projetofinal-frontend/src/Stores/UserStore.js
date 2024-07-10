import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Definição da store para armazenar os dados do utilizador
const useUserStore = create(
  persist(
    //Estados iniciais
    (set) => ({
      token: null,
      role: null,
      username: null,
      userId: null,
      profileImage: null,
      skills: [],
      interests: [],
      projectTimestamps: {},
      language: null,

      //Funções para atualizar os estados
      setToken: (token) => set({ token }),
      setRole: (role) => set({ role }),
      setUsername: (username) => set({ username }),
      setUserId: (userId) => set({ userId }),
      setProfileImage: (imageUrl) => set({ profileImage: imageUrl }),
      setSkills: (skills) => set({ skills }),
      setInterests: (interests) => set({ interests }),
      setProjectTimestamp: (projectId, timestamp) => set((state) => ({
        projectTimestamps: { ...state.projectTimestamps, [projectId]: timestamp },
      })),
      setLanguage: (language) => set({ language }),


      //Funções para limpar os estados
      clearToken: () => set({ token: null }),
      clearRole: () => set({ role: null }),
      clearUsername: () => set({ username: null }),
      clearUserId: () => set({ userId: null }),
      clearProfileImage: () => set({profileImage: null}),
      clearSkills: () => set({ skills: [] }),
      clearInterests: () => set({ interests: [] }),
      clearProjectTimestamps: () => set({ projectTimestamps: {} }),
    }),
    {
      // Configuração do middleware persist
      name: "userTokenStore",
      storage: createJSONStorage(() => sessionStorage), // Define o armazenamento em sessionStorage
      partialize: (state) => ({
        // Define quais estados serão persistidos
        token: state.token,
        projectTimestamps: state.projectTimestamps,
        language: state.language,
      }),
    }
  )
);

// Exporta a store
export default useUserStore;

// src/Stores/apiStore.js
import { create } from 'zustand';

const useApiStore = create((set) => ({
    apiUrl: 'https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest',
    setApiUrl: (url) => set({ apiUrl: url }),
}));

export default useApiStore;
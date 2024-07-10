// src/Stores/apiStore.js
import { create } from 'zustand';

// Definição da store para armazenar a URL da API
const useApiStore = create((set) => ({
    // Estado inicial
    apiUrl: 'https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest',
    // Função para atualizar o estado
    setApiUrl: (url) => set({ apiUrl: url }),
}));

// Exporta a store
export default useApiStore;
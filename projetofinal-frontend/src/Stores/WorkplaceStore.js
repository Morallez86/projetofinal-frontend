import { create } from 'zustand';

const useWorkplaceStore = create((set) => ({
  workplaces: [],
  setWorkplaces: (workplaces) => set({ workplaces }),
  
}));

export default useWorkplaceStore;

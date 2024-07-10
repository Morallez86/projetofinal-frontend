import { useEffect } from "react";
import { getWorkplaces } from "../Services/workplaceService";
import useWorkplaceStore from "../Stores/WorkplaceStore";

const useWorkplaces = () => {
  const setWorkplaces = useWorkplaceStore((state) => state.setWorkplaces); // setWorkplaces
  const workplaces = useWorkplaceStore((state) => state.workplaces); // locais de trabalho

  useEffect(() => {
    
    if (!workplaces || workplaces.length === 0) { // se os locais de trabalho não existirem 
      const fetchData = async () => { // fetch dos locais de trabalho
        try {
          const data = await getWorkplaces();
          setWorkplaces(data);
        } catch (error) {
          console.error("Error fetching workplaces:", error);
        }
      };
      fetchData();
    }
  }, [workplaces, setWorkplaces]); // dependências

  return { workplaces };
};

export default useWorkplaces;

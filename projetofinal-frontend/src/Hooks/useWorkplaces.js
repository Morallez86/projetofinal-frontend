import { useEffect } from 'react';
import { getWorkplaces } from '../Services/workplaceService';
import useWorkplaceStore from '../Stores/WorkplaceStore';

const useWorkplaces = () => {
  const setWorkplaces = useWorkplaceStore((state) => state.setWorkplaces);
  const workplaces = useWorkplaceStore((state) => state.workplaces);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkplaces();
        setWorkplaces(data);
      } catch (error) {
        console.error("Error fetching workplaces:", error);
      }
    };

    fetchData();
  }, [setWorkplaces]);

  return { workplaces };
};

export default useWorkplaces;

import useApiStore from '../Stores/ApiStore';

const apiUrl = useApiStore.getState().apiUrl; // apiUrl

export const getWorkplaces = async () => { // função para obter os locais de trabalho
  try {
    const response = await fetch(
      `${apiUrl}/workplaces`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) { // se o status for 200
      const data = await response.json();
      return data;
    } else if (response.status === 404) { // se o status for 404
      
      return [];
    } else { // se não
      throw new Error("Failed to fetch workplaces");
    }
  } catch (error) { // erro
    console.error("Error fetching workplaces:", error);
    throw error;
  }
};

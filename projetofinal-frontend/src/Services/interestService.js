import useApiStore from "../Stores/ApiStore";

const apiUrl = useApiStore.getState().apiUrl; // apiUrl

export const getInterests = async (token) => { // função para obter os interesses
  try {
    const response = await fetch(`${apiUrl}/interests`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) { // se o status for 200
      const data = await response.json();
      return data;
    } else if (response.status === 404) { // se o status for 404
      
      return [];
    } else { // se não
      throw new Error("Failed to fetch interests");
    }
  } catch (error) {
    console.error("Error fetching interests:", error);
    throw error;
  }
};

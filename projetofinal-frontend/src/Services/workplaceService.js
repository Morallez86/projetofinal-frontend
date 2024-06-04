import useApiStore from '../Stores/ApiStore';

const apiUrl = useApiStore.getState().apiUrl;

export const getWorkplaces = async () => {
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

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else if (response.status === 404) {
      console.log("Workplaces not found");
      return [];
    } else {
      throw new Error("Failed to fetch workplaces");
    }
  } catch (error) {
    console.error("Error fetching workplaces:", error);
    throw error;
  }
};

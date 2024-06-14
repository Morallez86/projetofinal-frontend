import useApiStore from "../Stores/ApiStore";

const apiUrl = useApiStore.getState().apiUrl;

export const getInterests = async (token) => {
  try {
    const response = await fetch(`${apiUrl}/interests`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else if (response.status === 404) {
      console.log("Interests not found");
      return [];
    } else {
      throw new Error("Failed to fetch interests");
    }
  } catch (error) {
    console.error("Error fetching interests:", error);
    throw error;
  }
};

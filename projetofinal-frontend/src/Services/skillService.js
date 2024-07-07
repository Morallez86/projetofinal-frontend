import useApiStore from "../Stores/ApiStore";

const apiUrl = useApiStore.getState().apiUrl;

export const getSkills = async (token, navigate) => {
  try {
    const response = await fetch(`${apiUrl}/skills`, {
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
      console.log("Skills not found");
      return [];
    } else if (response.status === 401) {
      const data = await response.json();
      const errorMessage = data.message || "Unauthorized";

      if (errorMessage === "Invalid token") {
        handleSessionTimeout(navigate); // Session timeout
        return; // Exit early if session timeout
      } else {
        console.error("Error updating seen status:", errorMessage);
      }
    } else {
      throw new Error("Failed to fetch skills");
    }
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
};

const handleSessionTimeout = (navigate) => {
  navigate("/");
};
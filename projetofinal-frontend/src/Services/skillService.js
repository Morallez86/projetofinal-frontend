import useApiStore from "../Stores/ApiStore";

const apiUrl = useApiStore.getState().apiUrl; // apiUrl

export const getSkills = async (token, navigate) => { // função para obter as skills
  try {
    const response = await fetch(`${apiUrl}/skills`, {
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
    } else if (response.status === 401) { // se o status for 401
      const data = await response.json();
      const errorMessage = data.message || "Unauthorized";

      if (errorMessage === "Invalid token") {
        handleSessionTimeout(navigate); // timeout da sessão
        return; 
      } else { // erro
        console.error("Error updating seen status:", errorMessage);
      }
    } else { // erro
      throw new Error("Failed to fetch skills");
    }
  } catch (error) { // erro
    console.error("Error fetching skills:", error);
    throw error;
  }
};

const handleSessionTimeout = (navigate) => { // função para timeout da sessão
  navigate("/"); // navegar para a página inicial
};
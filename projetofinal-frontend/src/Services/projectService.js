import useApiStore from '../Stores/ApiStore';

const apiUrl = useApiStore.getState().apiUrl; // apiUrl


export const createProject = async (projectInfo, token) => { // função para criar um projeto
  
  try {
    const response = await fetch(`${apiUrl}/projects`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectInfo),
    });

    if (response.status === 201) { // se o status for 201
      return true;
    } else { // se não
      
      throw new Error("Error creating project");
    }
  } catch (error) { // erro
    
    console.error("Error creating project:", error);
    throw error;
  }
};

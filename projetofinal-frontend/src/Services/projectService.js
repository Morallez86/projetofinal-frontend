import useApiStore from '../Stores/ApiStore';

const apiUrl = useApiStore.getState().apiUrl;

export const createProject = async (projectInfo) => {
  try {
    const response = await fetch(`${apiUrl}/projects`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectInfo),
    });

    if (response.status === 201) {
      return await response.json();
    } else {
      throw new Error("Error creating project");
    }
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

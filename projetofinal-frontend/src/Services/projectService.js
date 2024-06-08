import useApiStore from '../Stores/ApiStore';

const apiUrl = useApiStore.getState().apiUrl;


export const createProject = async (projectInfo, token) => {
  console.log(projectInfo)
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

    if (response.status === 201) {
      return true;
    } else {
      console.log("2");
      throw new Error("Error creating project");
    }
  } catch (error) {
    console.log("3")
    console.error("Error creating project:", error);
    throw error;
  }
};

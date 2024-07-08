// Assuming apiUrl, projectId, and token are defined elsewhere in your application
const apiUrl = 'https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest';
const projectId = '123';
const token = 'your_token_here';

const getUsersFromProject = () => {
  return fetch(`${apiUrl}/projects/${projectId}/users`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        return response.json(); // Return the users' data
      } else if (response.status === 401) {
        const error = await response.json();
        if (error.errorMessage === "Invalid token") {
          throw new Error("Invalid token"); // Throw an error for invalid token
        }
        throw new Error("Unauthorized"); // Throw a generic unauthorized error
      } else {
        throw new Error("An unexpected error occurred"); // Handle other errors
      }
    });
};

module.exports = { getUsersFromProject };
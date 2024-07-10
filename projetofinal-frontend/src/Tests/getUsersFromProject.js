
const apiUrl = 'https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest';
const projectId = '123';
const token = 'your_token_here';

const getUsersFromProject = () => { // função para obter os utilizadores do projeto
  return fetch(`${apiUrl}/projects/${projectId}/users`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => { 
      if (response.status === 200) { // Se a resposta for 200
        return response.json(); 
      } else if (response.status === 401) {  // Se a resposta for 401
        const error = await response.json();
        if (error.errorMessage === "Invalid token") {
          throw new Error("Invalid token"); // Lança um erro de token inválido
        }
        throw new Error("Unauthorized"); // Lança um erro de acesso não autorizado
      } else {
        throw new Error("An unexpected error occurred"); // Lança um erro inesperado
      }
    });
};

module.exports = { getUsersFromProject };
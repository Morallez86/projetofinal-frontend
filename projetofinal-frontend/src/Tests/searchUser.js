const fetch = require('node-fetch');

async function searchUser(apiUrl, inputValue, token) { // Função para pesquisar usuário
  const response = await fetch(
    `https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/users/search?query=${inputValue}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 200) { // Se o status for 200
    const data = await response.json();
    return { status: 200, data }; // Retorna os dados em caso de sucesso
  } else if (response.status === 401) { // Se o status for 401
    return { status: 401, error: 'Unauthorized: Access is denied due to invalid credentials.' }; // Retorna a mensagem de erro
  } else if (response.status === 404) { // Se o status
    return { status: 404, error: 'Not Found: The specified user could not be found.' }; // Retorna a mensagem de erro
  } else { // Se não
    const error = await response.text();
    return { status: response.status, error }; // Retorna a mensagem de erro
  }
}

module.exports = { searchUser };
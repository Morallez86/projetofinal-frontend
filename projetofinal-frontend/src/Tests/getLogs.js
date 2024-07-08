const fetch = require('node-fetch');

async function getLogs(apiUrl, projectId, token, formData) {
  const response = await fetch(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/projectHistory/${projectId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (response.status === 401) {
    const errorResponse = await response.json(); // Assumindo que a mensagem de erro está em formato JSON
    const errorMessage = errorResponse.message; // Assumindo que a mensagem de erro está armazenada em um campo 'message'

    if (errorMessage === "Invalid token") {
      // Aqui você pode lidar com o erro específico de "Invalid token", por exemplo, tentar atualizar o token, deslogar o usuário, mostrar uma mensagem de erro, etc.
      throw new Error('Unauthorized: Invalid token.');
    } else {
      // Lidar com outros erros de 401 que não sejam "Invalid token"
      throw new Error('Unauthorized: Access is denied due to invalid credentials.');
    }
  } else if (!response.ok) {
    // Lidar com outros erros HTTP
    const errorText = await response.text();
    throw new Error(errorText);
  }

  // Se a resposta estiver OK, parse e retorne os dados
  const data = await response.json();
  return data;
}

module.exports = { getLogs };
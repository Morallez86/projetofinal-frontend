const fetch = require('node-fetch'); // Importa o módulo node-fetch para fazer requisições HTTP

async function addNotification(token, user, projectInfo, type) { // Função para adicionar notificação
  const response = await fetch(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/notifications`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      receiverId: user.id,
      type: type,
      projectId: projectInfo.id,
    }),
  });

  if (response.ok) { // Se a resposta for ok
    const data = await response.json();
    return data;   // Retorna os dados
  } else if (response.status === 401) {
    throw new Error('Unauthorized: Access is denied due to invalid credentials.');
  } else {
    
    const errorText = await response.text();
    throw new Error(errorText);
  }
}

module.exports = { addNotification };
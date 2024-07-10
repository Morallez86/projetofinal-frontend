const fetch = require('node-fetch');

async function createChatMsg(token, projectId, message, usernameFromToken, userIdFromToken) { // Função para criar mensagem de chat
    try {
      const response = await fetch(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/projects/createChatMsg`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: projectId,
          content: message,
          senderUsername: usernameFromToken,
          senderId: userIdFromToken,
          senderOnline: true,
        }),
      });
  
      if (response.status === 201) { //   Se o status for 201
        const data = await response.json();
        return data; // Retorna os dados em caso de sucesso
      } else {
        const errorResponse = await response.json(); // Caso contrário, retorna a mensagem de erro
        return { error: errorResponse.error || 'Unknown Error', status: response.status }; 
      }
    } catch (error) {
      return { error: error.message }; // Retorna a mensagem de erro
    }
  }

module.exports = { createChatMsg };
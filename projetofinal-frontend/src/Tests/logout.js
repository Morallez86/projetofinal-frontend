const fetch = require('node-fetch');

async function logoutUser(apiUrl, token, projectTimestamps) { // Função para fazer logout do usuário
    try {
      const response = await fetch(`${apiUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectTimestamps }),
      });
  
      if (response.ok) { // Se a resposta for ok
        const data = await response.json(); 
        return { success: true, data }; // Retorna um objeto indicando sucesso e os dados
      } else {
        const errorResponse = await response.json(); 
        return { error: errorResponse.error || 'Unknown Error', status: response.status }; // Retorna um objeto de erro
      }
    } catch (error) {
      return { error: error.message }; // Retorna um objeto de erro em caso de falha na requisição
    }
  }

  module.exports = { logoutUser };
const fetch = require('node-fetch');

async function getLogs(apiUrl, projectId, token, formData) { // Função para obter logs
  const response = await fetch(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/projectHistory/${projectId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (response.status === 401) {
    const errorResponse = await response.json(); 
    const errorMessage = errorResponse.message;   

    if (errorMessage === "Invalid token") { // Se o token for inválido
       
      throw new Error('Unauthorized: Invalid token.');
    } else { // Se não
     
      throw new Error('Unauthorized: Access is denied due to invalid credentials.');
    }
  } else if (!response.ok) { // Se a resposta não for ok
   
    const errorText = await response.text();
    throw new Error(errorText);
  }

  
  const data = await response.json();
  return data;
}

module.exports = { getLogs };
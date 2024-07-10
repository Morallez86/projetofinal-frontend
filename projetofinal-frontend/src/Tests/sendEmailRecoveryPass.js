const fetch = require('node-fetch');

async function sendEmailRecoveryPass(email) { // Função para enviar email de recuperação de senha
  try {
    const response = await fetch(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/users/emailRecoveryPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) { // Se a resposta for ok
      const data = await response.json();
      return { status: 200, data: data };  // Retorna os dados
    } else {
      const errorData = await response.json();
      return { status: response.status, error: errorData }; // Retorna o status e a mensagem de erro
    }
  } catch (error) {
    return { status: 500, error: 'Internal Server Error' }; // Retorna o status e a mensagem de erro
  }
}

module.exports = { sendEmailRecoveryPass };
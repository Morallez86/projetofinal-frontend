const fetch = require('node-fetch');

async function sendEmailRecoveryPass(email) {
  try {
    const response = await fetch(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/users/emailRecoveryPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();
      return { status: 200, data: data }; // Adjusted to match the format
    } else {
      const errorData = await response.json();
      return { status: response.status, error: errorData }; // Adjusted to include the error data directly
    }
  } catch (error) {
    return { status: 500, error: 'Internal Server Error' }; // Adjusted to match the format
  }
}

module.exports = { sendEmailRecoveryPass };
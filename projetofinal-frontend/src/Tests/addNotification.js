const fetch = require('node-fetch');

async function addNotification(token, user, projectInfo, type) {
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

  if (response.ok) {
    const data = await response.json();
    return data; // Assuming the response contains some data on success
  } else if (response.status === 401) {
    throw new Error('Unauthorized: Access is denied due to invalid credentials.');
  } else {
    // Handle other errors or statuses as needed
    const errorText = await response.text();
    throw new Error(errorText);
  }
}

module.exports = { addNotification };
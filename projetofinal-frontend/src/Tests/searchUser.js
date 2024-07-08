const fetch = require('node-fetch');

async function searchUser(apiUrl, inputValue, token) {
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

  if (response.status === 200) {
    const data = await response.json();
    return { status: 200, data };
  } else if (response.status === 401) {
    return { status: 401, error: 'Unauthorized: Access is denied due to invalid credentials.' };
  } else if (response.status === 404) {
    return { status: 404, error: 'Not Found: The specified user could not be found.' };
  } else {
    const error = await response.text();
    return { status: response.status, error };
  }
}

module.exports = { searchUser };
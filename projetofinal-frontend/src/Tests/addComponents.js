const fetch = require('node-fetch');

async function fetchComponents(token, workplaceId, componentData) {
    const apiUrl = `https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/components/add?workplaceId=${workplaceId}`;
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(componentData),
        });

        if (response.ok) {
            const responseData = await response.json();
            return { status: 200, data: responseData };
        } else {
            return { status: response.status, error: 'Error adding component' };
        }
    } catch (error) {
        return { status: 500, error: 'Internal Server Error' };
    }
}

module.exports = { fetchComponents };
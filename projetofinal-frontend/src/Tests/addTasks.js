const fetch = require('node-fetch');

async function addTasks(token, projectId, taskData) {
    const apiUrl = `https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/tasks/add?projectId=${projectId}`;
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(taskData),
        });

        if (response.ok) {
            const responseData = await response.json();
            return { status: 200, data: responseData };
        } else {
            return { status: response.status, error: 'Error adding task' };
        }
    } catch (error) {
        return { status: 500, error: 'Internal Server Error' };
    }
}

module.exports = { addTasks };
const fetch = require('node-fetch');

async function addTasks(token, projectId, taskData) { // Função para adicionar tarefas
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

        if (response.ok) { // Se a resposta for ok
            const responseData = await response.json();
            return { status: 200, data: responseData }; // Retorna um objeto com o status da resposta e os dados retornados
        } else { // Se não
            return { status: response.status, error: 'Error adding task' };
        }
    } catch (error) { // Erro
        return { status: 500, error: 'Internal Server Error' };
    }
}

module.exports = { addTasks };
// Importa o módulo node-fetch para fazer requisições HTTP
const fetch = require('node-fetch');

//Função assíncrona para adicionar componentes a um local de trabalho
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

        // Verifica se o status da resposta é OK (código de status 200)
        if (response.ok) {
            const responseData = await response.json();
            // Retorna um objeto com o status da resposta e os dados retornados
            return { status: 200, data: responseData };
        } else {
            // Retorna um objeto com o status da resposta e a mensagem de erro
            return { status: response.status, error: 'Error adding component' };
        }
    } catch (error) {
        // Retorna um objeto com o status da resposta e a mensagem de erro
        return { status: 500, error: 'Internal Server Error' };
    }
}

// Exporta a função fetchComponents
module.exports = { fetchComponents };
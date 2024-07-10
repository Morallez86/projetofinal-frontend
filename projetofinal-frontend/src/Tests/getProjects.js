const fetch = require('node-fetch');

const fetchProjects = async (token, searchTerm, skills, interests) => { // função para buscar projetos
    if (!token.startsWith('eyJhbGciOiJIUzI1NiJ9')) { // se o token não começar com 'eyJhb
        return { status: 401 }; // retorna status 401
    } 

    const apiUrl = "https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest"; 
    const params = new URLSearchParams();

    if (searchTerm) {
        params.append("searchTerm", searchTerm);    // adiciona o searchTerm aos parâmetros
    }
    if (skills) {
        params.append("skills", skills);   // adiciona as skills aos parâmetros
    }
    if (interests) {
        params.append("interests", interests);  // adiciona os interesses aos parâmetros
    }

    try {
        const response = await fetch(`${apiUrl}/projects?${params.toString()}`, { // faz a requisição para a API
            method: "GET",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) { // se a resposta for ok
            const data = await response.json();
            return { status: 200, text: JSON.stringify(data.projects) }; // retorna um objeto com o status da resposta e os dados
        } else {
            return { status: response.status, text: 'Error fetching projects' }; // se não, retorna um objeto com o status da resposta e a mensagem de erro
        }
    }
    catch (error) {
            return { status: 500, text: 'Internal Server Error' }; // retorna um objeto com o status da resposta e a mensagem de erro
        }
    } 


module.exports = { fetchProjects };
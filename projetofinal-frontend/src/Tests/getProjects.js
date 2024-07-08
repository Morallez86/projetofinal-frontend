const fetch = require('node-fetch');

const fetchProjects = async (token, searchTerm, skills, interests) => {
    if (!token.startsWith('eyJhbGciOiJIUzI1NiJ9')) {
        return { status: 401 };
    }

    const apiUrl = "https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest";
    const params = new URLSearchParams();

    if (searchTerm) {
        params.append("searchTerm", searchTerm);
    }
    if (skills) {
        params.append("skills", skills);
    }
    if (interests) {
        params.append("interests", interests);
    }

    try {
        const response = await fetch(`${apiUrl}/projects?${params.toString()}`, {
            method: "GET",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return { status: 200, text: JSON.stringify(data.projects) };
        } else {
            return { status: response.status, text: 'Error fetching projects' };
        }
    }
    catch (error) {
            // Log the error or handle it as needed
            console.error('Fetch error:', error);
            return { status: 500, text: 'Internal Server Error' };
        }
    } 


module.exports = { fetchProjects };
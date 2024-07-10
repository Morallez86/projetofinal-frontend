const fetchAddSkills = async (skills) => { // função para adicionar skills
    if (!token.startsWith('eyJhbGciOiJIUzI1NiJ9')) { // se o token não começar com 'eyJhb
        return { status: 401 };     // retorna status 401
    }
    else {
        const exampleResponse = JSON.stringify(skills);
        return { status: 200, text: exampleResponse }; // retorna status 200 e o JSON de exemplo
    }
};

module.exports = { fetchAddSkills };
        
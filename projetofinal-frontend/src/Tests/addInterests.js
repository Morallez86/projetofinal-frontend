const fetchAddInterests = async (token, interests) => { // função para adicionar interesses
    if (!token.startsWith('eyJhbGciOiJIUzI1NiJ9')) { // se o token não começar com 'eyJhb
        return { status: 401 }; 
    } 
    else {
        // Simula uma resposta bem-sucedida com um JSON de exemplo
        const exampleResponse = JSON.stringify({ message: 'Interests added successfully' });
        return { status: 200, text: exampleResponse };
    }
  };

module.exports = { fetchAddInterests }; // exporta a função fetchAddInterests
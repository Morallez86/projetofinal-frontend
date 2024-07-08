const fetchAddInterests = async (token, interests) => {
    if (!token.startsWith('eyJhbGciOiJIUzI1NiJ9')) {
        return { status: 401 };
    } 
    else {
        // Simula uma resposta bem-sucedida com um JSON de exemplo
        const exampleResponse = JSON.stringify({ message: 'Interests added successfully' });
        return { status: 200, text: exampleResponse };
    }
  };

module.exports = { fetchAddInterests };
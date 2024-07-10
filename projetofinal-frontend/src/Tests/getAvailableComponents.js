const fetchAvailableComponents = async (token, workplaceId) => { // função para obter componentes disponíveis
    if (!token.startsWith('eyJhbGciOiJIUzI1NiJ9')) { // se o token não começar com 'eyJhb
        return { status: 401 }; // retorna status 401
    } else if (!workplaceId) { // se workplaceId não for fornecido
        return { status: 400, text: 'Workplace ID is required' }; // retorna status 400 e uma mensagem de erro
    } else { // se não
        const exampleResponse = JSON.stringify([{ name: 'Component1' }, { name: 'Component2' }]);
        return { status: 200, text: exampleResponse }; // retorna status 200 e o JSON de exemplo
    }
};

module.exports = { fetchAvailableComponents };

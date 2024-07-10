const { getUsersFromProject } = require('./getUsersFromProject');
global.fetch = jest.fn();

describe('getUsersFromProject', () => { // Testes para a função getUsersFromProject
  beforeEach(() => { // Limpa o mock da função fetch
    fetch.mockClear(); 
  });

  it('handles successful response correctly', async () => { // Teste para resposta com sucesso
    const mockUsers = [{ id: 1, name: 'User One' }]; 
    fetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(mockUsers),
    });

    await expect(getUsersFromProject()).resolves.toEqual(mockUsers);
    expect(fetch).toHaveBeenCalledWith(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/projects/123/users`, { // Verifica se a função fetch foi chamada com os parâmetros esperados
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer your_token_here`,
      },
    });
  });

  it('handles unauthorized response with "Invalid token" correctly', async () => { // Teste para resposta não autorizada com token inválido
    const errorMessage = { errorMessage: 'Invalid token' };
    fetch.mockResolvedValueOnce({
      status: 401,
      json: () => Promise.resolve(errorMessage),
    });

    await expect(getUsersFromProject()).rejects.toThrow('Invalid token'); // Verifica se a função lança a exceção esperada
    expect(fetch).toHaveBeenCalledWith(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/projects/123/users`, { // Verifica se a função fetch foi chamada com os parâmetros esperados
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer your_token_here`,
      },
    });
  });
});
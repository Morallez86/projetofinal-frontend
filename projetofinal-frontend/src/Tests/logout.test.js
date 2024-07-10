
const fetch = require('node-fetch');
const { logoutUser } = require('./logout'); 

// Mock node-fetch
jest.mock('node-fetch', () => jest.fn());

describe('logoutUser', () => { // Testes para a função logoutUser
  const apiUrl = 'https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/users';
  const token = 'fakeToken';
  const projectTimestamps = { timestamp: '2023-04-01T00:00:00Z' };

  it('should return success when the response is ok', async () => { // Teste para resposta ok
   
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Logout successful' }),
    });

    const result = await logoutUser(apiUrl, token, projectTimestamps);

    expect(result).toEqual({ success: true, data: { message: 'Logout successful' } }); // Verifica se o resultado da função é o esperado
    expect(fetch).toHaveBeenCalledWith(apiUrl, expect.any(Object)); // Verifica se a função fetch foi chamada com os parâmetros esperados
  });

  it('should return an error object when the response is not ok', async () => { // Teste para resposta não ok
    
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Logout error' }),
    });

    const result = await logoutUser(apiUrl, token, projectTimestamps);

    expect(result).toEqual({ error: 'Logout error', status: 400 }); // Verifica se o resultado da função é o esperado
    expect(fetch).toHaveBeenCalledWith(apiUrl, expect.any(Object)); // Verifica se a função fetch foi chamada com os parâmetros esperados
  });

  it('should return an error object in case of an exception', async () => { // Teste para exceção
    
    fetch.mockRejectedValueOnce(new Error('Network failure'));

    const result = await logoutUser(apiUrl, token, projectTimestamps);

    expect(result).toEqual({ error: 'Network failure' }); // Verifica se o resultado da função é o esperado
  });
});
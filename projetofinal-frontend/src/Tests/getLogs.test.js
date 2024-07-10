const { getLogs } = require('./getLogs');
const fetch = require('node-fetch');


jest.mock('node-fetch', () => jest.fn());

describe('getLogs', () => { // Testes para a função getLogs
  const apiUrl = 'https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest';
  const projectId = '123';
  const token = 'validToken';
  const formData = { startDate: '2021-01-01', endDate: '2021-01-31' };

  it('should return data on successful fetch', async () => { // Teste para requisição com sucesso
    const mockData = { logs: ['log1', 'log2'] };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await getLogs(apiUrl, projectId, token, formData);
    expect(result).toEqual(mockData); // Verifica se o resultado da função é o esperado
    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/projectHistory/${projectId}`, { // Verifica se a função fetch foi chamada com os parâmetros esperados
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
  });

  it('should throw an error for 401 response', async () => { // Teste para erro 401
    fetch.mockResolvedValueOnce({
      status: 401,
      json: () => Promise.resolve({ message: 'Invalid token' }),
    });

    await expect(getLogs(apiUrl, projectId, token, formData)).rejects.toThrow('Unauthorized: Invalid token.'); // Verifica se a função lança a exceção esperada
  });

  it('should throw an error for non-200 response', async () => { // Teste para erro diferente de 200
    fetch.mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Internal Server Error'),
    });

    await expect(getLogs(apiUrl, projectId, token, formData)).rejects.toThrow('Internal Server Error');
  });
});
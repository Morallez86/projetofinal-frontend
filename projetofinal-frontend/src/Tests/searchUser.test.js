const { searchUser } = require('./searchUser');
const fetch = require('node-fetch');


jest.mock('node-fetch', () => jest.fn()); // Mock da função fetch

describe('searchUser', () => { // Testes para a função searchUser
  const apiUrl = 'https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/users';
  const token = 'fakeToken';
  const inputValue = 'testUser';

  it('should return user data for status 200', async () => { // Teste para status 200
    const mockUser = { id: 1, name: 'Test User' };
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockUser),
      })
    );

    const result = await searchUser(apiUrl, inputValue, token);
    expect(result).toEqual({ status: 200, data: mockUser }); // Verifica se o resultado da função é o esperado
  });

  it('should return an error for status 401', async () => { // Teste para status 401
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 401,
        text: () => Promise.resolve('Unauthorized: Access is denied due to invalid credentials.'), // Retorna a mensagem de erro
      })
    );

    const result = await searchUser(apiUrl, inputValue, token);
    expect(result).toEqual({ status: 401, error: 'Unauthorized: Access is denied due to invalid credentials.' }); // Verifica se o resultado da função é o esperado
  });

  it('should return an error for status 404', async () => { // Teste para status 404
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 404,
        text: () => Promise.resolve('Not Found: The specified user could not be found.'),
      })
    );

    const result = await searchUser(apiUrl, inputValue, token);
    expect(result).toEqual({ status: 404, error: 'Not Found: The specified user could not be found.' }); // Verifica se o resultado da função é o esperado
  });
});
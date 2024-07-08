const { searchUser } = require('./searchUser');
const fetch = require('node-fetch');

// Mocking node-fetch
jest.mock('node-fetch', () => jest.fn());

describe('searchUser', () => {
  const apiUrl = 'https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/users';
  const token = 'fakeToken';
  const inputValue = 'testUser';

  it('should return user data for status 200', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockUser),
      })
    );

    const result = await searchUser(apiUrl, inputValue, token);
    expect(result).toEqual({ status: 200, data: mockUser });
  });

  it('should return an error for status 401', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 401,
        text: () => Promise.resolve('Unauthorized: Access is denied due to invalid credentials.'),
      })
    );

    const result = await searchUser(apiUrl, inputValue, token);
    expect(result).toEqual({ status: 401, error: 'Unauthorized: Access is denied due to invalid credentials.' });
  });

  it('should return an error for status 404', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 404,
        text: () => Promise.resolve('Not Found: The specified user could not be found.'),
      })
    );

    const result = await searchUser(apiUrl, inputValue, token);
    expect(result).toEqual({ status: 404, error: 'Not Found: The specified user could not be found.' });
  });
});
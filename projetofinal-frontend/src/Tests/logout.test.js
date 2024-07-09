// Import necessary dependencies
const fetch = require('node-fetch');
const { logoutUser } = require('./logout'); // Adjust the path as necessary

// Mock node-fetch
jest.mock('node-fetch', () => jest.fn());

describe('logoutUser', () => {
  const apiUrl = 'https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/users';
  const token = 'fakeToken';
  const projectTimestamps = { timestamp: '2023-04-01T00:00:00Z' };

  it('should return success when the response is ok', async () => {
    // Set up fetch mock to return a success response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Logout successful' }),
    });

    const result = await logoutUser(apiUrl, token, projectTimestamps);

    expect(result).toEqual({ success: true, data: { message: 'Logout successful' } });
    expect(fetch).toHaveBeenCalledWith(apiUrl, expect.any(Object));
  });

  it('should return an error object when the response is not ok', async () => {
    // Set up fetch mock to return an error response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Logout error' }),
    });

    const result = await logoutUser(apiUrl, token, projectTimestamps);

    expect(result).toEqual({ error: 'Logout error', status: 400 });
    expect(fetch).toHaveBeenCalledWith(apiUrl, expect.any(Object));
  });

  it('should return an error object in case of an exception', async () => {
    // Set up fetch mock to throw an exception
    fetch.mockRejectedValueOnce(new Error('Network failure'));

    const result = await logoutUser(apiUrl, token, projectTimestamps);

    expect(result).toEqual({ error: 'Network failure' });
  });
});
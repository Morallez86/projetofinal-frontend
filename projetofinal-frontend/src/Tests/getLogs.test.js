const { getLogs } = require('./getLogs');
const fetch = require('node-fetch');

// Mocking node-fetch
jest.mock('node-fetch', () => jest.fn());

describe('getLogs', () => {
  const apiUrl = 'https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest';
  const projectId = '123';
  const token = 'validToken';
  const formData = { startDate: '2021-01-01', endDate: '2021-01-31' };

  it('should return data on successful fetch', async () => {
    const mockData = { logs: ['log1', 'log2'] };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await getLogs(apiUrl, projectId, token, formData);
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/projectHistory/${projectId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
  });

  it('should throw an error for 401 response', async () => {
    fetch.mockResolvedValueOnce({
      status: 401,
      json: () => Promise.resolve({ message: 'Invalid token' }),
    });

    await expect(getLogs(apiUrl, projectId, token, formData)).rejects.toThrow('Unauthorized: Invalid token.');
  });

  it('should throw an error for non-200 response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Internal Server Error'),
    });

    await expect(getLogs(apiUrl, projectId, token, formData)).rejects.toThrow('Internal Server Error');
  });
});
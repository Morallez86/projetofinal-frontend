const { getUsersFromProject } = require('./getUsersFromProject');
global.fetch = jest.fn();

describe('getUsersFromProject', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('handles successful response correctly', async () => {
    const mockUsers = [{ id: 1, name: 'User One' }];
    fetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(mockUsers),
    });

    await expect(getUsersFromProject()).resolves.toEqual(mockUsers);
    expect(fetch).toHaveBeenCalledWith(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/projects/123/users`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer your_token_here`,
      },
    });
  });

  it('handles unauthorized response with "Invalid token" correctly', async () => {
    const errorMessage = { errorMessage: 'Invalid token' };
    fetch.mockResolvedValueOnce({
      status: 401,
      json: () => Promise.resolve(errorMessage),
    });

    await expect(getUsersFromProject()).rejects.toThrow('Invalid token');
    expect(fetch).toHaveBeenCalledWith(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/projects/123/users`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer your_token_here`,
      },
    });
  });
});
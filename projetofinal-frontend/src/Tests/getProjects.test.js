const { fetchProjects } = require('./getProjects');
const fetch = require('node-fetch');

// Mock the global fetch
jest.mock('node-fetch', () => jest.fn());

describe('fetchProjects', () => {
    const apiUrl = 'http://example.com/api';
    const token = 'eyJhbGciOiJIUzI1NiJ9.valid-token';

    beforeEach(() => {
        fetch.mockClear();
    });

    it('returns 401 for invalid token', async () => {
        const response = await fetchProjects('invalid-token');
        expect(response.status).toBe(401);
    });

    it('fetches projects successfully with valid token and parameters', async () => {
        const mockProjects = [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ projects: mockProjects }),
        });

        const response = await fetchProjects(token, 'searchTerm', 'skills', 'interests');

        expect(fetch).toHaveBeenCalledWith(
            "https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/projects?searchTerm=searchTerm&skills=skills&interests=interests",
            {
              method: "GET",
              headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.valid-token",
              },
            }
          );
        expect(response.status).toBe(200);
        expect(JSON.parse(response.text)).toEqual(mockProjects);
    });

    it('handles fetch error gracefully', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const response = await fetchProjects(token);
        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});
const { fetchAvailableComponents } = require('./getAvailableComponents');

describe('getAvailableComponentsGroupedByName', () => {
    it('should return 401 Unauthorized', async () => {
        const token = 'invalid-token'; // Token inválido
        const workplaceId = 1; // ID do local de trabalho de teste

        const response = await fetchAvailableComponents(token, workplaceId);

        expect(response.status).toBe(401);
    });

    it('should return 400 Bad Request if workplaceId is missing', async () => {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOjIwMCwiaWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJwcm9qZWN0VGltZXN0YW1wcyI6e30sImlhdCI6MTcyMDM5NDk1MCwiZXhwIjoxNzIwMzk4NTUwfQ.OGdbfy2Er5TBE0djMkR7ZpVoARg3ZFLi-uI4K1audno'; 

        const response = await fetchAvailableComponents(token);

        expect(response.status).toBe(400);
        expect(response.text).toBe('Workplace ID is required'); // Verifica response.text
    });

    it('should return 200 OK with component names', async () => {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOjIwMCwiaWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJwcm9qZWN0VGltZXN0YW1wcyI6e30sImlhdCI6MTcyMDM5NDk1MCwiZXhwIjoxNzIwMzk4NTUwfQ.OGdbfy2Er5TBE0djMkR7ZpVoARg3ZFLi-uI4K1audno'; // Token válido
        const workplaceId = 1; // ID do local de trabalho de teste

        const response = await fetchAvailableComponents(token, workplaceId);

        expect(response.status).toBe(200);
        expect(() => JSON.parse(response.text)).not.toThrow(); // Verifica se a resposta é um JSON válido
        const responseBody = JSON.parse(response.text);
        expect(Array.isArray(responseBody)).toBe(true); // Verifica se a resposta é uma lista
    });
});

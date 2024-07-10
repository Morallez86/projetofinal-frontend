const { fetchAvailableComponents } = require('./getAvailableComponents');

describe('getAvailableComponentsGroupedByName', () => { // Testes para a função fetchAvailableComponents
    it('should return 401 Unauthorized', async () => {
        const token = 'invalid-token'; // Token inválido
        const workplaceId = 1; // ID do local de trabalho de teste

        const response = await fetchAvailableComponents(token, workplaceId);

        expect(response.status).toBe(401); // Verifica se o status é o esperado
    });

    it('should return 400 Bad Request if workplaceId is missing', async () => { // Teste para workplaceId faltando
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOjIwMCwiaWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJwcm9qZWN0VGltZXN0YW1wcyI6e30sImlhdCI6MTcyMDM5NDk1MCwiZXhwIjoxNzIwMzk4NTUwfQ.OGdbfy2Er5TBE0djMkR7ZpVoARg3ZFLi-uI4K1audno'; 

        const response = await fetchAvailableComponents(token);

        expect(response.status).toBe(400); // Verifica se o status é o esperado
        expect(response.text).toBe('Workplace ID is required'); // Verifica se a mensagem de erro é a esperada
    });

    it('should return 200 OK with component names', async () => { // Teste para token válido
        const token = 'eyJhbGciOiJIUzI1NiJ9.leGFtcGxlLmNvbSIsInJvbGUiOjIwMCwiaWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJwcm9qZWN0VGltZXN0YW1wcyI6e30sImlhdCI6MTcyMDM5NDk1MCwiZXhwIjoxNzIwMzk4NTUwfQ'; // Token válido
        const workplaceId = 1; // ID do local de trabalho de teste

        const response = await fetchAvailableComponents(token, workplaceId);

        expect(response.status).toBe(200); // Verifica se o status é o esperado
        expect(() => JSON.parse(response.text)).not.toThrow(); // Verifica se a resposta é um JSON válido
        const responseBody = JSON.parse(response.text); 
        expect(Array.isArray(responseBody)).toBe(true); // Verifica se a resposta é uma lista
    });
});

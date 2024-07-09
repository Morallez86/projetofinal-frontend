const { fetchGetAllResources } = require('./getAllResources');

describe('fetchGetAllResources', () => {
    it('should return 401 for invalid token', async () => {
        // Simulando um contexto onde o token é inválido
        global.token = 'invalid-token'; // Ajuste conforme necessário para refletir como o token é passado/manipulado na sua função

        const response = await fetchGetAllResources();

        expect(response.status).toBe(401);
    });

    it('should return 200 and resources for valid token', async () => {
        // Simulando um contexto onde o token é válido
        global.token = 'eyJhbGciOiJIUzI1NiJ9.valid-token'; // Ajuste conforme necessário para refletir como o token é passado/manipulado na sua função

        const response = await fetchGetAllResources();

        expect(response.status).toBe(200);
        const resources = JSON.parse(response.text);
        expect(Array.isArray(resources)).toBe(true);
        expect(resources).toEqual([{ name: 'Resource1' }, { name: 'Resource2' }]);
    });
});
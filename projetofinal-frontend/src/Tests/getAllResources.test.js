const { fetchGetAllResources } = require('./getAllResources');

describe('fetchGetAllResources', () => { // Testes para a função fetchGetAllResources
    it('should return 401 for invalid token', async () => { // Teste para token inválido
        
        global.token = 'invalid-token'; 

        const response = await fetchGetAllResources();

        expect(response.status).toBe(401); // Verifica se o status é o esperado
    });

    it('should return 200 and resources for valid token', async () => { // Teste para token válido
        
        global.token = 'eyJhbGciOiJIUzI1NiJ9.valid-token'; 
        const response = await fetchGetAllResources();

        expect(response.status).toBe(200); // Verifica se o status é o esperado
        const resources = JSON.parse(response.text);
        expect(Array.isArray(resources)).toBe(true); // Verifica se o retorno é um array
        expect(resources).toEqual([{ name: 'Resource1' }, { name: 'Resource2' }]); // Verifica se o JSON é o esperado
    });
});
// Test: addComponents.test.js
const fetch = require('node-fetch');
jest.mock('node-fetch', () => jest.fn());

// Importa a função fetchComponents
const { fetchComponents } = require('./addComponents'); 

// Testes para a função fetchComponents
describe('fetchComponents', () => {
    // Teste para requisição com sucesso
    it('should handle 200 status', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ error: "Error adding component", status: 200 }),
        }));
      
        const result = await fetchComponents('validToken', 'apiUrl', { workplace: { id: '123' } });

      // Verifica se o resultado da função é o esperado
        expect(result).toEqual({ error: "Error adding component", status: 200 });
      });
      
      // Teste para requisição com erro 500 com o token inválido
      it('should handle 401 status with invalid token message', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
          status: 401,
          json: () => Promise.resolve({ error: "Error adding component", status: 401 }),
        }));
      
        const result = await fetchComponents('invalidToken', 'apiUrl', { workplace: { id: '123' } });
        // Verifica se o resultado da função é o esperado
        expect(result).toEqual({ error: "Error adding component", status: 401 });
      });
      
      // Teste para requisição com erro 404

      it('should handle 404 status', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
          status: 404,
          json: () => Promise.resolve({ error: "Error adding component", status: 404 }),
        }));
      
        const result = await fetchComponents('validToken', 'apiUrl', { workplace: { id: '123' } });
        // Verifica se o resultado da função é o esperado
        expect(result).toEqual({ error: "Error adding component", status: 404 });
      });
    
});
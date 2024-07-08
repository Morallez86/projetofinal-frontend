// Importações necessárias
const fetch = require('node-fetch');
jest.mock('node-fetch', () => jest.fn());

const { fetchComponents } = require('./addComponents'); 

describe('fetchComponents', () => {
    it('should handle 200 status', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ error: "Error adding component", status: 200 }),
        }));
      
        const result = await fetchComponents('validToken', 'apiUrl', { workplace: { id: '123' } });
        expect(result).toEqual({ error: "Error adding component", status: 200 });
      });
      
      it('should handle 401 status with invalid token message', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
          status: 401,
          json: () => Promise.resolve({ error: "Error adding component", status: 401 }),
        }));
      
        const result = await fetchComponents('invalidToken', 'apiUrl', { workplace: { id: '123' } });
        expect(result).toEqual({ error: "Error adding component", status: 401 });
      });
      
      it('should handle 404 status', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
          status: 404,
          json: () => Promise.resolve({ error: "Error adding component", status: 404 }),
        }));
      
        const result = await fetchComponents('validToken', 'apiUrl', { workplace: { id: '123' } });
        expect(result).toEqual({ error: "Error adding component", status: 404 });
      });
    
});
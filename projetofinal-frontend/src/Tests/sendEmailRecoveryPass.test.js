// Importações necessárias
const fetch = require('node-fetch');

jest.mock('node-fetch', () => jest.fn()); // Mock da função fetch

const { sendEmailRecoveryPass } = require('./sendEmailRecoveryPass');

describe('sendEmailRecoveryPass', () => { // Testes para a função sendEmailRecoveryPass
     
    it('should correctly handle a 200 response', async () => {
      fetch.mockImplementationOnce(() => Promise.resolve({
        ok: true, 
        json: () => Promise.resolve({ data: 'success' }),
        status: 200
      }));
  
      const response = await sendEmailRecoveryPass('email@example.com');
      expect(response).toEqual({ status: 200, data: { data: 'success' } }); // aprovação do teste
      expect(fetch).toHaveBeenCalledWith(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/users/emailRecoveryPassword`, expect.anything()); // Verifica se a função fetch foi chamada com os parâmetros esperados
    });
  
    it('should correctly handle other responses', async () => { // Teste para outras respostas
      fetch.mockImplementationOnce(() => Promise.resolve({
        ok: false, 
        json: () => Promise.resolve({ error: 'failed' }),
        status: 400
      }));
  
      const response = await sendEmailRecoveryPass('email@example.com');
      expect(response).toEqual({ status: 400, error: { error: 'failed' } }); // aprovação do teste
      expect(fetch).toHaveBeenCalledWith(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/users/emailRecoveryPassword`, expect.anything()); // Verifica se a função fetch foi chamada com os parâmetros esperados
    });
});
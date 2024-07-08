// Importações necessárias
const fetch = require('node-fetch');

jest.mock('node-fetch', () => jest.fn());

const { sendEmailRecoveryPass } = require('./sendEmailRecoveryPass');

describe('sendEmailRecoveryPass', () => {
    
    it('should correctly handle a 200 response', async () => {
      fetch.mockImplementationOnce(() => Promise.resolve({
        ok: true, // Adjusted to use 'ok' property for status check
        json: () => Promise.resolve({ data: 'success' }),
        status: 200
      }));
  
      const response = await sendEmailRecoveryPass('email@example.com');
      expect(response).toEqual({ status: 200, data: { data: 'success' } }); // Adjusted expected value
      expect(fetch).toHaveBeenCalledWith(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/users/emailRecoveryPassword`, expect.anything());
    });
  
    it('should correctly handle other responses', async () => {
      fetch.mockImplementationOnce(() => Promise.resolve({
        ok: false, // Adjusted to use 'ok' property for status check
        json: () => Promise.resolve({ error: 'failed' }),
        status: 400
      }));
  
      const response = await sendEmailRecoveryPass('email@example.com');
      expect(response).toEqual({ status: 400, error: { error: 'failed' } }); // Adjusted expected value
      expect(fetch).toHaveBeenCalledWith(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/users/emailRecoveryPassword`, expect.anything());
    });
});
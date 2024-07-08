// Importações necessárias
const fetch = require('node-fetch');
jest.mock('node-fetch', () => jest.fn());

const { createChatMsg } = require('./createChatMsg'); 

describe('createChatMsg', () => {
    it('should handle 201 status', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
          status: 201,
          json: () => Promise.resolve({ message: "Message created successfully", status: 201 }),
        }));
      
        const result = await createChatMsg('validToken', 'projectId', 'Hello, world!', 'username', 'userId');
        expect(result).toEqual({ message: "Message created successfully", status: 201 });
    });
    
    it('should handle 401 status with unauthorized message', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
          status: 401,
          json: () => Promise.resolve({ error: "Unauthorized", status: 401 }),
        }));
    
        const result = await createChatMsg('invalidToken', 'projectId', 'Hello, world!', 'username', 'userId');
        expect(result).toEqual({ error: "Unauthorized", status: 401 });
    });
    
    it('should handle 500 status with server error message', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
          status: 500,
          json: () => Promise.resolve({ error: "Internal Server Error", status: 500 }),
        }));
    
        const result = await createChatMsg('validToken', 'projectId', 'Hello, world!', 'username', 'userId');
        expect(result).toEqual({ error: "Internal Server Error", status: 500 });
    });
});
// Importações necessárias
const fetch = require('node-fetch');
jest.mock('node-fetch', () => jest.fn());

const { createChatMsg } = require('./createChatMsg');  // Importa a função createChatMsg

describe('createChatMsg', () => {
    it('should handle 201 status', async () => { // Teste para requisição com sucesso
        fetch.mockImplementationOnce(() => Promise.resolve({
          status: 201,
          json: () => Promise.resolve({ message: "Message created successfully", status: 201 }), // Retorna a mensagem de sucesso
        }));
      
        const result = await createChatMsg('validToken', 'projectId', 'Hello, world!', 'username', 'userId');
        expect(result).toEqual({ message: "Message created successfully", status: 201 }); // Verifica se o resultado da função é o esperado
    });
    
    it('should handle 401 status with unauthorized message', async () => { // Teste para erro 401 não autorizado
        fetch.mockImplementationOnce(() => Promise.resolve({
          status: 401,
          json: () => Promise.resolve({ error: "Unauthorized", status: 401 }),
        }));
    
        const result = await createChatMsg('invalidToken', 'projectId', 'Hello, world!', 'username', 'userId');
        expect(result).toEqual({ error: "Unauthorized", status: 401 }); // Verifica se o resultado da função é o esperado
    });
    
    it('should handle 500 status with server error message', async () => { // Teste para erro 500 interno do servidor
        fetch.mockImplementationOnce(() => Promise.resolve({
          status: 500,
          json: () => Promise.resolve({ error: "Internal Server Error", status: 500 }),
        }));
    
        const result = await createChatMsg('validToken', 'projectId', 'Hello, world!', 'username', 'userId');
        expect(result).toEqual({ error: "Internal Server Error", status: 500 }); // Verifica se o resultado da função é o esperado
    });
});
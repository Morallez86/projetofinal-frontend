const fetch = require('node-fetch'); // Importa o módulo node-fetch para fazer requisições HTTP
const { addNotification } = require('./addNotification'); // Importa a função addNotification


jest.mock('node-fetch', () => jest.fn()); // Mock da função fetch

describe('addNotification', () => { // Testes para a função addNotification
  const token = 'fakeToken';
  const user = { id: 1 };
  const projectInfo = { id: 2 };
  const type = "400";

  beforeEach(() => { // Limpa o mock da função fetch
    fetch.mockClear();
  });

  it('should successfully add a notification', async () => { // Teste para adicionar uma notificação com sucesso
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Notification added successfully' }), 
      })
    );

    const response = await addNotification(token, user, projectInfo, type);
    expect(response).toEqual({ message: 'Notification added successfully' }); // Verifica se a mensagem é a esperada
    expect(fetch).toHaveBeenCalledWith(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/notifications`, { // Verifica se a função fetch foi chamada com os parâmetros esperados
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiverId: user.id,
        type: "400",
        projectId: projectInfo.id,
      }),
    });
  });

  it('should handle 401 unauthorized error', async () => { // Teste para erro 401 não autorizado
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ 
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized: Access is denied due to invalid credentials.'), // Retorna a mensagem de erro
      })
    );
  
    await expect(addNotification(token, user, projectInfo, type))
      .rejects
      .toThrow('Unauthorized: Access is denied due to invalid credentials.'); // Verifica se a função lança a exceção esperada
  });

});
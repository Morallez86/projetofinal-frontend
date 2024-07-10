const { addTasks } = require('./addTasks');
const fetch = require('node-fetch');

// Mock node-fetch
jest.mock('node-fetch', () => jest.fn());  // Mock da função fetch 

describe('addTasks', () => { // Testes para a função addTasks
  const token = 'test-token';
  const projectId = '123';
  const taskData = { name: 'Test Task', description: 'This is a test task.' };

  beforeEach(() => { // Limpa o mock da função fetch
    fetch.mockClear();
  });

  it('successfully adds a task', async () => { // Teste para adicionar uma tarefa com sucesso
    
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Task added successfully' }),
    });

    const response = await addTasks(token, projectId, taskData);

    expect(response).toEqual({ status: 200, data: { message: 'Task added successfully' } }); // Verifica se a mensagem é a esperada
    expect(fetch).toHaveBeenCalledTimes(1); // Verifica se a função fetch foi chamada uma vez
  });

  it('returns an error for unauthorized access', async () => { // Teste para erro de acesso não autorizado
    
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
    });

    const response = await addTasks(token, projectId, taskData);

    expect(response).toEqual({ status: 401, error: 'Error adding task' }); // Verifica se o status e a mensagem de erro são os esperados
    expect(fetch).toHaveBeenCalledTimes(1); // Verifica se a função fetch foi chamada uma vez
  });

  it('handles internal server error', async () => { // Teste para erro interno do servidor
    
    fetch.mockRejectedValue(new Error('Internal Server Error'));

    const response = await addTasks(token, projectId, taskData);

    expect(response).toEqual({ status: 500, error: 'Internal Server Error' }); // Verifica se o status e a mensagem de erro são os esperados
    expect(fetch).toHaveBeenCalledTimes(1); // Verifica se a função fetch foi chamada uma vez
  });
});
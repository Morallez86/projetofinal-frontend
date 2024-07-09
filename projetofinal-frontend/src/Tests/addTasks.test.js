const { addTasks } = require('./addTasks');
const fetch = require('node-fetch');

// Mock node-fetch
jest.mock('node-fetch', () => jest.fn());

describe('addTasks', () => {
  const token = 'test-token';
  const projectId = '123';
  const taskData = { name: 'Test Task', description: 'This is a test task.' };

  beforeEach(() => {
    fetch.mockClear();
  });

  it('successfully adds a task', async () => {
    // Mock fetch response for success
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Task added successfully' }),
    });

    const response = await addTasks(token, projectId, taskData);

    expect(response).toEqual({ status: 200, data: { message: 'Task added successfully' } });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns an error for unauthorized access', async () => {
    // Mock fetch response for unauthorized access
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
    });

    const response = await addTasks(token, projectId, taskData);

    expect(response).toEqual({ status: 401, error: 'Error adding task' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('handles internal server error', async () => {
    // Mock fetch to throw an error
    fetch.mockRejectedValue(new Error('Internal Server Error'));

    const response = await addTasks(token, projectId, taskData);

    expect(response).toEqual({ status: 500, error: 'Internal Server Error' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
const fetch = require('node-fetch');
const { addNotification } = require('./addNotification');

// Mocking node-fetch
jest.mock('node-fetch', () => jest.fn());

describe('addNotification', () => {
  const token = 'fakeToken';
  const user = { id: 1 };
  const projectInfo = { id: 2 };
  const type = "400";

  beforeEach(() => {
    fetch.mockClear();
  });

  it('should successfully add a notification', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Notification added successfully' }),
      })
    );

    const response = await addNotification(token, user, projectInfo, type);
    expect(response).toEqual({ message: 'Notification added successfully' });
    expect(fetch).toHaveBeenCalledWith(`https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/notifications`, {
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

  it('should handle 401 unauthorized error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized: Access is denied due to invalid credentials.'),
      })
    );
  
    await expect(addNotification(token, user, projectInfo, type))
      .rejects
      .toThrow('Unauthorized: Access is denied due to invalid credentials.');
  });

});
const { fetchAddInterests } = require('./addInterests');

describe('fetchAddInterests', () => {
  it('should return status 401 for invalid token', async () => {
    const token = 'invalidToken';
    const interests = [ "JavaScript", "Node.js"]; 
    const response = await fetchAddInterests(token, interests);
    expect(response.status).toBe(401);
  });

  it('should return status 200 and success message for valid token', async () => {
    const token = 'eyJhbGciOiJIUzI1NiJ9validToken';
    const interests = ["JavaScript", "Node.js"]; 
    const response = await fetchAddInterests(token, interests);
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toEqual({ message: 'Interests added successfully' });
  });
});
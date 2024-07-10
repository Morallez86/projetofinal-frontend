const { fetchAddInterests } = require('./addInterests'); // Importa a função fetchAddInterests

describe('fetchAddInterests', () => { // Testes para a função fetchAddInterests
  it('should return status 401 for invalid token', async () => { // Teste para token inválido
    const token = 'invalidToken';
    const interests = [ "JavaScript", "Node.js"]; 
    const response = await fetchAddInterests(token, interests);
    expect(response.status).toBe(401); // Verifica se o status é o esperado
  });

  it('should return status 200 and success message for valid token', async () => { // Teste para token válido
    const token = 'eyJhbGciOiJIUzI1NiJ9validToken';
    const interests = ["JavaScript", "Node.js"]; 
    const response = await fetchAddInterests(token, interests);
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toEqual({ message: 'Interests added successfully' }); // Verifica se a mensagem é a esperada
  });
});
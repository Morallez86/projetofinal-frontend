const { fetchAddSkills } = require('./addSkills');

describe('fetchAddSkills', () => {
    it('returns 401 for invalid token', async () => { // Teste para token inválido
        
        global.token = 'invalid-token'; // 

        const response = await fetchAddSkills([]);

        expect(response.status).toBe(401); // Verifica se o status é o esperado
    }); 

    it('returns 200 and echoes skills for valid token', async () => { // Teste para token válido
        
        global.token = 'eyJhbGciOiJIUzI1NiJ9.valid-token'; 

        const skills = [{ id: 1, name: 'JavaScript' }, { id: 2, name: 'React' }];
        const response = await fetchAddSkills(skills);

        expect(response.status).toBe(200); // Verifica se o status é o esperado
        expect(JSON.parse(response.text)).toEqual(skills); // Verifica se o JSON é o esperado
    });
});
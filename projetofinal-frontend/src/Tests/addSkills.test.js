const { fetchAddSkills } = require('./addSkills');

describe('fetchAddSkills', () => {
    it('returns 401 for invalid token', async () => {
        // Simulando um contexto onde o token é inválido
        global.token = 'invalid-token'; // Ajuste conforme necessário para refletir como o token é passado/manipulado na sua função

        const response = await fetchAddSkills([]);

        expect(response.status).toBe(401);
    });

    it('returns 200 and echoes skills for valid token', async () => {
        // Simulando um contexto onde o token é válido
        global.token = 'eyJhbGciOiJIUzI1NiJ9.valid-token'; // Ajuste conforme necessário para refletir como o token é passado/manipulado na sua função

        const skills = [{ id: 1, name: 'JavaScript' }, { id: 2, name: 'React' }];
        const response = await fetchAddSkills(skills);

        expect(response.status).toBe(200);
        expect(JSON.parse(response.text)).toEqual(skills);
    });
});
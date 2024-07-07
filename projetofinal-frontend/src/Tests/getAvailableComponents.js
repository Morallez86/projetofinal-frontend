const request = require('supertest');
const https = require('https');

// Ignorar certificados autoassinados apenas para testes
const agent = new https.Agent({
    rejectUnauthorized: false,
});

const fetchAvailableComponents = async (token, workplaceId) => {
    const response = await request('https://localhost:8443') // URL base do seu servidor JAX-RS
        .get('/projetofinal-backend-1.0-SNAPSHOT/rest/components/availableGroupedByName') // Caminho completo do endpoint
        .set('Authorization', `Bearer ${token}`) // Certifique-se de que o token é precedido por 'Bearer '
        .query({ workplaceId })
        .agent(agent)
        .buffer(true) // Adicione isso para lidar com a resposta manualmente
        .parse((res, callback) => {
            res.setEncoding('utf8');
            res.text = '';
            res.on('data', (chunk) => {
                res.text += chunk;
            });
            res.on('end', () => {
                callback(null, res.text);
            });
        });

    return response;
};

module.exports = { fetchAvailableComponents };

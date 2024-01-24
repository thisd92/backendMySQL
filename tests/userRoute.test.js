const request = require('supertest');
const app = require('../index'); // Importe o arquivo index.js do seu servidor

describe('UserRoute', () => {
    it('should create a new user', async () => {
        const response = await request(app)
            .post('/api/user')
            .send({ email: 'test@example.com', password: 'password' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
    });

    it('should retrieve all users', async () => {
        const response = await request(app).get('/api/user');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should retrieve a user by ID', async () => {
        const response = await request(app).get('/api/user/d39a5be9-8d56-45df-b80d-e4353e5e45ad');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('uuid', 'd39a5be9-8d56-45df-b80d-e4353e5e45ad')
    });

    it('should update a user by ID', async () => {
        const response = await request(app)
            .put('/api/user/d39a5be9-8d56-45df-b80d-e4353e5e45ad')
            .send({ email: 'thiago-dutra@dev-th.tech', password: '123456' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg', 'User updated');
    });

    it('should delete a user by ID', async () => {
        const response = await request(app).delete('/api/user/f1313db8-05c3-434b-a7c8-0d7ede1f933b');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg', 'User deleted');
    });
});

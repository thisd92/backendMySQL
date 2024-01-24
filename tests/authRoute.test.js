const request = require('supertest');
const app = require('../index');

describe('AuthRoute', () => {
    it('should sign in a user and return a token', async () => {
        const response = await request(app)
            .post('/auth/signin')
            .send({ email: 'thiago-dutra@dev-th.com.br', password: '123456' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login realizado com sucesso!');
        expect(response.body.token).toBeDefined();
    });

    it('should return an error if email or password is missing', async () => {
        const response = await request(app)
            .post('/auth/signin')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Username and password are required.');
    });

    it('should return an error if user not found', async () => {
        const response = await request(app)
            .post('/auth/signin')
            .send({ email: 'nonexistent@example.com', password: 'password' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Credentials doesn't match");
    });

    it('should return an error if password is incorrect', async () => {
        const response = await request(app)
            .post('/auth/signin')
            .send({ email: 'test@example.com', password: 'incorrectPassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Credentials doesn't match");
    });
});

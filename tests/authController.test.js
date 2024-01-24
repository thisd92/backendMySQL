const bcrypt = require('bcrypt');
const { signIn } = require('../controller/authController');
const User = require('../model/User');
const { generateToken } = require('../middleware/jwtMiddleware');

jest.mock('bcrypt');
jest.mock('../model/User');
jest.mock('../middleware/jwtMiddleware');

describe('AuthController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('signIn', () => {
        it('should sign in a user and return a token', async () => {
            const req = { body: { email: 'test@example.com', password: 'password' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            bcrypt.compare.mockResolvedValue(true);
            User.findOne.mockResolvedValue({ id: 1, username: 'test@example.com', password: 'hashedPassword' });
            generateToken.mockReturnValue('mockedToken');

            await signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Login realizado com sucesso!', token: 'mockedToken' });
        });

        it('should return an error if email or password is missing', async () => {
            const req = { body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: true, message: 'Username and password are required.' });
        });

        it('should return an error if user not found', async () => {
            const req = { body: { email: 'nonexistent@example.com', password: 'password' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            User.findOne.mockResolvedValue(null);

            await signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Credentials doesn't match" });
        });

        it('should return an error if password is incorrect', async () => {
            const req = { body: { email: 'test@example.com', password: 'incorrectPassword' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            bcrypt.compare.mockResolvedValue(false);
            User.findOne.mockResolvedValue({ id: 1, username: 'test@example.com', password: 'hashedPassword' });

            await signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Credentials doesn't match" });
        });

        it('should return an error if an exception occurs', async () => {
            const req = { body: { email: 'test@example.com', password: 'password' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            bcrypt.compare.mockRejectedValue(new Error('An error occurred'));

            await signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao processar a solicitação' });
        });
    });
});

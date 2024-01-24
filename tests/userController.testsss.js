const bcrypt = require('bcrypt');
const { create, findAll, findById, UpdateById, deleteById } = require('../controller/userController');
const User = require('../model/User');
const { generateToken } = require('../middleware/jwtMiddleware');

jest.mock('bcrypt');
jest.mock('../model/User');
jest.mock('../middleware/jwtMiddleware');

describe('UserController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new user and return a token', async () => {
            const req = { body: { email: 'test@example.com', password: 'password' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.create.mockResolvedValue({
                toJSON: jest.fn().mockReturnValue({ id: 1, username: 'test@example.com' }),
            });
            generateToken.mockReturnValue('mockedToken');

            await create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ user: { id: 1, username: 'test@example.com' }, token: 'mockedToken' });
        });

        it('should handle validation errors', async () => {
            const req = { body: { email: '', password: 'password' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                message: 'Email and password are required',
            });
        });

        it('should handle unique constraint errors', async () => {
            const req = { body: { email: 'test@example.com', password: 'password' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            User.create.mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });

            await create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                message: 'Email já utilizado.',
            });
        });

        it('should handle other errors', async () => {
            const req = { body: { email: 'test@example.com', password: 'password' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            User.create.mockRejectedValue(new Error('Some other error'));

            await create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                message: 'Internal Server Error',
            });
        });
    });

    describe('findAll', () => {
        it('should retrieve all users', async () => {
            const users = [{ id: 1, username: 'user1' }, { id: 2, username: 'user2' }];
            User.findAll.mockResolvedValue(users);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await findAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(users);
        });

        it('should handle errors when retrieving users', async () => {
            User.findAll.mockRejectedValue(new Error('Database error'));

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await findAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                message: 'Internal Server Error',
            });
        });
    });

    describe('findById', () => {
        it('should retrieve a user by ID', async () => {
            const user = { id: 1, username: 'user1' };
            User.findOne.mockResolvedValue(user);

            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await findById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it('should handle when user is not found', async () => {
            User.findOne.mockResolvedValue(null);

            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await findById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                message: 'User not found',
            });
        });

        it('should handle errors when retrieving a user by ID', async () => {
            User.findOne.mockRejectedValue(new Error('Database error'));

            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await findById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                message: 'Internal Server Error',
            });
        });
    });

    describe('updateById', () => {
        it('should update a user by ID', async () => {
            const updatedUser = { id: 1, username: 'updatedUser' };
            User.update.mockResolvedValue([1]); // 1 row affected

            const req = { params: { id: 1 }, body: { username: 'updatedUser' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updateById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: 'User updated' });
        });

        it('should handle when no rows are affected during update', async () => {
            User.update.mockResolvedValue([0]); // No rows affected

            const req = { params: { id: 1 }, body: { username: 'updatedUser' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updateById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                message: 'User not found',
            });
        });

        it('should handle errors when updating a user by ID', async () => {
            User.update.mockRejectedValue(new Error('Database error'));

            const req = { params: { id: 1 }, body: { username: 'updatedUser' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updateById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                message: 'Internal Server Error',
            });
        });
    });

    describe('deleteById', () => {
        it('should delete a user by ID', async () => {
            User.destroy.mockResolvedValue(1); // 1 row deleted

            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await deleteById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: 'User deleted' });
        });

        it('should handle when no rows are deleted during delete', async () => {
            User.destroy.mockResolvedValue(0); // No rows deleted

            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await deleteById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                message: 'User not found',
            });
        });

        it('should handle errors when deleting a user by ID', async () => {
            User.destroy.mockRejectedValue(new Error('Database error'));

            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await deleteById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                message: 'Internal Server Error',
            });
        });
    });
});
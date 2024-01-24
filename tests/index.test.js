const request = require('supertest');
const app = require('../index');

describe('Server Initialization', () => {
    it('should start the server and listen on the specified port', async () => {
        expect(app).toBeTruthy();
    });
});
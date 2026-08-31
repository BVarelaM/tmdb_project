jest.mock('uuid', () => ({
  v4: () => 'mocked-auth-uuid-1234'
}));

const request = require('supertest');
const app = require('../app');
const { connectDB, closeDB } = require('../config/database/db');
const userService = require('../business/services/user');

describe('Auth Endpoints & Security Test Suite', () => {

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        username: 'bastian_dev',
        email: 'bastian.dev@example.com',
        password: 'Password123!'
      };

      jest.spyOn(userService, 'registerUser').mockResolvedValue({
        userId: 'mocked-auth-uuid-1234',
        username: newUser.username,
        email: newUser.email
      });

      const res = await request(app)
        .post('/api/users/register')
        .send(newUser);

      expect([200, 201]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('success', true);
    });

    it('should fail when registering an already registered email', async () => {
      const duplicateUser = {
        username: 'bastian_dev',
        email: 'existing@example.com',
        password: 'Password123!'
      };

      const error = new Error('Email is already registered');
      error.statusCode = 400;

      jest.spyOn(userService, 'registerUser').mockRejectedValue(error);

      const res = await request(app)
        .post('/api/users/register')
        .send(duplicateUser);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users/login', () => {
    it('should authenticate user and return a JWT token', async () => {
      const credentials = {
        email: 'bastian.dev@example.com',
        password: 'Password123!'
      };

      jest.spyOn(userService, 'loginUser').mockResolvedValue({
        user: {
          userId: 'mocked-auth-uuid-1234',
          username: 'bastian_dev',
          email: credentials.email
        },
        token: 'mocked-jwt-token-xyz'
      });

      const res = await request(app)
        .post('/api/users/login')
        .send(credentials);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
      const invalidCredentials = {
        email: 'bastian.dev@example.com',
        password: 'WrongPassword'
      };

      const error = new Error('Invalid email or password.');
      error.statusCode = 401;

      jest.spyOn(userService, 'loginUser').mockRejectedValue(error);

      const res = await request(app)
        .post('/api/users/login')
        .send(invalidCredentials);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid email or password.');
    });
  });

  describe('Middleware Access Control (Protected Routes)', () => {
    it('should reject access to protected route without token', async () => {
      const res = await request(app).get('/api/users/profile');

      expect([401, 403]).toContain(res.statusCode);
    });
  });
});
jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid-1234'
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { connectDB, closeDB } = require('../config/database/db');
const userService = require('../business/services/user');

describe('User and Watchlist Endpoints Test Suite', () => {
  let token;
  const mockUserId = 'user-test-uuid-1234';

  beforeAll(async () => {
    await connectDB();
    const secret = process.env.JWT_SECRET || 'secreto_para_tests';
    token = jwt.sign({ userId: mockUserId, email: 'tester@example.com' }, secret);
  });

  afterAll(async () => {
    await closeDB();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/users/profile', () => {
    it('should return user profile successfully for authenticated user', async () => {
      jest.spyOn(userService, 'getUserProfile').mockResolvedValue({
        userId: mockUserId,
        username: 'bastian_tester',
        email: 'tester@example.com',
        watchlist: []
      });

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('username', 'bastian_tester');
    });
  });

  describe('POST /api/users/lists/:listName', () => {
    it('should add a movie to the specified list', async () => {
      const mockMovie = { tmdbId: 155, title: 'The Dark Knight', releaseYear: '2008' };

      jest.spyOn(userService, 'addMovieToList').mockResolvedValue({
        message: 'Movie added successfully',
        movie: mockMovie
      });

      const res = await request(app)
        .post('/api/users/lists/watchlist')
        .set('Authorization', `Bearer ${token}`)
        .send(mockMovie);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'The Dark Knight');
    });
  });

  describe('DELETE /api/users/lists/:listName/:tmdbId', () => {
    it('should remove a movie from the specified list successfully', async () => {
      const movieIdToRemove = '155';
      const listName = 'watchlist';

      jest.spyOn(userService, 'removeMovieFromList').mockResolvedValue({
        message: 'Movie removed successfully'
      });

      // Se envía con la ruta que espera tus params: :listName y :tmdbId
      const res = await request(app)
        .delete(`/api/users/lists/${listName}/${movieIdToRemove}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });
});
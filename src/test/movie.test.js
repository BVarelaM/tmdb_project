jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid-1234'
}));

// Mockeamos el servicio completo para evitar que consulte la BD o servicios externos
jest.mock('../business/services/movie', () => ({
  searchMovies: jest.fn(),
  getMovieById: jest.fn(),
  getMovies: jest.fn()
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { connectDB, closeDB } = require('../config/database/db');
const movieService = require('../business/services/movie');

describe('Movie Endpoints Test Suite', () => {
  let token;

  beforeAll(async () => {
    await connectDB();
    const secret = process.env.JWT_SECRET || 'secreto_para_tests';
    token = jwt.sign({ userId: 'bastian-user-uuid-1234', email: 'bastian@example.com' }, secret);
  });

  afterAll(async () => {
    await closeDB();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/movies/:id', () => {
    it('should return movie details for a valid ID', async () => {
      const mockMovieDetail = {
        tmdbId: 155,
        title: 'The Dark Knight',
        overview: 'When the menace known as the Joker wreaks havoc...',
        releaseYear: '2008'
      };

      if (movieService.getMovieById) {
        movieService.getMovieById.mockResolvedValue(mockMovieDetail);
      }

      const res = await request(app)
        .get('/api/movies/155')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });
});
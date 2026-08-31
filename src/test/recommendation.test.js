jest.mock('uuid', () => ({
  v4: () => 'mocked-rec-uuid-1234'
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { connectDB, closeDB } = require('../config/database/db');
const recommendationService = require('../business/services/recommendation');

describe('Recommendation Endpoints Test Suite', () => {
  let token;
  const mockUserId = 'bastian-user-uuid-1234';

  beforeAll(async () => {
    await connectDB();
    const secret = process.env.JWT_SECRET || 'secreto_para_tests';
    token = jwt.sign({ userId: mockUserId, email: 'bastian@example.com' }, secret);
  });

  afterAll(async () => {
    await closeDB();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/recommendations', () => {
    it('should create a recommendation and return 201', async () => {
      const payload = {
        receiverUserId: 'friend-user-uuid-5678',
        movie: {
          tmdbId: 155,
          title: 'The Dark Knight',
          posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
          releaseYear: '2008'
        },
        message: '¡Tienes que ver esta película, hermano!'
      };

      const mockCreatedRec = {
        recommendationId: 'mocked-rec-uuid-1234',
        senderUserId: mockUserId,
        ...payload,
        status: 'pending',
        createdAt: new Date()
      };

      jest.spyOn(recommendationService, 'sendRecommendation').mockResolvedValue(mockCreatedRec);

      const res = await request(app)
        .post('/api/recommendations')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

      expect([200, 201]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('success', true);
    });
  });

  describe('GET /api/recommendations/pending', () => {
    it('should retrieve pending recommendations for the logged in user', async () => {
      const mockList = [
        {
          recommendationId: 'rec-abc-123',
          senderUserId: 'friend-user-uuid-5678',
          receiverUserId: mockUserId,
          status: 'pending',
          movie: { tmdbId: 155, title: 'The Dark Knight' }
        }
      ];

      jest.spyOn(recommendationService, 'getRecommendationsByStatus').mockResolvedValue(mockList);

      const res = await request(app)
        .get('/api/recommendations/pending')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });

  describe('PATCH /api/recommendations/:recommendationId/respond', () => {
    it('should update recommendation status successfully', async () => {
      const recId = 'mocked-rec-uuid-1234';

      jest.spyOn(recommendationService, 'respondToRecommendation').mockResolvedValue({
        message: 'Recommendation accepted successfully',
        recommendationId: recId,
        action: 'accepted'
      });

      const res = await request(app)
        .patch(`/api/recommendations/${recId}/respond`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'accepted' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });
});
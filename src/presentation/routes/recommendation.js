const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation');
const { authenticateToken } = require('../../auth/middlewares/auth');

// must be logged for recomendations
router.use(authenticateToken);

/**
 * @swagger
 * /api/recommendations:
 *   post:
 *     summary: Send a movie recommendation to another user
 *     tags: [Recommendations]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *               tmdbId:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recommendation sent successfully
 */
router.post('/', recommendationController.sendRecommendation);

/**
 * @swagger
 * /api/recommendations/pending:
 *   get:
 *     summary: Get user recommendations
 *     tags: [Recommendations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected, all]
 *         description: Filter recommendations by status
 *     responses:
 *       200:
 *         description: List of recommendations retrieved successfully
 */
router.get('/pending', recommendationController.getRecommendations); //pending, accepted, rejected, all

/**
 * @swagger
 * /api/recommendations/{recommendationId}/respond:
 *   patch:
 *     summary: Respond to a movie recommendation (accept or reject)
 *     tags: [Recommendations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recommendationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the recommendation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected]
 *     responses:
 *       200:
 *         description: Recommendation response updated successfully
 */
router.patch('/:recommendationId/respond', recommendationController.respondToRecommendation);

module.exports = router;
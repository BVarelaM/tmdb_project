const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation');
const { authenticateToken } = require('../../auth/middlewares/auth');

// must be logged for recomendations
router.use(authenticateToken);
router.post('/', recommendationController.sendRecommendation);
router.get('/pending', recommendationController.getRecommendations); //pending, accepted, rejected, all
router.patch('/:recommendationId/respond', recommendationController.respondToRecommendation);

module.exports = router;
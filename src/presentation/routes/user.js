const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const { authenticateToken } = require('../../auth/middlewares/auth');

router.use(authenticateToken);
router.get('/profile', userController.getProfile);
router.post('/lists/:listName', userController.addMovieToList);
router.delete('/lists/:listName/:tmdbId', userController.removeMovieFromList);
router.get('/compare/:targetUserId', userController.compareLists);

module.exports = router;
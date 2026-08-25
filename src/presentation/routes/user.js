const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const { authenticateToken } = require('../../auth/middlewares/auth');

router.use((req, res, next) => {
  console.log(`>>> LLEGÓ PETICIÓN: ${req.method} ${req.originalUrl}`);
  next();
});

//public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/', userController.getAllUsers);

//Protected routes 
router.use(authenticateToken);
router.get('/profile', userController.getProfile);
router.post('/lists/:listName', userController.addMovieToList);
router.delete('/lists/:listName/:tmdbId', userController.removeMovieFromList);
router.get('/compare/:targetUserId', userController.compareLists);
router.get('/:id', userController.getUserById);

module.exports = router;
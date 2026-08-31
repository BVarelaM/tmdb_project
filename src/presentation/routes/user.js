const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const { authenticateToken } = require('../../auth/middlewares/auth');

router.use((req, res, next) => {
  console.log(`request : ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', userController.registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 */
router.get('/', userController.getAllUsers);

// Protected routes 
router.use(authenticateToken);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data retrieved successfully
 */
router.get('/profile', userController.getProfile);

/**
 * @swagger
 * /api/users/lists/{listName}:
 *   post:
 *     summary: Add a movie to a user list
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the list (e.g., watchlist, favorites)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tmdbId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Movie added to list successfully
 */
router.post('/lists/:listName', userController.addMovieToList);

/**
 * @swagger
 * /api/users/lists/{listName}/{tmdbId}:
 *   delete:
 *     summary: Remove a movie from a user list
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listName
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tmdbId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie removed from list successfully
 */
router.delete('/lists/:listName/:tmdbId', userController.removeMovieFromList);

/**
 * @swagger
 * /api/users/compare/{targetUserId}:
 *   get:
 *     summary: Compare movie lists with another user
 *     tags: [Comparisons]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to compare lists with
 *     responses:
 *       200:
 *         description: Movie matches and comparisons retrieved successfully
 */
router.get('/compare/:targetUserId', userController.compareLists);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data found successfully
 */
router.get('/:id', userController.getUserById);

module.exports = router;
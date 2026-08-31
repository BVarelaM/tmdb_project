const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movie');

/**
 * @swagger
 * /api/movies/autocomplete:
 *   get:
 *     summary: Search movies for autocomplete suggestions
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search text for autocomplete
 *     responses:
 *       200:
 *         description: Autocomplete suggestions retrieved successfully
 */
router.get('/autocomplete', movieController.findMovieAutoComplete);

/**
 * @swagger
 * /api/movies/external-search:
 *   get:
 *     summary: Search movies from an external provider (TMDB)
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie title or keyword to search externally
 *     responses:
 *       200:
 *         description: External search results retrieved successfully
 */
router.get('/external-search', movieController.searchExternalMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get movie details by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID or TMDB ID
 *     responses:
 *       200:
 *         description: Movie details retrieved successfully
 *       404:
 *         description: Movie not found
 */
router.get('/:id', movieController.findMovieById);

module.exports = router;
const express = require('express');
const router = express.Router();

const userController = require('../controllers/movie');

router.get('/movie/:id', userController.findMovieById);
router.get('/movie/autocomplete', userController.findMovieAutoComplete);

module.exports = router;
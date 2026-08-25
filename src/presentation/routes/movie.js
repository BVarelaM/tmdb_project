const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movie');

router.get('/autocomplete', movieController.findMovieAutoComplete);
router.get('/external-search', movieController.searchExternalMovie);
router.get('/:id', movieController.findMovieById);

module.exports = router;
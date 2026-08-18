const { movieItem } = require('../models/Movie');

const getMovieById = async (tmdbId) => {
    if (!tmdbId) {
        const error = new Error('The movie Id is required');
        error.statusCode = 400;
        throw error;
    }
    
    const movie = await movieRepository.findById(tmdbId);
    if (!movie) {
        const error = new Error('Movie not found');
        error.statusCode = 404;
        throw error;
    }
    return movie;
};

const findMovieAutoComplete = async (query) => {
    if (!query) {
        const error = new Error('The query is required');
        error.statusCode = 400;
        throw error;
    }

    const movies = await movieRepository.searchMovies(query);
    return movies;
}

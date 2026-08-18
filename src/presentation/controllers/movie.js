const userService = require('../../business/services/movie');

const findMovieById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const movie = await userService.getMovieById(id);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        res.status(200).json({
            success: true,
            data: movie
        });
    } catch (error) {
        next(error);
    }
};

const findMovieAutoComplete = async (req, res, next) => {
    try {
        const { query } = req.query;
        const movies = await userService.searchMovie(query);

        res.status(200).json({
            success: true,
            data: movies
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    findMovieById: findMovieById,
    findMovieAutoComplete: findMovieAutoComplete
};
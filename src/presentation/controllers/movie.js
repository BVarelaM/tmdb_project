const movieService = require('../../business/services/movie');

const findMovieById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const movie = await movieService.getMovieById(id);

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
        const movies = await movieService.findMovieAutoComplete(query);

        res.status(200).json({
            success: true,
            data: movies
        });
    } catch (error) {
        next(error);
    }
};

async function searchExternalMovie(req, res) {
  try {
    const { title } = req.query;
    
    if (!title) {
      return res.status(400).json({ error: 'the title is required.' });
    }

    const data = await movieService.findExternalMovies(title);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



module.exports = {
    findMovieById,
    findMovieAutoComplete,
    searchExternalMovie
};
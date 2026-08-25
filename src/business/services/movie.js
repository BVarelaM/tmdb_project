const tmdbProvider = require('../../data/providers/tmdb');

const formatMovieItem = (i, posterSize = 'w500') => {
  if (!i) return null;

  return {
    tmdbId: i.id,
    externalId: i.id,
    title: i.title,
    originalTitle: i.original_title,
    overview: i.overview || '',
    releaseDate: i.release_date || null,
    rating: i.vote_average || 0,
    posterUrl: i.poster_path 
      ? `https://image.tmdb.org/t/p/${posterSize}${i.poster_path}` 
      : null,
    backdropUrl: i.backdrop_path 
      ? `https://image.tmdb.org/t/p/w1280${i.backdrop_path}` 
      : null
  };
};

const getMovieById = async (tmdbId) => {
  if (!tmdbId) {
    const error = new Error('The movie Id is required');
    error.statusCode = 400;
    throw error;
  }
  
  const movie = await tmdbProvider.getMovieDetails(tmdbId);
  if (!movie) {
    const error = new Error('Movie not found');
    error.statusCode = 404;
    throw error;
  }
  
  return {
    ...formatMovieItem(movie),
    runtime: movie.runtime || 0,
    status: movie.status || '',
    genres: movie.genres ? movie.genres.map(g => g.name) : [],
    tagline: movie.tagline || ''
  };
};

const findMovieAutoComplete = async (query) => {
  if (!query) {
    const error = new Error('The query is required');
    error.statusCode = 400;
    throw error;
  }

  const movies = await tmdbProvider.searchMovies(query);

  return movies.results 
    ? movies.results.map(i => {
        const base = formatMovieItem(i, 'w92');
        return {
          tmdbId: base.tmdbId,
          title: base.title,
          releaseDate: base.releaseDate,
          posterUrl: base.posterUrl
        };
      }) 
    : [];
};

async function findExternalMovies(title) {
  if (!title) {
    const error = new Error('The title query is required');
    error.statusCode = 400;
    throw error;
  }

  const movie = await tmdbProvider.searchMovies(title);
  
  return {
    totalResults: movie.total_results || 0,
    movies: movie.results ? movie.results.map(i => formatMovieItem(i)) : []
  };
}

module.exports = { 
  findExternalMovies, 
  getMovieById, 
  findMovieAutoComplete 
};
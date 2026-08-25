const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

function getFetchOptions() {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new Error('TMDB_ACCESS_TOKEN is not defined in environment variables.');
  }

  return {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
}
async function searchMovies(query, page = 1) {
  if (!query) throw new Error('the topic is required.');

  const url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=es-ES&page=${page}`;
  
  try {
    const response = await fetch(url, getFetchOptions());
    
    if (!response.ok) {
      throw new Error(`Something wrong with TMDB API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Something went wrong connecting with TMDB:', error.message);
    throw new Error('It wasnt possible to fetch movie information.');
  }
}

async function getMovieDetails(tmdbId) {
  if (!tmdbId) throw new Error('the TMDB ID is required.');

  const url = `${TMDB_BASE_URL}/movie/${tmdbId}?language=es-ES`;

  try {
    const response = await fetch(url, getFetchOptions());

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Something wrong with TMDB API: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Something went wrong fetching TMDB details:', error.message);
    throw new Error('It wasnt possible to fetch movie details.');
  }
}

module.exports = {
  searchMovies,
  getMovieDetails
};
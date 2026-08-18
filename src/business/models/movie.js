const movieItem = ({ tmdbId, title, posterPath, releaseDate }) => {
  if (!tmdbId || !title) {
    throw new Error('tmdbId y title required');
  }

  return {
    tmdbId: Number(tmdbId),
    title: title.trim(),
    posterPath: posterPath || null,
    releaseDate: releaseDate || null,
    addedAt: new Date()
  };
};

module.exports = { movieItem };
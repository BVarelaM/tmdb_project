const userRepository = require('../../data/repositories/user');
const { movieItem } = require('../models/Movie');

const VALID_LISTS = ['watchlist', 'favorites', 'watched'];

const getUserProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const { password, ...userProfile } = user;
  return userProfile;
};

const addMovieToList = async (userId, listName, movieData) => {
    
  if (!VALID_LISTS.includes(listName)) {
    const error = new Error(`List '${listName}' is not valid. Allowed lists: ${VALID_LISTS.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const movieItemVar = movieItem(movieData);

  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const added = await userRepository.addMovieToList(userId, listName, movieItemVar);
  if (!added) {
    const error = new Error(`The movie is already in your ${listName} list`);
    error.statusCode = 400;
    throw error;
  }

  return { message: `Movie added successfully to ${listName}`, movie: movieItemVar };
};

const removeMovieFromList = async (userId, listName, tmdbId) => {
  if (!VALID_LISTS.includes(listName)) {
    const error = new Error(`List '${listName}' is not valid. Allowed lists: ${VALID_LISTS.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  if (!tmdbId) {
    const error = new Error('The tmdbId of the movie is required');
    error.statusCode = 400;
    throw error;
  }

  const removed = await userRepository.removeMovieFromList(userId, listName, tmdbId);
  if (!removed) {
    const error = new Error(`The movie is not in your ${listName} list`);
    error.statusCode = 404;
    throw error;
  }

  return { message: `Movie removed from ${listName}` };
};

const compareUserLists = async (currentUserId, targetUserId, listName = 'watchlist') => {
  if (currentUserId === targetUserId) {
    const error = new Error('You cannot compare your list with your own');
    error.statusCode = 400;
    throw error;
  }

  const userA = await userRepository.findById(currentUserId);
  const userB = await userRepository.findById(targetUserId);

  if (!userA || !userB) {
    const error = new Error('One or both users do not exist');
    error.statusCode = 404;
    throw error;
  }

  const listA = userA[listName] || [];
  const listB = userB[listName] || [];

  const idsA = listA.map((movie) => movie.tmdbId);
  const idsB = new Set(listB.map((movie) => movie.tmdbId));

  const commonIds = idsA.filter((id) => idsB.has(id));

  const commonMovies = listA.filter((movie) => commonIds.includes(movie.tmdbId));

  return {
    comparedWith: userB.username,
    listName,
    totalCommon: commonMovies.length,
    commonMovies
  };
};

module.exports = {
  getUserProfile,
  addMovieToList,
  removeMovieFromList,
  compareUserLists
};
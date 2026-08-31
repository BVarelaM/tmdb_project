const { v4: uuidv4 } = require('uuid');
const recommendationRepository = require('../../data/repositories/recommendation');
const userRepository = require('../../data/repositories/user');
const { publishEvent } = require('../../config/rabbitmq');

const VALID_STATUSES = ['pending', 'accepted', 'rejected', 'all'];

const sendRecommendation = async (senderUserId, { receiverUserId, movie, message }) => {
  if (senderUserId === receiverUserId) {
    const error = new Error('You cannot recommend a movie to yourself');
    error.statusCode = 400;
    throw error;
  }

  // Verify existing  receptor
  const receiver = await userRepository.findByUserId(receiverUserId);
  if (!receiver) {
    const error = new Error('Receiver user not found');
    error.statusCode = 404;
    throw error;
  }

  const newRecommendation = {
    recommendationId: uuidv4(),
    senderUserId,
    receiverUserId,
    movie: {
      tmdbId: Number(movie.tmdbId),
      title: movie.title,
      posterPath: movie.posterPath || '',
      releaseYear: movie.releaseYear || ''
    },
    message: message || '',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  //return await recommendationRepository.create(newRecommendation);

  const savedRecommendation = await recommendationRepository.create(newRecommendation);

  await publishEvent('recommendation_created', {
    event: 'RECOMMENDATION_CREATED',
    statusText: 'Recommendation created and sent to your friend',
    recommendationId: savedRecommendation.recommendationId,
    senderUserId: savedRecommendation.senderUserId,
    receiverUserId: savedRecommendation.receiverUserId,
    movieTitle: savedRecommendation.movie.title,
    message: savedRecommendation.message,
    createdAt: savedRecommendation.createdAt
  });
  return savedRecommendation;
};

const getRecommendationsByStatus = async (receiverUserId, status = 'pending') => {
  const normalizedStatus = status.toLowerCase();

  if (!VALID_STATUSES.includes(normalizedStatus)) {
    const error = new Error(`Invalid status '${status}'. Allowed values: ${VALID_STATUSES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  return await recommendationRepository.findByReceiverUserId(receiverUserId, normalizedStatus);
};

const respondToRecommendation = async (receiverUserId, recommendationId, action) => {
  if (!['accepted', 'rejected'].includes(action)) {
    const error = new Error("Action must be 'accepted' or 'rejected'");
    error.statusCode = 400;
    throw error;
  }

  const rec = await recommendationRepository.findByRecommendationId(recommendationId);
  if (!rec) {
    const error = new Error('Recommendation not found');
    error.statusCode = 404;
    throw error;
  }

  // only the receptor can respond
  if (rec.receiverUserId !== receiverUserId) {
    const error = new Error('Unauthorized to respond to this recommendation');
    error.statusCode = 403;
    throw error;
  }

  if (rec.status !== 'pending') {
    const error = new Error(`Recommendation has already been ${rec.status}`);
    error.statusCode = 400;
    throw error;
  }

  // if its accepted it is added to watchlist
  if (action === 'accepted') {
    await userRepository.addMovieToList(receiverUserId, 'watchlist', rec.movie);
  }

  await recommendationRepository.updateStatus(recommendationId, action);

  return {
    message: `Recommendation ${action} successfully`,
    recommendationId,
    action
  };
};

module.exports = {
  sendRecommendation,
  getRecommendationsByStatus,
  respondToRecommendation
};
const userService = require('../../business/services/user');

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userProfile = await userService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    next(error);
  }
};

const addMovieToList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listName } = req.params;
    const movieData = req.body;

    const result = await userService.addMovieToList(userId, listName, movieData);

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.movie
    });
  } catch (error) {
    next(error);
  }
};

const removeMovieFromList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listName, tmdbId } = req.params;

    const result = await userService.removeMovieFromList(userId, listName, tmdbId);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

const compareLists = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const { targetUserId } = req.params;
    const { listName } = req.query; 

    const result = await userService.compareUserLists(
      currentUserId,
      targetUserId,
      listName || 'watchlist'
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  addMovieToList,
  removeMovieFromList,
  compareLists
};
const recommendationService = require('../../business/services/recommendation');

const sendRecommendation = async (req, res, next) => {
  try {
    const senderUserId = req.user.userId;
    const result = await recommendationService.sendRecommendation(senderUserId, req.body);

    res.status(201).json({
      success: true,
      message: 'Recommendation creatd and sent successfully to your friend',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getRecommendations = async (req, res, next) => {
  try {
    const receiverUserId = req.user.userId;
    const { status } = req.query; 

    const recommendations = await recommendationService.getRecommendationsByStatus(
      receiverUserId,
      status
    );

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

const respondToRecommendation = async (req, res, next) => {
  try {
    const receiverUserId = req.user.userId;
    const { recommendationId } = req.params;
    const { action } = req.body; // "accepted" | "rejected"

    const result = await recommendationService.respondToRecommendation(
      receiverUserId,
      recommendationId,
      action
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
  sendRecommendation,
  getRecommendations,
  respondToRecommendation
};
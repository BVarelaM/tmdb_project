const { getDB } = require('../../config/database/db');

const COLLECTION_NAME = 'friend_recommendations';

// Crear una recomendación
const create = async (recommendationData) => {
  const db = getDB();
  await db.collection(COLLECTION_NAME).insertOne(recommendationData);
  return recommendationData;
};

const findByRecommendationId = async (recommendationId) => {
  const db = getDB();
  return await db.collection(COLLECTION_NAME).findOne({ recommendationId });
};

const findByReceiverUserId = async (receiverUserId, status) => {
  const db = getDB();
  const query = { receiverUserId };

  if (status && status !== 'all') {
    query.status = status;
  }

  return await db.collection(COLLECTION_NAME)
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();
};

const updateStatus = async (recommendationId, status) => {
  const db = getDB();
  const result = await db.collection(COLLECTION_NAME).updateOne(
    { recommendationId },
    { $set: { status, updatedAt: new Date() } }
  );
  return result.modifiedCount > 0;
};

module.exports = {
  create,
  findByRecommendationId,
  findByReceiverUserId,
  updateStatus
};
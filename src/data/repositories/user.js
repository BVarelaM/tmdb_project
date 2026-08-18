const { ObjectId } = require('mongodb');
const { getDB } = require('../../config/database/db');

const COLLECTION_NAME = 'users';

const findByEmail = async (email) => {
  const db = getDB();
  return await db.collection(COLLECTION_NAME).findOne({ email: email.toLowerCase() });
};

const findByUsername = async (username) => {
  const db = getDB();
  return await db.collection(COLLECTION_NAME).findOne({ username });
};

const findById = async (id) => {
  const db = getDB();
  return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
};

const create = async (user) => {
  const db = getDB();
  const result = await db.collection(COLLECTION_NAME).insertOne(user);
  return { _id: result.insertedId, ...user };
};

const addMovieToList = async (userId, listName, movieItem) => {
  const db = getDB();
  
  const filter = {
    _id: new ObjectId(userId),
    [`${listName}.tmdbId`]: { $ne: movieItem.tmdbId }
  };

  const update = {
    $push: { [listName]: movieItem },
    $set: { updatedAt: new Date() }
  };

  const result = await db.collection(COLLECTION_NAME).updateOne(filter, update);
  return result.modifiedCount > 0;
};

const removeMovieFromList = async (userId, listName, tmdbId) => {
  const db = getDB();

  const filter = { _id: new ObjectId(userId) };
  const update = {
    $pull: { [listName]: { tmdbId: Number(tmdbId) } },
    $set: { updatedAt: new Date() }
  };

  const result = await db.collection(COLLECTION_NAME).updateOne(filter, update);
  return result.modifiedCount > 0;
};

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  create,
  addMovieToList,
  removeMovieFromList
};